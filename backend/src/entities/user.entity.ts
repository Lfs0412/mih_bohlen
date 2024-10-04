// @ts-ignore
import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import {Project} from "./project.entity";
import { Exclude } from 'class-transformer';


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    apiKey: string;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    @Exclude()
    password: string;

    @Column({nullable: true})
    @Exclude()
    refreshToken: string;

    @OneToMany(() => Project, project => project.user)
    projects: Project[];
}
