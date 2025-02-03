import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  LoadingController,
  IonicModule,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Router } from '@angular/router'; 
import { TravelService } from '../services/travel.service';
import { ViagemFormModalComponent } from '../viagem-form-modal/viagem-form-modal.component';
import { EditViagemModalComponent } from '../edit-viagem-modal/edit-viagem-modal.component';
import { ComentariosModalComponent } from '../comentarios-modal/comentarios-modal.component';
import { FiltroModalComponent } from '../filtro-modal/filtro-modal.component';

@Component({
  selector: 'app-viagens',
  templateUrl: './viagens.page.html',
  styleUrls: ['./viagens.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ViagemFormModalComponent,
    EditViagemModalComponent,
    FiltroModalComponent,
  ],
})
export class ViagensPage implements OnInit {
  viagens: any[] = [];
  filteredViagens: any[] = [];
  searchText: string = '';
  newComment: string = '';

  constructor(
    private travelService: TravelService,
    private modalController: ModalController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router 
  ) {}

  ngOnInit() {
    this.loadViagens();
  }

  loadViagens() {
    this.travelService.getTravels().subscribe(
      (data: any) => {
        this.viagens = data;
        this.filteredViagens = data;
      },
      (error) => {
        console.error('Erro ao carregar viagens:', error);
        this.showToast('Erro ao carregar viagens.', 'danger');
      }
    );
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color,
    });
    toast.present();
  }

  addComment(travelId: string) {
    const viagem = this.viagens.find((v) => v.id === travelId);
  
    if (!viagem) {
      this.showToast('Viagem não encontrada!', 'danger');
      return;
    }
  
    const comment = viagem.newComment?.trim();
  
    if (comment) {
      this.travelService.createComment(travelId, comment).subscribe(
        (response) => {
          console.log('Comentário adicionado com sucesso:', response);
          viagem.newComment = ''; 
          if (!viagem.comments) {
            viagem.comments = []; 
          }
          viagem.comments.push(response); 
          this.showToast('Comentário adicionado com sucesso!', 'success');
        },
        (error) => {
          console.error('Erro ao adicionar comentário:', error);
          this.showToast(
            'Erro ao adicionar comentário. Tente novamente.',
            'danger'
          );
        }
      );
    } else {
      this.showToast(
        'Por favor, escreva um comentário antes de enviar.',
        'danger'
      );
    }
  }
  

  onSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.trim() !== '') {
      this.filteredViagens = this.viagens.filter((viagem) =>
        viagem.description.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredViagens = [...this.viagens];
    }
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ViagemFormModalComponent,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.loadViagens();
      this.showToast('Viagem criada com sucesso!', 'success');
    }
  }

  async editViagem(viagem: any) {
    const modal = await this.modalController.create({
      component: EditViagemModalComponent,
      componentProps: { viagem },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.loadViagens();
      this.showToast('Viagem atualizada com sucesso!', 'success');
    }
  }

  deleteViagem(id: string) {
    this.travelService.deleteTravel(id).subscribe(
      () => {
        console.log('Viagem excluída com sucesso');
        this.loadViagens();
        this.showToast('Viagem excluída com sucesso!', 'danger');
      },
      (error) => {
        console.error('Erro ao excluir viagem:', error);
        this.showToast('Erro ao excluir viagem.', 'danger');
      }
    );
  }

  toggleFavorite(viagem: any) {
    this.travelService
      .toggleFavorite(viagem.id, !viagem.isFav, viagem)
      .subscribe(
        (response) => {
          viagem.isFav = response.isFav;
          console.log(
            `Viagem ${viagem.id} agora está ${
              response.isFav ? 'favorita' : 'não favorita'
            }`
          );
        },
        (error) => {
          console.error('Erro ao alternar favorito:', error);
          this.showToast(
            'Erro ao alternar favorito. Tente novamente.',
            'danger'
          );
        }
      );
  }

  async openCommentsModal(viagem: any) {
    const loading = await this.loadingController.create({
      message: 'Carregando comentários...',
      spinner: 'crescent',
    });
    await loading.present();

    const modal = await this.modalController.create({
      component: ComentariosModalComponent,
      componentProps: {
        comments: viagem.comments,
        travelDescription: viagem.description,
      },
    });

    await modal.present();
    await loading.dismiss();

    const { data } = await modal.onWillDismiss();
    if (data?.updatedComments) {
      viagem.comments = data.updatedComments;
    }
  }

  async openFilters() {
    const modal = await this.modalController.create({
      component: FiltroModalComponent,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.applyFilters(data.orderBy, data.showOnlyFavorites);
    }
  }

  applyFilters(orderBy: string, showOnlyFavorites: boolean) {
    let filtered = [...this.viagens];

    if (showOnlyFavorites) {
      filtered = filtered.filter((viagem) => viagem.isFav);
    }

    switch (orderBy) {
      case 'date-desc':
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;

      case 'date-asc':
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;

      case 'alpha-asc':
        filtered.sort((a, b) => a.description.localeCompare(b.description));
        break;

      case 'alpha-desc':
        filtered.sort((a, b) => b.description.localeCompare(a.description));
        break;
    }

    this.filteredViagens = filtered;
  }

  openLocations(viagem: any) {
    console.log('Abrindo Localizações para viagem:', viagem.id);
    this.router.navigate(['/localizacoes'], { queryParams: { travelId: viagem.id } });
  }
}
