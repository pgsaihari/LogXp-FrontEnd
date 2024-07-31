import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [CardModule, ButtonModule],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.css'
})
export class TestPageComponent {
  employee_count: Number = 456;
  header_icon: string = 'fa-solid fa-users employee-icon';
  card_header: string = 'Total Employees';
  footer_icon: string = 'fa-solid fa-circle-plus'
  card_footer: string = '2 new employees added!'
}
