import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "../auth/auth.service";
import {ToastrService} from "ngx-toastr";
import {ProjectInformationService} from "../projects/project-information.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ProjectEventsService} from "../shared/projectEvent.service";

@Component({
  selector: 'app-project-modal',
  standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.css'
})
export class ProjectModalComponent {
  constructor(
    private toastr: ToastrService,
    private projectService: ProjectInformationService,
    public activeModal: NgbActiveModal,
    private projectEventsService: ProjectEventsService  // Inject the service
  ) {
  }
  newProjectName:string = '';
  newProjectDescription:string = '';

  submitCreateProject() {
    if (this.newProjectName && this.newProjectDescription) {
      this.projectService.createProject(this.newProjectName, this.newProjectDescription).subscribe(
        () => {
          this.toastr.success('Projekt erfolgreich erstellt');
          this.projectEventsService.notifyProjectCreated();
          this.newProjectName = '';
          this.newProjectDescription = '';
          this.activeModal.close({ name: this.newProjectName, description: this.newProjectDescription });

        },
        (error) => {
          this.toastr.error('Fehler beim Erstellen des Projekts');
        }
      );
    }
  }

}
