import { Injectable, NotFoundException } from '@nestjs/common';
import { Project } from "../entities/project.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export class ProjectsService {

    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    // Create a project and associate it with the current user
    async createProject(project: CreateProjectDTO, userId: number): Promise<Project> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const newProject = this.projectRepository.create({
            ...project,
            user,  // Associate the project with the user entity
        });

        return this.projectRepository.save(newProject);
    }

    // Delete a project that belongs to the current user
    async deleteProject(id: number, userId: number): Promise<void> {
        const result = await this.projectRepository.delete({ id, user: { id: userId } });
        if (result.affected === 0) {
            throw new NotFoundException('Project not found or you do not have permission to delete it.');
        }
    }

    // Update a project that belongs to the current user
    async updateProject(id: number, project: UpdateProjectDTO, userId: number): Promise<Project> {
        const existingProject = await this.projectRepository.findOne({
            where: { id, user: { id: userId } },  // Ensure the project belongs to the user
        });
        if (!existingProject) {
            throw new NotFoundException('Project not found or you do not have permission to update it.');
        }

        // Update the fields with the new data
        existingProject.projectName = project.projectName;
        existingProject.projectDescription = project.projectDescription;

        // Save the updated project
        return await this.projectRepository.save(existingProject);
    }

    // Fetch all projects for the current user with pagination
    async getAllProjects(page: number, limit: number, userId: number): Promise<any> {
        const [projects, totalProjects] = await this.projectRepository.findAndCount({
            where: { user: { id: userId } },  // Fetch only the projects belonging to the current user
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            totalProjects,
            currentPage: page,
            totalPages: Math.ceil(totalProjects / limit),
            projects,
        };
    }

    // Fetch favorite projects for the current user with pagination
    async getFavoriteProjects(page: number, limit: number, userId: number): Promise<any> {
        const [projects, totalProjects] = await this.projectRepository.findAndCount({
            where: { user: { id: userId }, isFavorite: true },  // Fetch only favorite projects belonging to the current user
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            totalProjects,
            currentPage: page,
            totalPages: Math.ceil(totalProjects / limit),
            projects,
        };
    }

    async getProject(id: number) {
        return await this.projectRepository.findOne({where: { id }});
    }
}
