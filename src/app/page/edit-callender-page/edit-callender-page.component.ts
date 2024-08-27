import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CallenderComponent } from '../../ui/callender/callender.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { UserTableComponent } from "../../ui/user-table/user-table.component";
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-edit-callender-page',
  standalone: true,
  imports: [CommonModule, CallenderComponent, ButtonModule, CardModule, UserTableComponent, TabMenuModule, RippleModule, NgxSpinnerComponent],
  templateUrl: './edit-callender-page.component.html',
  styleUrl: './edit-callender-page.component.css'
})
export class EditCallenderPageComponent implements OnInit {
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
  showDiv1 = true;
  showDiv2 = false;

  ngOnInit() {
      this.items = [
          { label: 'Calendar', icon: 'pi pi-calendar', command: () => this.onCalendarClick() },
          { label: 'Trainee Status', icon: 'pi pi-table', command: () => this.onTransactionsClick() }
      ];
      this.activeItem = this.items[0];
  }

  onCalendarClick() {
    console.log('Calendar tab clicked');
    this.showDiv1 = true;
    this.showDiv2 = false;
  }

  onTransactionsClick() {
    console.log('Transactions tab clicked');
    this.showDiv1 = false;
    this.showDiv2 = true;
  }

  
  
}