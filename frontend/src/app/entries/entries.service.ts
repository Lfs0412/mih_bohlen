import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Entry} from "./Entry";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EntriesService {

  private apiUrl = 'http://localhost:3000/api/entries';

  constructor(private http: HttpClient) { }

  getEntriesByProjectId(projectId: number): Observable<Entry[]> {
    return this.http.get<Entry[]>(`${this.apiUrl}/entries/${projectId}`);
  }

  createEntry(projectId: number, index: string, entryName: string, entryInstructions: string, description:string): Observable<Entry> {
    const messages:string = entryInstructions + " User Instructions:  " + description;
    console.log('messages: ', messages);
    return this.http.post<Entry>(`${this.apiUrl}/create`, {projectId, index, entryName, messages}, {withCredentials: true});
  }

  deleteEntry(entryId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${entryId}`);
  }
}
