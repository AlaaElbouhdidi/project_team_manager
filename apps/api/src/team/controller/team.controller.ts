import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { TeamService } from '../service/team.service';
import { CreateTeamDto } from '../dto/create-team.dto';
import { UpdateTeamDto } from '../dto/update-team.dto';
import { AppConstants } from '../../app/constants/app.constants';
import { TeamConstants } from '../constants/team.constants';
import { Team } from '@api-interfaces';
import { TeamOwner } from '../decorator/team.owner.decorator';
/**
 * The TeamController
 **/
@ApiBearerAuth()
@ApiTags('Team')
@Controller('team')
export class TeamController {
    /**
     * The constructor that injects the TeamService in the TeamController
     * @param {TeamService} teamService The injected TeamService
     **/
    constructor(private readonly teamService: TeamService) {}
    /**
     * The route handler to create a team
     * @param {admin.auth.DecodedIdToken} user The currently logged in user
     * @param {CreateTeamDto} createTeamDto The DTO that the route handler forwards to the TeamService
     * @returns {Promise<Team>} Returns the created team
     * */
    @TeamOwner()
    @Post(':groupId')
    @ApiOperation({ summary: 'Create a new team' })
    @ApiCreatedResponse({
        description: 'Team created',
        type: CreateTeamDto
    })
    @ApiBadRequestResponse({
        description: 'Invalid data sent',
        schema: TeamConstants.BAD_REQUEST
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
        schema: AppConstants.UNAUTHORIZED
    })
    @ApiInternalServerErrorResponse({
        description: 'Unexpected error',
        schema: AppConstants.INTERNAL_SERVER_ERROR
    })
    async create(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
        return await this.teamService.create(createTeamDto);
    }
    /**
     * The route handler that fetches all teams
     * @returns {Promise<Team[]>} Returns all teams
     * */
    @Get()
    @ApiOperation({ summary: 'Get all teams' })
    @ApiOkResponse({
        description: 'Fetched all teams',
        type: [CreateTeamDto]
    })
    @ApiNotFoundResponse({
        description: 'No teams found',
        schema: TeamConstants.NONE_FOUND
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
        schema: AppConstants.UNAUTHORIZED
    })
    @ApiInternalServerErrorResponse({
        description: 'Unexpected error',
        schema: AppConstants.INTERNAL_SERVER_ERROR
    })
    async findAll(): Promise<Team[]> {
        return await this.teamService.findAll();
    }
    /**
     * The route handler that gets a team by id
     * @param {string} id The id of the team to find
     * @returns {Promise<Group>} Returns the requested team
     * */
    @Get(':id')
    @ApiOperation({ summary: 'Get a team by id' })
    @ApiOkResponse({
        description: 'Team fetched',
        type: CreateTeamDto
    })
    @ApiNotFoundResponse({
        description: 'Team not found',
        schema: TeamConstants.NOT_FOUND
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
        schema: AppConstants.UNAUTHORIZED
    })
    @ApiInternalServerErrorResponse({
        description: 'Unexpected error',
        schema: AppConstants.INTERNAL_SERVER_ERROR
    })
    async findOne(@Param('id') id: string): Promise<Team> {
        return await this.teamService.findOne(id);
    }
    /**
     * The route handler that updates a team by id
     * @param {string} id The id of the team to update
     * @returns {Promise<Team>} Returns the updated team
     * */
    @TeamOwner()
    @Patch(':id')
    @ApiOperation({ summary: 'Update a team by id' })
    @ApiOkResponse({
        description: 'Team edited',
        type: CreateTeamDto
    })
    @ApiBadRequestResponse({
        description: 'Invalid data sent',
        schema: TeamConstants.BAD_REQUEST
    })
    @ApiNotFoundResponse({
        description: 'Team not found',
        schema: TeamConstants.NOT_FOUND
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
        schema: AppConstants.UNAUTHORIZED
    })
    @ApiInternalServerErrorResponse({
        description: 'Unexpected error',
        schema: AppConstants.INTERNAL_SERVER_ERROR
    })
    async update(
        @Param('id') id: string,
        @Body() updateTeamDto: UpdateTeamDto
    ): Promise<Team> {
        return await this.teamService.update(id, updateTeamDto);
    }
    /**
     * The route handler that deletes a team by id
     * @param {string} id The id of the team to delete
     * @returns {Promise<Team>} Returns the deleted team
     * */
    @TeamOwner()
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a team by id' })
    @ApiOkResponse({
        description: 'Team deleted',
        type: CreateTeamDto
    })
    @ApiNotFoundResponse({
        description: 'Team not found',
        schema: TeamConstants.NOT_FOUND
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
        schema: AppConstants.UNAUTHORIZED
    })
    @ApiInternalServerErrorResponse({
        description: 'Unexpected error',
        schema: AppConstants.INTERNAL_SERVER_ERROR
    })
    async remove(@Param('id') id: string): Promise<Team> {
        return await this.teamService.remove(id);
    }
}
