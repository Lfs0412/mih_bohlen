import { Component, OnInit } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {User} from "../auth/user.interface";
import {AuthService} from "../auth/auth.service";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [
    RouterLinkActive,
    NgClass,
    RouterLink
  ],
  standalone: true
})
export class NavbarComponent implements OnInit {
  user: User | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getUserProfile().subscribe({
      next: (data: User) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Error fetching user profile', err);
      }
    });
  }

  isProjectTabActive(): boolean {
    const currentUrl = this.router.url; // Get the current route URL
    return (
      currentUrl.startsWith('/projects') ||
      currentUrl.startsWith('/entries') ||
      currentUrl.startsWith('/chat')
    );
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Navigate to the login page after a successful logout
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // Handle the error if the logout request fails
        console.error('Logout failed', err);
      }
    });
  }

}
