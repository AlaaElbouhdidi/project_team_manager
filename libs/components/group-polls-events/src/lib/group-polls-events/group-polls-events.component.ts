import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CreateEventFormData, Event, Group, Poll, Team } from '@api-interfaces';
import { Subject, takeUntil } from 'rxjs';
import {
    AlertService,
    AuthService,
    EventService,
    GroupService,
    PollService,
    TeamService
} from '@services';
import { slideAnimation, itemAnimation } from '@animations';

/**
 * Group polls events component
 */
@Component({
    selector: 'mate-team-group-polls-events',
    templateUrl: './group-polls-events.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./group-polls-events.component.scss'],
    animations: [slideAnimation, itemAnimation]
})
export class GroupPollsEventsComponent implements OnInit, OnDestroy {
    /**
     * Subject for unsubscribing from observables
     * @private
     */
    private destroy$ = new Subject();
    /**
     * Group
     */
    group: Group = {} as Group;
    /**
     * Polls
     */
    polls: Poll[] = [];
    /**
     * Events
     */
    events: Event[] = [];
    /**
     * Event to show the description of
     */
    descriptionEvent: Event = {} as Event;
    /**
     * Reference for the confirmation modal
     */
    confirmationModalRef: NgbModalRef | undefined;
    /**
     * Modal reference
     */
    modalRef: NgbModalRef | undefined;
    /**
     * Determines if user is admin
     */
    isAdmin = false;

    /**
     * Constructor of group polls events
     * @param modalService {NgbModal}
     * @param pollService {PollService}
     * @param alertService {AlertService}
     * @param authService {AuthService}
     * @param groupService {GroupService}
     * @param eventService {EventService}
     * @param teamService {TeamService}
     */
    constructor(
        private modalService: NgbModal,
        private pollService: PollService,
        private alertService: AlertService,
        private authService: AuthService,
        private groupService: GroupService,
        private eventService: EventService,
        private teamService: TeamService
    ) {}

    /**
     * Opens a modal
     *
     * @param content {unknown} The modal reference
     */
    openModal(content: unknown): void {
        this.modalRef = this.modalService.open(content, {
            windowClass: 'dark-modal'
        });
    }

    /**
     * Closes a modal
     */
    closeModal(): void {
        this.modalRef?.dismiss();
    }

    /**
     * Opens the confirmation modal
     *
     * @param content {unknown} The modal to open
     * @returns {Promise<boolean>} A promise containing true if modal is closed and false if modal is dismissed
     */
    async openConfirmationModal(content: unknown): Promise<boolean> {
        this.confirmationModalRef = this.modalService.open(content, {
            windowClass: 'dark-modal'
        });
        try {
            await this.confirmationModalRef.result;
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Dismiss the confirmation modal
     */
    dismissConfirmationModal(): void {
        this.confirmationModalRef?.dismiss();
    }

    /**
     * Close the confirmation modal
     *
     * @param ind {boolean} Indicates if action was confirmed
     */
    closeConfirmationModal(ind: boolean): void {
        this.confirmationModalRef?.close(ind);
    }

    /**
     * Create a poll
     *
     * @param data {Poll} The poll to create
     */
    async createPoll(data: Poll): Promise<void> {
        try {
            await this.pollService.createPoll(data);
            this.alertService.addAlert({
                type: 'success',
                message: 'Poll successfully created'
            });
        } catch (e) {
            this.alertService.addAlert({
                type: 'error',
                message: e.message
            });
        }
        this.closeModal();
    }

    /**
     * Update a poll
     *
     * @param poll {Poll} The poll data to update
     */
    async updatePoll(poll: Poll): Promise<void> {
        try {
            const user = this.authService.getCurrentUser();
            if (poll.usersVoted.includes(user.uid, 0) || !poll.id) {
                return;
            }
            poll.usersVoted.push(user.uid);
            await this.pollService.updatePoll(poll.id, poll);
            this.alertService.addAlert({
                type: 'success',
                message: 'Vote successfully registered'
            });
        } catch (e) {
            this.alertService.addAlert({
                type: 'error',
                message: e.message
            });
        }
    }

    /**
     * Delete a poll
     *
     * @param id {string} The id of the poll to delete
     * @param modal {unknown} The confirmation modal to open
     */
    async deletePoll(id: string, modal: unknown): Promise<void> {
        const result = await this.openConfirmationModal(modal);
        if (!result) {
            return;
        }
        try {
            await this.pollService.deletePoll(id);
            this.alertService.addAlert({
                type: 'success',
                message: 'Poll successfully deleted'
            });
        } catch (e) {
            this.alertService.addAlert({
                type: 'error',
                message: e.message
            });
        }
    }

    /**
     * Show the description of an event
     *
     * @param event {Event} The event to show the description of
     * @param modal {unknown} The description modal reference
     */
    showEventDescription(event: Event, modal: unknown) {
        this.descriptionEvent = event;
        this.openModal(modal);
    }

    /**
     * Create an event
     *
     * @param data {CreateEventFormData} Data to create the event with
     */
    async createEvent(data: CreateEventFormData): Promise<void> {
        const event: Event = {
            name: data.name,
            description: data.description,
            date: data.date,
            done: false,
            participants: [],
            groupID: this.groupService.currentGroupId
        };
        try {
            await this.eventService.createEvent(event);
            this.alertService.addAlert({
                type: 'success',
                message: 'Event successfully created'
            });
        } catch (e) {
            this.alertService.addAlert({
                type: 'error',
                message: e.message
            });
        }
        this.closeModal();
    }

    /**
     * Update an event
     *
     * @param event {Event} The event data to update
     * @param closeModal {boolean} Determines if modal should be closed after update
     */
    async updateEvent(event: Event, closeModal: boolean): Promise<void> {
        if (!event.id) {
            return;
        }
        try {
            await this.eventService.updateEvent(event.id, event);
            this.alertService.addAlert({
                type: 'success',
                message: 'Successfully updated'
            });
        } catch (e) {
            this.alertService.addAlert({
                type: 'error',
                message: e.message
            });
        }
        if (closeModal) {
            this.closeModal();
        }
    }

    /**
     * Cancel participation from event
     *
     * @param event {Event} The event to cancel the participation from
     */
    async cancelParticipation(event: Event) {
        if (!event.id) {
            return;
        }

        try {
            await this.updateEvent(event, false);
            const teams = (await this.teamService.getTeamsSync(
                event.id
            )) as Team[];
            const user = this.authService.getCurrentUser();
            for (let i = 0; i < teams.length; i++) {
                const deletedUser = teams[i].participants.find(
                    (participant) => participant.uid === user.uid
                );
                if (deletedUser && event.id) {
                    teams[i].participants.splice(
                        teams[i].participants.indexOf(deletedUser),
                        1
                    );
                    try {
                        await this.teamService.updateTeam(event.id, teams[i]);
                    } catch (e) {
                        this.alertService.addAlert({
                            type: 'error',
                            message: e.message
                        });
                    }
                    return;
                }
            }
        } catch (e) {
            this.alertService.addAlert({
                type: 'error',
                message: e.message
            });
        }
    }

    /**
     * Open edit modal
     *
     * @param event {Event} The event to edit
     * @param modal {unknown} The reference of the modal to open
     */
    editEvent(event: Event, modal: unknown): void {
        this.descriptionEvent = event;
        this.openModal(modal);
    }

    /**
     * Delete an event
     *
     * @param id {string} The id of the event to delete
     * @param modal {unknown} The confirmation modal to open
     */
    async deleteEvent(id: string, modal: unknown): Promise<void> {
        const result = await this.openConfirmationModal(modal);
        if (!result) {
            return;
        }
        try {
            await this.eventService.deleteEvent(id);
            this.alertService.addAlert({
                type: 'success',
                message: 'Event successfully deleted'
            });
        } catch (e) {
            this.alertService.addAlert({
                type: 'error',
                message: e.message
            });
        }
    }

    /**
     * Checks if a given id matches the user id
     *
     * @param adminId {string} The id of the admin
     * @returns {boolean} True if user id matches the given id, false if the ids do not match
     */
    checkIfAdmin(adminId: string): boolean {
        const userId = this.authService.getCurrentUser().uid;
        return userId === adminId;
    }

    /**
     * Get group and polls of group on component init
     */
    async ngOnInit(): Promise<void> {
        try {
            const group = await this.groupService.getGroupById(
                this.groupService.currentGroupId
            );
            this.group = group ? group : ({} as Group);
            if (group) {
                this.isAdmin = this.checkIfAdmin(group.admin);
            }
            this.pollService
                .getPolls()
                .pipe(takeUntil(this.destroy$))
                .subscribe((data) => {
                    this.polls = data as Poll[];
                });
            this.eventService
                .getActiveEventsOfGroup()
                .pipe(takeUntil(this.destroy$))
                .subscribe((data: Event[]) => {
                    this.events = data;
                });
        } catch (e) {
            this.alertService.addAlert({
                type: 'error',
                message: e.message
            });
        }
    }

    /**
     * Unsubscribe from observables
     */
    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
