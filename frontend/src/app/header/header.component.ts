import { Component, OnInit } from '@angular/core';
import {Router, NavigationEnd, RouterLink, ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import { filter } from 'rxjs/operators';
import {NgIf} from "@angular/common";
import {BreadcrumbService} from "../shared/breadcrumb.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProjectModalComponent} from "../project-modal/project-modal.component";
import {EntryModalComponent} from "../entry-modal/entry-modal.component";
import {ProjectEventsService} from "../shared/projectEvent.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
  ],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  projectId: number | null = null;
  isProjectsRoute: boolean = true;
  isEntriesRoute: boolean = false;
  isChatRoute: boolean = false;
  isHomeRoute: boolean = false;
  projectName: string = ''; // Default breadcrumb name;


  constructor(private modalService: NgbModal, private router: Router, private breadcrumbService: BreadcrumbService, private projectEventsService: ProjectEventsService) {
    // Listen to router events to get the current route snapshot
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)  // Only consider NavigationEnd events
    ).subscribe(() => {
      const currentRoute = this.router.routerState.root.snapshot;
      const projectId = this.getRouteParameter(currentRoute, 'id');  // Retrieve the 'id' parameter
      this.projectId = projectId ? Number(projectId) : null;
    });
  }

  // Helper function to recursively traverse activated routes and find the 'id' parameter
  private getRouteParameter(routeSnapshot: ActivatedRouteSnapshot, param: string): string | null {
    while (routeSnapshot.firstChild) {
      routeSnapshot = routeSnapshot.firstChild;
    }
    return routeSnapshot.paramMap.get(param);
  }

  openCreateProjectModal() {
    this.modalService.open(ProjectModalComponent);
  }

  openCreateEntryModal() {
    if (this.projectId) {
      const modalRef = this.modalService.open(EntryModalComponent);
      modalRef.componentInstance.projectId = this.projectId;  // Pass the projectId to the modal
    } else {
      console.error('Projekt-ID nicht gefunden');
    }
  }

  ngOnInit(): void {
    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.setRouteFlags(event.url); // Update the route flags and reset breadcrumb if necessary
      });

    // Subscribe to the breadcrumb project name updates
    this.breadcrumbService.currentProjectName.subscribe(name => {
      this.projectName = name; // Update project name for the breadcrumb
    });
  }




  // Set the flags based on the current route
  setRouteFlags(url: string): void {
    // Reset the breadcrumb when navigating back to the "projects" route
    if (url === '/projects') {
      this.breadcrumbService.setProjectName(''); // Reset project name when back in the projects view
    }
    this.isProjectsRoute = url === '/projects';
    this.isEntriesRoute = url.startsWith('/entries');
    this.isChatRoute = url.startsWith('/chat');
  }


  // Functions to call based on the current route
  createProject() {
    console.log('Creating a new project');
  }


  createExcel() {
    console.log('Creating an Excel sheet');
  }
}
