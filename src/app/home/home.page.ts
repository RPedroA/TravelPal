import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule],
})
export class HomePage {
  currentLanguage = 'en';
  showLanguageMenu = false;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.translate.setDefaultLang('pt');
    this.translate.use('pt');
    
    this.translate.onLangChange.subscribe((event) => {
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
      error: (err) => {
        this.showAlert('Error', 'Failed to change language.');
      }
    });
  }

  goToLogin(mode: 'login' | 'signup') {
    this.router.navigate(['/login'], {
      queryParams: { mode: mode },
      queryParamsHandling: 'merge'
    });

    if (mode === 'login') {
      this.showToast('Navigating to login screen...');
    } else {
      this.showToast('Navigating to sign-up screen...');
    }
  }
}
