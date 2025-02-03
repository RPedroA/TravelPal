import { Component, Input } from '@angular/core';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-comentarios-localizacoes',
  templateUrl: './comentarios-localizacoes.component.html',
  styleUrls: ['./comentarios-localizacoes.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ComentariosLocalizacoesComponent {
  @Input() comments!: any[];
  @Input() locationDescription!: string;

  constructor(
    private modalController: ModalController,
    private locationService: LocationService,
    private alertController: AlertController
  ) {}

  closeModal() {
    this.modalController.dismiss();
  }

  async confirmDeleteComment(commentId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: 'Tem certeza de que deseja excluir este comentário?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Remover',
          handler: () => {
            this.deleteComment(commentId);
          },
        },
      ],
    });

    await alert.present();
  }

  deleteComment(commentId: string) {
    this.locationService.deleteComment(commentId).subscribe(
      () => {
        this.comments = this.comments.filter(comment => comment.id !== commentId);
      },
      (error) => {
        console.error('Erro ao remover comentário:', error);
      }
    );
  }
}
