import { Component, OnInit } from '@angular/core';
import { Project } from "./Project";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ProjectInformationService } from "./project-information.service";
import {FormsModule} from "@angular/forms";

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
    private projectInformationService: ProjectInformationService
  ) {}

  ngOnInit() {
    this.fetchProjects();
  }

  // Projekte abrufen
  fetchProjects() {
    this.projectInformationService.getProjects().subscribe(
      (data: Project[]) => {
        this.projects = data;
        this.toastr.success('Projekte erfolgreich geladen');
      },
      error => {
        this.toastr.error('Fehler beim Abrufen der Projekte');
        console.error('Fehler beim Abrufen der Projekte:', error);
      }
    );
  }

  // Projekt erstellen
  submitCreateProject() {
    if (this.newProjectName && this.newProjectDescription) {
      this.projectInformationService.createProject(this.newProjectName, this.newProjectDescription).subscribe(
        () => {
          this.toastr.success('Projekt erfolgreich erstellt');
          this.newProjectName = '';
          this.newProjectDescription = '';
          this.fetchProjects(); // Aktualisiere die Liste der Projekte

          // Modal schließen (Bootstrap spezifisch)
          this.closeModal();
        },
        (error) => {
          this.toastr.error('Fehler beim Erstellen des Projekts');
        }
      );
    }
  }

  // Modal schließen
  closeModal() {
    // Verwende jQuery oder native JS, um das Modal zu schließen
    const modal = document.getElementById('createProjectModal');
    if (modal) {
      // Mit Bootstrap's jQuery spezifischer Funktion
      (window as any).$(`#createProjectModal`).modal('hide');
    }
  }

  // Projekt löschen
  deleteProject(projectID: number) {
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
}
