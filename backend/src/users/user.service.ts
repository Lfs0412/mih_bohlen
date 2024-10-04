import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { User} from "../entities/user.entity";
import { CreateUserDTO } from './createUser.DTO';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>, // Injecting the TypeORM repository
    ) {}

    /**
     * Create a new user and hash their password before saving.
     */
    async create(data: CreateUserDTO): Promise<User> {
        const existingUser = await this.userRepository.findOne({
            where: {username: data.username},
        })
        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const user = this.userRepository.create({
            username: data.username,
            password: await hash(data.password, 12), // Hash password before saving
            firstname: data.firstname,
            lastname: data.lastname,
            apiKey: data.apiKey,
        });

        return this.userRepository.save(user); // Save the user to the database
    }

    /**
     * Get a user by a filter query (e.g., by email or id).
     */
    async getUser(query: FindOptionsWhere<User>): Promise<User> {
        const user = await this.userRepository.findOne({ where: query }); // Find one user matching the query
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    /**
     * Get all users.
     */
    async getUsers(): Promise<User[]> {
        return this.userRepository.find(); // Find all users
    }

    /**
     * Update a user's information.
     */
    async updateUser(id: { id: number }, data: Partial<User>): Promise<void> {
        const result = await this.userRepository.update(id, data); // Update the user by ID
        if (result.affected === 0) {
            throw new NotFoundException('User not found');
        }
    }


    /**
     * Get or create a user by email. If the user exists, return them;
     * otherwise, create a new user.
     */
    async getOrCreateUser(data: CreateUserDTO): Promise<User> {
        let user = await this.userRepository.findOne({ where: { username: data.username } });
        if (!user) {
            user = await this.create(data); // Create user if not found
        }
        return user;
    }
}
