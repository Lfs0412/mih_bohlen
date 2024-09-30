import {Component, Input} from '@angular/core';
import {Entry} from "../entries/Entry";
import {EntriesService} from "../entries/entries.service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {EntryEventsService} from "../shared/entryEvent.service";

@Component({
  selector: 'app-entry-modal',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './entry-modal.component.html',
  styleUrl: './entry-modal.component.css'
})
export class EntryModalComponent {
  constructor(private entriesService: EntriesService,
              private toastr: ToastrService,
              public activeModal: NgbActiveModal,
              private entryEventsService: EntryEventsService

  ) {
  }
  @Input() projectId: number | null = null;
  newEntryName: string = '';
  newEntryIndex: string = '';
  newEntryInstruction: string = '';
  newEntryDescription:string = '';

  submitCreateEntry() {
    // Check if the fields are filled
    if (this.newEntryInstruction && this.newEntryName && this.newEntryDescription && this.newEntryIndex) {
      // Check if the projectId was passed successfully
      if (this.projectId) {
        this.entriesService.createEntry(
          this.projectId,
          this.newEntryIndex,
          this.newEntryName,
          this.newEntryInstruction,
          this.newEntryDescription
        ).subscribe(
          (newEntry: Entry) => {
            this.activeModal.close();
            this.toastr.success('Eintrag erfolgreich erstellt');
            this.entryEventsService.notifyEntryCreated();
            this.resetForm();
          },
          error => {
            this.toastr.error('Fehler beim Erstellen des Eintrags');
            console.error('Fehler beim Erstellen des Eintrags:', error);
          }
        );
      } else {
        this.toastr.error('Projekt-ID nicht gefunden');
      }
    } else {
      // Warn user if not all fields are filled
      this.toastr.warning('Bitte füllen Sie alle Felder aus.');
    }
  }



  resetForm() {
    this.newEntryIndex = '';
    this.newEntryName = '';
    this.newEntryDescription = '';
    this.newEntryInstruction = '';
  }

}
