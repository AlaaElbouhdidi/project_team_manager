import { Injectable } from '@angular/core';
import { Group, Member, User } from '@api-interfaces';
import {
    AngularFirestore,
    AngularFirestoreCollection
} from '@angular/fire/compat/firestore';

import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

/**
 * Group service
 */
@Injectable({
    providedIn: 'root'
})
export class GroupService {
    /**
     * ID of the current group
     */
    currentGroupId = '';
    groupCollection: AngularFirestoreCollection<Group>;

    private success = false;
    private subject = new BehaviorSubject<string>('');

    /**
     * Constructor of group service
     * @param afs {AngularFirestore}
     * @param authService {AuthService},
     * @param userService {UserService}
     */
    constructor(
        public afs: AngularFirestore,
        public authService: AuthService,
        private userService: UserService
    ) {
        this.groupCollection = this.afs.collection('groups');
    }

    /**
     * Get a group by id
     *
     * @param groupId {string} The id of the group to get
     * @returns {Promise<Group | undefined>} A Promise containing the group or undefined if no group found
     */
    getGroupById(groupId: string): Promise<Group | undefined> {
        return this.afs
            .collection<Group>('groups')
            .doc(groupId)
            .ref.get()
            .then((group) => group.data());
    }

    async getUserGroups() {
        const { uid } = this.authService.getCurrentUser();
        const user = (
            await this.afs.collection(`/users`).doc<User>(uid).ref.get()
        ).data();
        const userGroups: Group[] = [];
        if (user) {
            const { groups } = user;
            if (!groups) {
                return [];
            }
            groups.forEach(async (groupId) => {
                const group = (
                    await this.groupCollection.doc(groupId).ref.get()
                ).data();
                if (group) {
                    userGroups.push({ ...group, id: groupId });
                }
            });
        } else {
            return [];
        }
        return userGroups;
    }

    async getUserInvitations(): Promise<Group[]> {
        const { uid } = this.authService.getCurrentUser();
        const user = (
            await this.afs.collection(`/users`).doc<User>(uid).ref.get()
        ).data();
        const groupInvitations: Group[] = [];
        if (!user) {
            return [];
        }
        const { invitations } = user;
        if (!invitations) {
            return [];
        }
        for (const invitation of invitations) {
            const group = (
                await this.groupCollection.doc(invitation).ref.get()
            ).data();
            if (group) {
                groupInvitations.push({ ...group, id: invitation });
            }
        }
        return groupInvitations;
    }

    async sendUserGroupInvitation(user: User, groupId: string) {
        let { invitations } = user;
        if (!invitations) {
            invitations = [];
        }
        await this.afs
            .collection('users')
            .doc(user.uid)
            .set(
                {
                    invitations: [...invitations, groupId]
                },
                { merge: true }
            );
    }

    async declineUserGroupInvitation(groupId: string): Promise<void> {
        const currentUser = this.authService.getCurrentUser();
        const user = await this.afs
            .collection('users')
            .doc(currentUser.uid)
            .ref.get()
            .then((doc) => {
                return doc.data() as User;
            });
        let { invitations } = user;
        if (!invitations) {
            invitations = [];
        }
        const updatedInvitations = invitations.filter(
            (groupInvitationId) => groupInvitationId !== groupId
        );
        await this.afs.collection('users').doc(currentUser.uid).set(
            {
                invitations: updatedInvitations
            },
            { merge: true }
        );
    }

    async acceptUserGroupInvitation(groupId: string): Promise<void> {
        const currentUser = this.authService.getCurrentUser();
        const user = await this.afs
            .collection('users')
            .doc(currentUser.uid)
            .ref.get()
            .then((doc) => {
                return doc.data() as User;
            });
        let { invitations, groups } = user;
        if (!invitations) {
            invitations = [];
        }
        if (!groups) {
            groups = [];
        }
        const updatedInvitations = invitations.filter(
            (groupInvitationId) => groupInvitationId !== groupId
        );
        await this.afs
            .collection('users')
            .doc(currentUser.uid)
            .set(
                {
                    invitations: updatedInvitations,
                    groups: [...groups, groupId]
                },
                { merge: true }
            );
        await this.addMemberToGroup(groupId, {
            uid: user.uid,
            isAdmin: false,
            email: user.email
        });
    }

    async removeUserGroupReference(
        groupId: string,
        userId: string
    ): Promise<void> {
        const user = await this.userService.getUserByUid(userId);
        let { groups } = user;
        if (!groups) {
            groups = [];
        }
        const updatedGroupsReferences = groups.filter(
            (groupReference) => groupReference !== groupId
        );
        await this.afs.collection('users').doc(user.uid).set(
            {
                groups: updatedGroupsReferences
            },
            { merge: true }
        );
    }

    toggleSuccess(gid: string): void {
        if (gid != '') {
            this.success = true;
        }
        this.subject.next(gid);
    }
    onToggle(): Observable<string> {
        return this.subject.asObservable();
    }

    async addNewGroup(g: Group, m: Member): Promise<string> {
        const groupId = await this.groupCollection.add(g).then((ref) => {
            this.groupCollection
                .doc(ref.id)
                .collection('members')
                .doc(m.email)
                .set(m);
            return ref.id;
        });
        const { uid } = this.authService.getCurrentUser();
        const user = (
            await this.afs.collection(`/users`).doc<User>(uid).ref.get()
        ).data();
        if (user) {
            let { groups } = user;
            if (!groups) {
                groups = [];
            }
            await this.afs
                .collection(`/users`)
                .doc(uid)
                .set(
                    {
                        groups: [...groups, groupId]
                    },
                    { merge: true }
                );
        }
        return groupId;
    }
    async addMemberToGroup(gid: string, m: Member): Promise<void> {
        await this.groupCollection
            .doc(gid)
            .collection('members')
            .doc(m.email)
            .set(m);
    }
    async isAlreadyMember(gid: string, email: string): Promise<boolean> {
        const q = await this.afs
            .collection('groups/' + gid + '/members/')
            .ref.where('email', '==', email)
            .get()
            .then((qs) => {
                if (qs.size > 0) return true;
                else return false;
            });
        return q;
    }
    getAllMembers(gid: string): Observable<Member[]> {
        return this.afs
            .collection<Member>(`groups/${gid}/members`)
            .valueChanges({ idField: 'id' });
    }
    deleteMember(gid: string, m: Member) {
        this.afs
            .collection<Member>(`groups/${gid}/members`)
            .doc(m.email)
            .delete();
    }
    toggleIsAdmin(gid: string, m: Member) {
        this.afs
            .collection<Member>(`groups/${gid}/members`)
            .doc(m.email)
            .update({ isAdmin: !m.isAdmin });
    }
    /**
     * update the name or the description of a group
     */
    async updateGroup(
        gid: string,
        name: string,
        description: string
    ): Promise<void> {
        await this.groupCollection.doc(gid).update({
            name: name,
            description: description
        });
    }
    /**
     * delete a group
     */
    async deleteGroup(gid: string): Promise<void> {
        await this.afs
            .collection(`groups/${gid}/members`)
            .get()
            .forEach((qs) => {
                qs.docs.forEach((i) => {
                    this.afs
                        .collection(`groups/${gid}/members`)
                        .doc(i.id)
                        .delete();
                });
            });
        await this.afs
            .collection(`groups/${gid}/datePolls`)
            .get()
            .forEach((qs) => {
                qs.docs.forEach((i) => {
                    this.afs
                        .collection(`groups/${gid}/datePolls`)
                        .doc(i.id)
                        .delete();
                });
            });
        await this.groupCollection.doc(gid).delete();
    }
}
