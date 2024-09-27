import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {ProjectsService} from "./projects.service";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import { CurrentUser} from "../auth/current-user.decorator";
import { TokenPayload} from "../auth/token-payload.interface";

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectService: ProjectsService) {}

    @Post('create')
    createProject(
        @Body() project: CreateProjectDTO,
        @CurrentUser() user: TokenPayload
    ) {
        const createdProject = this.projectService.createProject(project, user.userId);
        return { message: 'Project created successfully', project: createdProject };
    }

    @Put('update/:id')
    updateProject(
        @Param('id') id: number,
        @Body() project: CreateProjectDTO,
        @CurrentUser() user: TokenPayload
    ) {
        const updatedProject = this.projectService.updateProject(id, project, user.userId);
        return { message: 'Project updated successfully', project: updatedProject };
    }

    @Delete('delete/:id')
    deleteProject(
        @Param('id') id: number,
        @CurrentUser() user: TokenPayload
    ) {
        this.projectService.deleteProject(id, user.userId);
        return { message: 'Project deleted successfully', project: id };
    }

    @Get()
    async fetchAllProjects(
        @Query('page') page: number = 1,  // Default to page 1 if no page is provided
        @Query('limit') limit: number = 10, // Default limit of 10 per page
        @CurrentUser() user: TokenPayload
    ) {
        const projects = await this.projectService.getAllProjects(page, limit, user.userId);
        return { message: 'Received projects successfully', projects };
    }

    @Get('favorites')
    async fetchFavoriteProjects(
        @Query('page') page: number = 1,  // Default to page 1 if no page is provided
        @Query('limit') limit: number = 10, // Default limit of 10 per page
        @CurrentUser() user: TokenPayload
    ) {
        const favoriteProjects = await this.projectService.getFavoriteProjects(page, limit, user.userId);
        return { message: 'Received favorite projects successfully', favoriteProjects };
    }
}
