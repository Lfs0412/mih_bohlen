import { Component } from '@angular/core';
import { Entry } from "./Entry";
import { EntriesService } from "./entries.service";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { EntryEventsService } from "../shared/entryEvent.service";
import { DatePipe } from "@angular/common";
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger, animateChild
} from '@angular/animations';

@Component({
  selector: 'app-entries',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe
  ],
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css'],  // Fixed 'styleUrl' -> 'styleUrls'
  animations: [
    // Neuer Trigger auf Komponentenebene
    trigger('componentAnimation', [
      transition(':enter', [
        // Warten auf die Ausführung von listStagger
        query('@listStagger', animateChild(), { optional: true })
      ])
    ]),
    // Ihre bestehende listStagger-Animation
    trigger('listStagger', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(-15px)' }),
            stagger('50ms', [
              animate(
                '550ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              )
            ])
          ],
          { optional: true }
        ),
        query(
          ':leave',
          [
            stagger('50ms', [
              animate(
                '550ms',
                style({ opacity: 0, transform: 'translateY(-15px)' })
              )
            ])
          ],
          { optional: true }
        )
      ])
    ])
  ]
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
