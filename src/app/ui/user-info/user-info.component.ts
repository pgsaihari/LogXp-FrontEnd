import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CardModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent {
  name: String = 'Abdul';
  ilpBatch: String = 'Batch 4';
  imageUrl: any = 'https://static.remove.bg/sample-gallery/graphics/bird-thumbnail.jpg';
}
