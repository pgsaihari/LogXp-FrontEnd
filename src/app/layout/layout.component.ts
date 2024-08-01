import { Component, Renderer2, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { NgStyle } from '@angular/common';
import { NavbarComponent } from '../ui/navbar/navbar.component';
import { TopHeaderComponent } from "../ui/top-header/top-header.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, TopHeaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
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
