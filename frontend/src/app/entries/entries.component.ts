import { Component } from '@angular/core';
import {Entry} from "./Entry";
import {EntriesService} from "./entries.service";
import {ToastrService} from "ngx-toastr";
import {Router, ActivatedRoute} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {EntryEventsService} from "../shared/entryEvent.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-entries',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe
  ],
  templateUrl: './entries.component.html',
  styleUrl: './entries.component.css'
})
export class EntriesComponent {
  entries: Entry[] = [];
  newEntryName: string = '';
  newEntryIndex: string = '';
  newEntryInstruction: string = '';
  newEntryDescription:string = '';
  projectId: number | null = null; // Die Projekt-ID aus der URL

  constructor(
    private entriesService: EntriesService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private entryEventsService: EntryEventsService
  ) {}

  ngOnInit() {
    // Projekt-ID aus der URL abrufen
    this.route.paramMap.subscribe(params => {
      this.projectId = Number(params.get('id'));
      if (this.projectId) {
        this.fetchEntries();
      } else {
        this.toastr.error('Projekt-ID nicht gefunden');
      }
    });

    this.entryEventsService.entryCreated$.subscribe(() => {
      this.fetchEntries();  // Refresh entries when a new entry is created
    });
  }

  // Einträge abrufen
  fetchEntries() {
    this.entriesService.getEntriesByProjectId(Number(this.projectId)).subscribe(
      (data: Entry[]) => {
        this.entries = data;
      },
      error => {
        this.toastr.error('Fehler beim Abrufen der Einträge');
        console.error('Fehler beim Abrufen der Einträge:', error);
      }
    );
  }

  goToChat(entryId:number){
    this.router.navigate([`chat/${entryId}`], {})
  }


  // Eintrag löschen
  deleteEntry(entryId: number) {
    this.entriesService.deleteEntry(entryId).subscribe(
      () => {
        this.entries = this.entries.filter(entry => entry.id !== entryId);
        this.toastr.success('Eintrag erfolgreich gelöscht');
      },
      error => {
        this.toastr.error('Fehler beim Löschen des Eintrags');
        console.error('Fehler beim Löschen des Eintrags:', error);
      }
    );
  }
}
