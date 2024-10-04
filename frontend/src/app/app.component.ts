import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {provideToastr, ToastrModule} from "ngx-toastr";
import {OnInit} from "@angular/core";
import {AuthService} from "./auth/auth.service";
import {User} from "./auth/user.interface";
import {NavbarComponent} from "./navbar/navbar.component";
import {HeaderComponent} from "./header/header.component";
import {NgIf} from "@angular/common";
import {
  trigger,
  transition,
  style,
  query,
  group,
  animate,
  animateChild,
} from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastrModule, NavbarComponent, HeaderComponent, NgIf,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(
          ':enter, :leave',
          [
            style({
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
            }),
          ],
          { optional: true }
        ),
        query(':leave', animateChild(), { optional: true }),
        query(
          ':leave',
          [
            animate(
              '300ms ease-out',
              style({ opacity: 0, transform: 'translateY(-20px)' })
            ),
          ],
          { optional: true }
        ),
        query(':enter', animateChild(), { optional: true }),
      ]),
    ]),
  ],


})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {
  }
  title = 'frontend';
  isLoggedIn = false;

  ngOnInit() {
    // Subscribe to the user state and update isLoggedIn accordingly
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;  // Set isLoggedIn to true if a user exists
    });

    // Optionally, you can also call getUserProfile to ensure the user state is up-to-date when the component initializes
    this.authService.getUserProfile().subscribe({
      error: (err) => {
        if (err.status === 401) {
          this.isLoggedIn = false;  // Handle 401 Unauthorized error
        }
      }
    });
  }

  getAnimationData(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }

}
