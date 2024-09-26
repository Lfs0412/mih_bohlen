
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class Entry {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    entryName: string;

    @Column("text", { array: true })
    messages: string[];

    @Column()
    status: string;

    @Column()
    createdAt: Date;

    @ManyToOne(() => Project, project => project.entries)
    project: Project;

    @Column({ unique: true })
    threadId: string;
}
