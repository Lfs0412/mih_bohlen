
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class Entry {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    index: string;

    @Column()
    entryName: string;


    @Column({ default: false})
    pending: boolean;

    @Column()
    createdAt: Date;

    @ManyToOne(() => Project, project => project.entries)
    project: Project;

    @Column({ unique: true })
    threadId: string;
}
