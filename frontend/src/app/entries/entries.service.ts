import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EntriesService {

  private apiUrl = 'http://localhost:3000/api/entry';

  constructor(private http: HttpClient) { }

  createEntry(){}

  getEntries(){}

  deleteEntry(id: number){}

  updateEntry(id: number){}



}
