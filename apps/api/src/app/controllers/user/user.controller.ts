import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from '../../services/user/user.service';
import { FirebaseAuthGuard } from '../../guards/firebase-auth.guard';
import * as firebase from 'firebase-admin';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(FirebaseAuthGuard)
    @Get()
    async getUsers(): Promise<firebase.auth.ListUsersResult> {
        return this.userService.getUsers();
    }
}