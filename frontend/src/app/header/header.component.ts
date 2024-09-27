import { Component, OnInit } from '@angular/core';
import {Router, NavigationEnd, RouterLink} from '@angular/router';
import { filter } from 'rxjs/operators';
import {NgIf} from "@angular/common";
import {BreadcrumbService} from "../shared/breadcrumb.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [
    NgIf,
    RouterLink
  ],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isProjectsRoute: boolean = true;
  isEntriesRoute: boolean = false;
  isChatRoute: boolean = false;
  isHomeRoute: boolean = false;
  projectName: string = ''; // Default breadcrumb name;


  constructor(private router: Router, private breadcrumbService: BreadcrumbService) {}

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

  createEntry() {
    console.log('Creating a new entry');
  }

  createExcel() {
    console.log('Creating an Excel sheet');
  }
}
