import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtro-localizacoes',
  templateUrl: './filtros-localizacoes.component.html',
  styleUrls: ['./filtros-localizacoes.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class FiltroLocalizacoesModalComponent {
  orderBy: string = 'date-desc';
  showOnlyFavorites: boolean = false;

  constructor(private modalController: ModalController) {}

  applyFilters() {
    this.modalController.dismiss({
      orderBy: this.orderBy,
      showOnlyFavorites: this.showOnlyFavorites,
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
