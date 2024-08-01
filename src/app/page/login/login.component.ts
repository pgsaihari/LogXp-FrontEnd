import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 
  constructor(private router:Router){

  }

trainerLogin() {
  alert("trainer logged in")
  
  localStorage.setItem("logintoken","trainer")
  this.router.navigate(['/home'])

}
adminLogin() {
  alert("admin logged in")
  localStorage.setItem("logintoken","admin")
  this.router.navigate(['/home'])
}
trainee() { 
  alert("trainee logged in")
  localStorage.setItem("logintoken","user")
  this.router.navigate(['/home'])
}

}
