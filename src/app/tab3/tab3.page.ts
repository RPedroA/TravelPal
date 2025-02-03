import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  user = {
    name: '',
    email: '',
  };
  editedName = '';
  password = '';
  confirmPassword = '';

  constructor(private alertController: AlertController, private router: Router) {
    this.loadUserData();
  }

  loadUserData() {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      this.editedName = this.user.name; 
    }
  }

  async saveChanges() {
    if (!this.editedName.trim()) { 
      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'Por favor, preencha todos os campos.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
    if (!this.password || !this.confirmPassword) {
      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'Insira uma palavra-passe.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    if (this.password !== this.confirmPassword) {
      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'As palavras-passe não coincidem.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    this.user.name = this.editedName;

    localStorage.setItem('userData', JSON.stringify(this.user));

    console.log('Alterações salvas:', this.user, this.password);
    const alert = await this.alertController.create({
      header: 'Sucesso',
      message: 'As alterações foram salvas com sucesso!',
      buttons: ['OK'],
    });
    await alert.present();
  }

 async deleteAccount() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: 'Tem a certeza de que deseja apagar a conta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Apagar',
          role: 'destructive',
          handler: () => {
            console.log('Conta apagada.');

            localStorage.removeItem('userData');

            this.router.navigate(['/tab1']);
          },
        },
      ],
    });
    await alert.present();
  }
}