import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {User} from "../auth/user.interface";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [
    NgIf,
    AsyncPipe
  ],
  standalone: true
})
export class DashboardComponent implements OnInit {

  user$: Observable<User | null> | undefined;

  constructor(private authService: AuthService, private router: Router) {
  }

  // Fetch user profile on component initialization
  ngOnInit() {
    this.user$ = this.authService.user$;
    this.authService.getUserProfile().subscribe();
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
