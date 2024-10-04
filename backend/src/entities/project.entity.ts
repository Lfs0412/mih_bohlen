import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Entry } from "./entry.entity";
import {Exclude} from "class-transformer";

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number;


    @ManyToOne(() => User, user => user.projects)
    @Exclude()
    user: User;

    @Column()
    projectName: string;

    @Column()
    projectDescription: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ default: false })
    isFavorite: boolean;

    @OneToMany(() => Entry, entry => entry.project)
    entries: Entry[];
}
