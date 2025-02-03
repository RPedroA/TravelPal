import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface User {
  name: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    TranslateModule
  ],
})
export class LoginPage implements OnInit {
  isLogin = true;
  showPassword = false;
  name: string = '';
  email: string = '';
  password: string = '';
  currentLanguage: string = 'en';
  showLanguageMenu = false;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.translate.setDefaultLang('en');
    this.currentLanguage = this.translate.currentLang;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.isLogin = params['mode'] !== 'signup';
    });

    this.translate.onLangChange.subscribe(event => {
      this.currentLanguage = event.lang;
    });
  }

  toggleLanguageMenu() {
    this.showLanguageMenu = !this.showLanguageMenu;
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async showToast(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'top',
    });
    await toast.present();
  }

  changeLanguage(lang: string) {
    this.translate.use(lang).subscribe({
      next: () => {
        this.showLanguageMenu = false;
        this.showToast(`Language changed to ${lang.toUpperCase()}`);
      },
      error: () => {
        this.showAlert('Error', 'Failed to change language.');
      }
    });
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async submit() {
    let users: User[] = JSON.parse(localStorage.getItem('users') || '[]'); 

    if (this.isLogin) {
      const user = users.find((u: User) => u.email === this.email && u.password === this.password);
      
      if (user) {
        localStorage.setItem('loggedIn', 'true'); 
        localStorage.setItem('userData', JSON.stringify(user)); 
        await this.showToast('Login successful!');
        this.router.navigate(['/tabs/viagens']);

      } else {
        await this.showAlert('Error', 'Incorrect email or password.');
      }
      
    } else {
      if (this.name.trim() && this.email.trim() && this.password.trim()) {
        const userExists = users.some((u: User) => u.email === this.email);

        if (userExists) {
          await this.showAlert('Error', 'This email is already registered.');
        } else {
          const newUser: User = { name: this.name, email: this.email, password: this.password };
          users.push(newUser);
          localStorage.setItem('users', JSON.stringify(users)); 
          localStorage.setItem('loggedIn', 'true'); 
          localStorage.setItem('userData', JSON.stringify(newUser));
          
          await this.showToast('Account created successfully!');
          this.router.navigate(['/tabs/viagens']);

        }
      } else {
        await this.showAlert('Error', 'Please fill in all fields to create an account.');
      }
    }
  }

  logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
