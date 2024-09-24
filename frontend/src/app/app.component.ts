import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {provideToastr, ToastrModule} from "ngx-toastr";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastrModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
