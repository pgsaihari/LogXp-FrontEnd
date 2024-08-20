import { Component } from '@angular/core';
import { TableComponent } from "../../ui/table/table.component";
import { UserInfoComponent } from "../../ui/user-info/user-info.component";
import { SingleUserTableComponent } from "../../ui/single-user-table/single-user-table.component";
import { SideUserProfileComponent } from '../../Features/side-user-profile/side-user-profile.component';


@Component({
  selector: 'app-search-trainee-page',
  standalone: true,
  imports: [TableComponent, UserInfoComponent, SingleUserTableComponent,SideUserProfileComponent],
  templateUrl: './search-trainee-page.component.html',
  styleUrl: './search-trainee-page.component.css'
})
export class SearchTraineePageComponent {
 
}
