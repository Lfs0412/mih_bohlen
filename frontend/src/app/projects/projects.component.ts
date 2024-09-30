import { Component, OnInit } from '@angular/core';
import { Project } from "./Project";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ProjectInformationService } from "./project-information.service";
import {FormsModule} from "@angular/forms";
import {BreadcrumbService} from "../shared/breadcrumb.service";
import {ProjectEventsService} from "../shared/projectEvent.service";

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
    private breadcrumbService: BreadcrumbService,
    private projectEventsService: ProjectEventsService  // Inject the service

  ) {}

  ngOnInit() {
    this.fetchProjects();
    this.projectEventsService.projectCreated$.subscribe(() => {
      this.fetchProjects();  // Refresh project list when a project is created
    });
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
