import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isProjectsRoute: boolean = false;
  isEntriesRoute: boolean = false;
  isChatRoute: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.setRouteFlags(event.url);
      });
  }

  // Set the flags based on the current route
  setRouteFlags(url: string) {
    this.isProjectsRoute = url.includes('/projects');
    this.isEntriesRoute = url.includes('/entries');
    this.isChatRoute = url.includes('/chat');
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
