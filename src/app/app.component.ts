import { Component, Renderer2, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { NavbarComponent } from './ui/navbar/navbar.component';
import { TestPageComponent } from "./page/test-page/test-page.component";

import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, NavbarComponent, NgStyle,TestPageComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'FrontEnd';
  role: string = 'trainee';

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.setBodyBackgroundColor();
  }

  getBackgroundColor(): string {
    switch (this.role) {
      case 'admin':
        return '#F1F2F6';
      case 'trainer':
        return '#EFE6EB'
      case 'trainee':
        return '#FCF6F5';
      default:
        return 'white';
    }
  }

  setBodyBackgroundColor(): void {
    this.renderer.setStyle(document.body, 'background-color', this.getBackgroundColor());
  }
}
