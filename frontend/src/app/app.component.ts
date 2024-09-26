import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {provideToastr, ToastrModule} from "ngx-toastr";
import {OnInit} from "@angular/core";
import {AuthService} from "./auth/auth.service";
import {User} from "./auth/user.interface";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastrModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
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

}
