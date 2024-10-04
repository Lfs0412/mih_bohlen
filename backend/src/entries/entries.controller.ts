import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {EntriesService} from "./entries.service";
import {Entry} from "../entities/entry.entity";
import {CreateEntryDTO} from "./DTOs/CreateEntryDTO";
import {CurrentUser} from "../auth/current-user.decorator";
import {TokenPayload} from "../auth/token-payload.interface";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {User} from "../entities/user.entity";

@Controller('entries')
@UseGuards(JwtAuthGuard)
export class EntriesController {
    constructor(private readonly entriesService: EntriesService) {}

    @Post('create')
    // POST: /entries/create - Einen neuen Eintrag erstellen
    async createEntry(
        @CurrentUser() user: User,
        @Body() createEntryDto: CreateEntryDTO): Promise<Entry> {
        return this.entriesService.createEntry(user.id, createEntryDto);
    }

    @Get('getByProject/:id')
    async getEntriesByProjectId(@Param('id') projectId: number, @CurrentUser() user: User): Promise<Entry[]> {
        return this.entriesService.getEntriesByProjectId(projectId, user.id);
    }

    // GET: /entries/:id - Einen einzelnen Eintrag abrufen
    @Get('getByEntry/:id')
    async getEntryById(@Param('id') id: number, @CurrentUser() user: User): Promise<Entry> {
      return await this.entriesService.getEntryById(id, user.id);
    }
}
