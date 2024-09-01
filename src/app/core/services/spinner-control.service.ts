import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private isVisible = false;

  show(): void {
    this.isVisible = true;  // Set visibility to true
  }

  hide(): void {
    this.isVisible = false;  // Set visibility to false
  }

  isSpinnerVisible(): boolean {
    return this.isVisible;  // Return current spinner visibility
  }
}
