import { Component, OnInit } from '@angular/core';
import {Router, NavigationEnd, ActivatedRouteSnapshot, RouterLink} from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgIf } from '@angular/common';
import { BreadcrumbService } from '../shared/breadcrumb.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectModalComponent } from '../project-modal/project-modal.component';
import { EntryModalComponent } from '../entry-modal/entry-modal.component';
import { ProjectInformationService } from '../projects/project-information.service';
import { EntriesService } from '../entries/entries.service';
import { Project } from '../projects/Project';
import { Entry } from '../entries/Entry';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [NgIf, RouterLink],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  projectId: number | null = null;
  entryId: number | null = null;
  projectName: string = '';
  entryName: string = '';
  isProjectsRoute = true;
  isEntriesRoute = false;
  isChatRoute = false;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private projectInformationService: ProjectInformationService,
    private entryService: EntriesService
  ) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      const currentRoute = this.router.routerState.root.snapshot;
      this.projectId = this.getRouteParameter(currentRoute, 'id') ? Number(this.getRouteParameter(currentRoute, 'id')) : null;
      this.entryId = this.getRouteParameter(currentRoute, 'entryId') ? Number(this.getRouteParameter(currentRoute, 'entryId')) : null;

      if (this.projectId) this.fetchProjectName(this.projectId);
      if (this.entryId) this.fetchEntryName(this.entryId);
    });
  }

  ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      this.setRouteFlags((event as NavigationEnd).url);
    });

    this.breadcrumbService.currentProjectName.subscribe(name => {
      this.projectName = name;
    });
  }

  getRouteParameter(routeSnapshot: ActivatedRouteSnapshot, param: string): string | null {
    while (routeSnapshot.firstChild) {
      routeSnapshot = routeSnapshot.firstChild;
    }
    return routeSnapshot.paramMap.get(param);
  }

  openCreateProjectModal(): void {
    this.modalService.open(ProjectModalComponent);
  }

  openCreateEntryModal(): void {
    if (this.projectId) {
      const modalRef = this.modalService.open(EntryModalComponent);
      modalRef.componentInstance.projectId = this.projectId;
    } else {
      console.error('Project ID not found');
    }
  }

  setRouteFlags(url: string): void {
    if (url === '/projects') {
      this.breadcrumbService.setProjectName('');
      this.entryName = '';
    }

    if (!url.startsWith('/entries:id')) {
      this.entryName = '';
    }

    this.isProjectsRoute = url === '/projects';
    this.isEntriesRoute = url.startsWith('/entries');
    this.isChatRoute = url.startsWith('/chat');
  }

  fetchProjectName(projectId: number): void {
    this.projectInformationService.getProject(projectId).subscribe({
      next: (fetchedProject: Project) => {
        this.breadcrumbService.setProjectName(fetchedProject.projectName);
      },
      error: error => console.error('Failed to fetch project name:', error)
    });
  }

  fetchEntryName(entryId: number): void {
    this.entryService.getEntry(entryId).subscribe({
      next: (fetchedEntry: Entry) => {
        this.entryName = fetchedEntry.entryName;
        this.projectId = fetchedEntry.project.id;
        this.projectName = fetchedEntry.project.projectName;
      },
      error: error => console.error('Failed to fetch entry:', error)
    });
  }

  createExcel(): void {
    console.log('Creating an Excel sheet');
  }
}
