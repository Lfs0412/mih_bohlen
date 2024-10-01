import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Entry} from "../entities/entry.entity";
import {Repository} from "typeorm";
import {Project} from "../entities/project.entity";
import { CreateEntryDTO} from "./DTOs/CreateEntryDTO";
import {User} from "../entities/user.entity";
import OpenAI from "openai";
import {JobService} from "../job/job.service";
import {AIRequestDTO} from "../job/DTOs/AiRequestDTO";

@Injectable()
export class EntriesService {
    constructor(
        @InjectRepository(Entry)
        private readonly entriesRepository: Repository<Entry>,
        @InjectRepository(Project)
        private readonly projectsRepository: Repository<Project>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jobService: JobService,

    ) {}

    // Einen neuen Eintrag für ein bestimmtes Projekt erstellen
    async createEntry(userId: number, createEntryDto: CreateEntryDTO): Promise<Entry> {
        console.log(createEntryDto);
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const openai = new OpenAI({
            apiKey: user.apiKey
        });
        console.log(user)
        const emptyThread = await openai.beta.threads.create();
        const project = await this.projectsRepository.findOne({ where: { id: createEntryDto.projectId } });
        if (!project) {
            throw new NotFoundException(`Projekt mit ID ${createEntryDto.projectId} nicht gefunden`);
        }

        // Neuen Eintrag erstellen
        const newEntry = this.entriesRepository.create({
            entryName: createEntryDto.entryName,
            index: createEntryDto.index,
            pending: true,
            project: project,
            threadId: emptyThread.id,
            createdAt: new Date(),
        });

        // Speichere den neuen Eintrag, um die entryId zu erhalten
        const savedEntry = await this.entriesRepository.save(newEntry);

        // Erstelle das erste Nachricht-Objekt für den AI-Request

        const firstMessageToAi: AIRequestDTO = {
            entryId: savedEntry.id, // Verwende die id des gespeicherten Eintrags
            apiKey: user.apiKey, // Verwende den apiKey des Nutzers
            threadId: emptyThread.id,
            message: createEntryDto.messages };

        // Sende den Request an den JobService
        await this.jobService.createRequest(firstMessageToAi);

        return savedEntry;
    }


    // Alle Einträge für ein bestimmtes Projekt abrufen
    async getEntriesByProjectId(projectId: number): Promise<Entry[]> {
        const project = await this.projectsRepository.findOne({
            where: { id: projectId },
            relations: ['entries'],
        });

        if (!project) {
            throw new NotFoundException(`Projekt mit ID ${projectId} nicht gefunden`);
        }

        return project.entries;
    }

    // Einen bestimmten Eintrag abrufen
    async getEntryById(id: number): Promise<Entry> {
        const entry = await this.entriesRepository.findOne({
            where: { id },
            relations: ['project'],
        });
        if (!entry) {
            throw new NotFoundException(`Eintrag mit ID ${id} nicht gefunden`);
        }
        return entry;
    }


    // Einen Eintrag löschen
    async deleteEntry(id: number): Promise<void> {
        const result = await this.entriesRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Eintrag mit ID ${id} nicht gefunden`);
        }
    }
}
