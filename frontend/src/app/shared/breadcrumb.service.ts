import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private projectNameSource = new BehaviorSubject<string>('');
  currentProjectName = this.projectNameSource.asObservable();

  setProjectName(name: string): void {
    this.projectNameSource.next(name);
  }
}
