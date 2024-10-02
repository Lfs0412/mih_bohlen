import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  apiUrl = "http://localhost:3000/api/job";

  constructor(private http: HttpClient) {  }

  // Function to get the thread context (messages) based on entryId
  getThreadContext(entryId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/messages/${entryId}`);
  }
  sendMessage(message:string, entryId:number){
    return this.http.post<any>(`${this.apiUrl}/requestJob`, {message, entryId}, {withCredentials: true});
  }
}
