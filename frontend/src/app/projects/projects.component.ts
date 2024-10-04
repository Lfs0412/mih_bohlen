import { Component, OnInit } from '@angular/core';
import { Project } from './Project';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProjectInformationService } from './project-information.service';
import { FormsModule } from '@angular/forms';
import { BreadcrumbService } from '../shared/breadcrumb.service';
import { ProjectEventsService } from '../shared/projectEvent.service';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger, animateChild,
} from '@angular/animations';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  animations: [
    trigger('componentAnimation', [
      transition(':enter, :leave', [
        // Warten auf die Ausführung von listStagger
        query('@listStagger', animateChild(), { optional: true })
      ])
    ]),
    trigger('listStagger', [
      transition(':enter', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(-15px)' }),
            stagger('50ms', [
              animate(
                '550ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
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
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],

})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  newProjectName: string = '';
  newProjectDescription: string = '';

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private projectInformationService: ProjectInformationService,
    private breadcrumbService: BreadcrumbService,
    private projectEventsService: ProjectEventsService
  ) {}

  ngOnInit() {
    this.fetchProjects();
    this.projectEventsService.projectCreated$.subscribe(() => {
      this.fetchProjects();
    });
  }

  fetchProjects() {
    this.projectInformationService.getProjects().subscribe(
      (data: any) => {
        console.log(data.projects.projects);
        this.projects = data.projects.projects;
      },
      (error) => {
        this.toastr.error('Fehler beim Abrufen der Projekte');
        console.error('Fehler beim Abrufen der Projekte:', error);
      }
    );
  }

  deleteProject(projectID: number) {
    this.projectInformationService.deleteProject(projectID).subscribe(
      () => {
        this.toastr.success('Projekt erfolgreich gelöscht');
        this.fetchProjects();
      },
      (error) => {
        this.toastr.error('Fehler beim Löschen des Projekts');
        console.error('Fehler beim Löschen des Projekts:', error);
      }
    );
  }

  updateProject(projectID: number, projectDescription: string) {
    this.projectInformationService
      .updateProject(projectID, projectDescription)
      .subscribe(
        () => {
          this.toastr.success('Projekt erfolgreich aktualisiert');
          this.fetchProjects();
        },
        (error) => {
          this.toastr.error('Fehler beim Aktualisieren des Projekts');
          console.error('Fehler beim Aktualisieren des Projekts:', error);
        }
      );
  }

  goToProjectEntries(projectId: number): void {
    const selectedProject = this.projects.find((project) => project.id === projectId);

    if (selectedProject) {
      this.breadcrumbService.setProjectName(selectedProject.projectName);
    }

    this.router.navigate(['/entries', projectId]);
  }
}
