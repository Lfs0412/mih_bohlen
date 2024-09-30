import { Component } from '@angular/core';
import {Entry} from "./Entry";
import {EntriesService} from "./entries.service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-entries',
  standalone: true,
  imports: [
    FormsModule
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
    private route: ActivatedRoute
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
  }

  // Einträge abrufen
  fetchEntries() {
    this.entriesService.getEntriesByProjectId(Number(this.projectId)).subscribe(
      (data: Entry[]) => {
        this.entries = data;
        this.toastr.success('Einträge erfolgreich geladen');
      },
      error => {
        this.toastr.error('Fehler beim Abrufen der Einträge');
        console.error('Fehler beim Abrufen der Einträge:', error);
      }
    );
  }

  // Neuen Eintrag erstellen
  submitCreateEntry() {
    console.log(this.newEntryIndex, this.newEntryInstruction, this.newEntryName, 'Werte sind gesetzt');
    if (this.newEntryInstruction && this.newEntryName && this.newEntryDescription) {
      this.entriesService.createEntry(Number(this.projectId), this.newEntryIndex, this.newEntryName, this.newEntryInstruction,this.newEntryDescription).subscribe(
        (newEntry: Entry) => {
          this.entries.push(newEntry);
          this.toastr.success('Eintrag erfolgreich erstellt');
          this.resetForm();
          this.closeModal();
        },
        error => {
          this.toastr.error('Fehler beim Erstellen des Eintrags');
          console.error('Fehler beim Erstellen des Eintrags:', error);
        }
      );
    } else {
      this.toastr.warning('Bitte füllen Sie alle Felder aus.');
    }
  }

  // Formular zurücksetzen
  resetForm() {
    this.newEntryIndex = '';
    this.newEntryName = '';
    this.newEntryDescription = '';
    this.newEntryInstruction = '';
  }

  // Modal schließen
  closeModal() {
    const modal = document.getElementById('createEntryModal');
    if (modal) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.hide();
    }
  }

  // Eintrag löschen
  deleteEntry(entryId: number) {
    this.entriesService.deleteEntry(entryId).subscribe(
      () => {
        this.entries = this.entries.filter(entry => entry.entryID !== entryId);
        this.toastr.success('Eintrag erfolgreich gelöscht');
      },
      error => {
        this.toastr.error('Fehler beim Löschen des Eintrags');
        console.error('Fehler beim Löschen des Eintrags:', error);
      }
    );
  }
}
