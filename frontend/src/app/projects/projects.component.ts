import { Component, OnInit } from '@angular/core';
import { Project } from "./Project";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ProjectInformationService } from "./project-information.service";
import {FormsModule} from "@angular/forms";
import {BreadcrumbService} from "../shared/breadcrumb.service";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'] // fix: 'styleUrl' -> 'styleUrls'
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  newProjectName:string = '';
  newProjectDescription:string = '';


  constructor(
    private router: Router,
    private toastr: ToastrService,
    private projectInformationService: ProjectInformationService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit() {
    this.fetchProjects();
  }

  // Projekte abrufen
  fetchProjects() {
    this.projectInformationService.getProjects().subscribe(
      (data: any) => {
        console.log(data.projects.projects)
        this.projects = data.projects.projects
        this.toastr.success('Projekte erfolgreich geladen');
      },
      error => {
        this.toastr.error('Fehler beim Abrufen der Projekte');
        console.error('Fehler beim Abrufen der Projekte:', error);
      }
    );
  }

  // Neues Projekt erstellen
  submitCreateProject() {
    if (this.newProjectName && this.newProjectDescription) {
      this.projectInformationService.createProject(this.newProjectName, this.newProjectDescription).subscribe(
        () => {
          this.toastr.success('Projekt erfolgreich erstellt');
          this.newProjectName = '';
          this.newProjectDescription = '';
          this.fetchProjects(); // Projekte neu laden

          // Modal schließen
          const modal = document.getElementById('createProjectModal');
          if (modal) {
            const bootstrapModal = new (window as any).bootstrap.Modal(modal);
            bootstrapModal.hide();
          }
        },
        (error) => {
          this.toastr.error('Fehler beim Erstellen des Projekts');
        }
      );
    }
  }

  // Projekt löschen
  deleteProject(projectID: number) {
    // Verhindert, dass das List-Item-Klickereignis ausgeführt wird
    //event.stopPropagation();

    this.projectInformationService.deleteProject(projectID).subscribe(
      () => {
        this.toastr.success('Projekt erfolgreich gelöscht');
        this.fetchProjects(); // Aktualisiere die Liste nach dem Löschen
      },
      error => {
        this.toastr.error('Fehler beim Löschen des Projekts');
        console.error('Fehler beim Löschen des Projekts:', error);
      }
    );
  }

  // Projekt aktualisieren
  updateProject(projectID: number, projectDescription: string) {
    this.projectInformationService.updateProject(projectID, projectDescription).subscribe(
      () => {
        this.toastr.success('Projekt erfolgreich aktualisiert');
        this.fetchProjects(); // Aktualisiere die Liste nach der Aktualisierung
      },
      error => {
        this.toastr.error('Fehler beim Aktualisieren des Projekts');
        console.error('Fehler beim Aktualisieren des Projekts:', error);
      }
    );
  }
  goToProjectEntries(projectId: number): void {
    const selectedProject = this.projects.find(project => project.id === projectId);

    if (selectedProject) {
      // Set the project name in the breadcrumb service
      this.breadcrumbService.setProjectName(selectedProject.projectName);
    }

    // Navigate to the entries page for this project
    this.router.navigate(['/entries', projectId]);
  }
}
