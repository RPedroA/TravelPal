import { Component, Input } from '@angular/core';
import { IonicModule, ModalController, AlertController } from '@ionic/angular'; 
import { CommonModule } from '@angular/common'; 
import { TravelService } from '../services/travel.service'; 

@Component({
  selector: 'app-comentarios-modal',
  templateUrl: './comentarios-modal.component.html',
  styleUrls: ['./comentarios-modal.component.scss'],
  standalone: true, 
  imports: [IonicModule, CommonModule], 
})
export class ComentariosModalComponent {
  @Input() comments!: any[];
  @Input() travelDescription!: string;

  constructor(
    private modalController: ModalController,
    private travelService: TravelService, 
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
    this.travelService.deleteComment(commentId).subscribe(
      () => {
        this.comments = this.comments.filter(comment => comment.id !== commentId);
      },
      (error) => {
        console.error('Erro ao remover comentário:', error);
      }
    );
  }
}
