import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {EntriesService} from "./entries.service";
import {Entry} from "../entities/entry.entity";
import {CreateEntryDTO} from "./DTOs/CreateEntryDTO";
import {CurrentUser} from "../auth/current-user.decorator";
import {TokenPayload} from "../auth/token-payload.interface";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";

@Controller('entries')
@UseGuards(JwtAuthGuard)
export class EntriesController {
    constructor(private readonly entriesService: EntriesService) {}

    @Post('create')
    // POST: /entries/create - Einen neuen Eintrag erstellen
    async createEntry(
        @CurrentUser() user: TokenPayload,
        @Body() createEntryDto: CreateEntryDTO): Promise<Entry> {
        console.log(user.userId);
        return this.entriesService.createEntry(user.userId, createEntryDto);
    }

    // GET: /entries/project/:projectId - Alle Einträge für ein bestimmtes Projekt abrufen
    @Get('entries/:projectId')
    async getEntriesByProjectId(@Param('projectId') projectId: number): Promise<Entry[]> {
        return this.entriesService.getEntriesByProjectId(projectId);
    }

    // GET: /entries/:id - Einen einzelnen Eintrag abrufen
    @Get(':id')
    async getEntryById(@Param('id') id: number): Promise<Entry> {
         const entry = await this.entriesService.getEntryById(id);
         console.log(entry)
        return entry
    }
}
