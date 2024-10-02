import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'; // Import Router
import { EntriesService } from '../entries/entries.service';
import { Entry } from '../entries/Entry';
import { EntryEventsService} from "../shared/entryEvent.service";

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
  constructor(
    private entriesService: EntriesService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private entryEventsService: EntryEventsService,
    private router: Router // Inject Router
  ) {}

  @Input() projectId: number | null = null;
  newEntryName: string = '';
  newEntryIndex: string = '';
  newEntryInstruction: string = '';
  newEntryDescription: string = '';

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
            this.activeModal.close(); // Close the modal
            this.toastr.success('Eintrag erfolgreich erstellt');
            this.entryEventsService.notifyEntryCreated();
            this.resetForm();

            // Redirect to chat route with the newly created entry's ID
            this.router.navigate(['/chat', newEntry.id]);
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
    this.newEntryName = '';
    this.newEntryIndex = '';
    this.newEntryInstruction = '';
    this.newEntryDescription = '';
  }
}
