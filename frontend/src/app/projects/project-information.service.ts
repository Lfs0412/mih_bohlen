import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { Observable } from 'rxjs';
import { Project } from './Project'; // Stelle sicher, dass das Model existiert

@Injectable({
  providedIn: 'root'
})
export class ProjectInformationService {

  private apiUrl = 'http://localhost:3000/api/projects';

  constructor(private http: HttpClient) { }

  // Projekte abrufen
  getProjects(page: number = 1, limit: number = 10): Observable<Project[]> {
    console.log('Fetching project information');

    // Construct the URL with query parameters for pagination
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<Project[]>(this.apiUrl, { params });
  }

  createProject(projectName: string, projectDescription: string): Observable<Project> {
    const payload = { projectName, projectDescription };
    return this.http.post<Project>(`${this.apiUrl}/create`, payload, { withCredentials: true });
  }

  // Projekt löschen
  deleteProject(projectID: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectID}`);
  }

  // Projekt aktualisieren
  updateProject(projectID: number, projectDescription: string): Observable<void> {
    const payload = { projectID, projectDescription };
    return this.http.put<void>(`${this.apiUrl}/${projectID}`, payload);
  }
}
