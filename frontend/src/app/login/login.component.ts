import { Component } from '@angular/core';
import { AuthService} from "../auth/auth.service";
import { Router } from '@angular/router';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    FormsModule,
    NgIf
  ],
  standalone: true
})
export class LoginComponent {
  username = '';
  password = '';
  loginError: string | null = null;

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

  login() {
    this.authService.login(this.username, this.password).subscribe(
      () => {
        this.router.navigate(['/home']); // Redirect to dashboard on successful login
        this.toastr.success('Login Sucessful', 'Success')
      },
      (err) => {
        if (err.status === 401) {
          this.toastr.error('Credentials are not valid. Please try again.', 'Login Failed');
          }
      }
    );
  }
}
