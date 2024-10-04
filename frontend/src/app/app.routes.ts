import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { AuthGuard } from "./auth/auth.guard";
import { ProjectsComponent } from "./projects/projects.component";
import { EntriesComponent } from "./entries/entries.component";
import { ChatComponent } from "./chat/chat.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'projects',
    component: ProjectsComponent,
    data: { animation: 'ProjectsPage' },
    canActivate: [AuthGuard],
  },
  {
    path: 'entries/:id',
    component: EntriesComponent,
    data: { animation: 'EntriesPage' },
    canActivate: [AuthGuard],
  },
  {
    path: 'chat/:entryId',
    component: ChatComponent,
    data: { animation: 'ChatPage' },
    canActivate: [AuthGuard],
  },
  { path: 'home', component: HomeComponent, data: { animation: 'HomePage' }, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
