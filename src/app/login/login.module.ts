import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginPage {
  showPassword: boolean = false;

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/home']); 
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; 
  }

  login() {
    console.log('Login button clicked'); 
    this.router.navigate(['/dashboard']); 
  }
}
