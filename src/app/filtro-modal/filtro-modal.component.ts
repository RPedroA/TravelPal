import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtro-modal',
  templateUrl: './filtro-modal.component.html',
  styleUrls: ['./filtro-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class FiltroModalComponent {
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