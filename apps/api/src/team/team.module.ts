import { Module } from '@nestjs/common';
import { TeamService } from './service/team.service';
import { TeamController } from './controller/team.controller';
import { FirebaseService } from '../firebase/service/firebase.service';
/**
 * The TeamModule
 * */
@Module({
    controllers: [TeamController],
    providers: [TeamService, FirebaseService],
})
export class TeamModule {}
