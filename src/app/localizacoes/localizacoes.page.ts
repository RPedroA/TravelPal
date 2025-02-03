import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CriarLocalizacoesComponent } from '../criar-localizacaoes/criar-localizacaoes.component';
import { ComentariosLocalizacoesComponent } from '../comentarios-localizacoes/comentarios-localizacoes.component';
import { FiltroLocalizacoesModalComponent } from '../filtros-localizacoes/filtros-localizacoes.component';
import { EditLocalizacoesModalComponent } from '../edit-localizacoes/edit-localizacoes.component'
import {
  LoadingController,
  IonicModule,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-localizacoes',
  templateUrl: './localizacoes.page.html',
  styleUrls: ['./localizacoes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CriarLocalizacoesComponent,
    ComentariosLocalizacoesComponent,
  ],
})
export class LocalizacoesPage implements OnInit {
  travelId: string = '';
  localizacoes: any[] = [];
  filteredLocalizacoes: any[] = [];
  newComment: string = '';

  constructor(
    private route: ActivatedRoute,
    private localizacaoService: LocationService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log('Parâmetros recebidos:', params);
      this.travelId = params['travelId'];
      if (!this.travelId) {
        console.error('travelId não recebido corretamente!');
      }
      this.loadLocalizacoes();
    });
  }

  async loadLocalizacoes() {
    const loading = await this.loadingController.create({
      message: 'Carregando localizações...',
      spinner: 'crescent',
    });
    await loading.present();

    this.localizacaoService.getLocations(this.travelId).subscribe({
      next: (data: any[]) => {
        console.log('Localizações recebidas para a viagem:', this.travelId, data);

        this.localizacoes = data && data.length > 0 ? data : [];
        this.filteredLocalizacoes = [...this.localizacoes];

        loading.dismiss();
      },
      error: async () => {
        console.error('Erro ao carregar localizações para a viagem:', this.travelId);
        await loading.dismiss();
        this.showToast('Não foi possível carregar as localizações.', 'danger');
      },
    });
  }

  async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color,
    });
    toast.present();
  }

  onSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredLocalizacoes = this.localizacoes.filter((localizacao) =>
      localizacao.description.toLowerCase().includes(searchTerm)
    );
  }

  async toggleFavorite(localizacao: any) {
    const isFav = !localizacao.isFav;

    console.log(`Trocando favorito da localização ${localizacao.id}:`, {
      antes: localizacao.isFav,
      depois: isFav,
    });

    this.localizacaoService.toggleFavorite(localizacao.id, isFav).subscribe({
      next: async () => {
        console.log(`Localização ${localizacao.id} atualizada para favorito:`, isFav);
        localizacao.isFav = isFav;
        this.showToast('Estado de favorito atualizado!', 'success');
      },
      error: async (error) => {
        console.error('Erro ao alternar favorito:', error);
        this.showToast('Não foi possível atualizar o estado de favorito.', 'danger');
      },
    });
  }

  async openCreateLocationModal() {
    const modal = await this.modalController.create({
      component: CriarLocalizacoesComponent,
      componentProps: {
        travelId: this.travelId,
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      console.log('Nova localização adicionada:', data);
      this.loadLocalizacoes();
    }
  }

  async addComment(localizacao: any) {
    const comment = localizacao.newComment?.trim();

    if (!comment) {
      this.showToast('Por favor, escreva um comentário antes de enviar.', 'danger');
      return;
    }

    console.log(`Adding comment to location ${localizacao.id}:`, comment);

    this.localizacaoService.createComment(localizacao.id, comment).subscribe({
      next: (response) => {
        console.log('Comentário adicionado com sucesso:', response);
        if (!localizacao.comments) {
          localizacao.comments = [];
        }
        localizacao.comments.push(response);
        localizacao.newComment = '';
        this.showToast('Comentário adicionado com sucesso!', 'success');
      },
      error: async (error) => {
        console.error('Erro ao adicionar comentário:', error);
        this.showToast('Erro ao adicionar comentário. Tente novamente.', 'danger');
      },
    });
  }

  async openCommentsModal(localizacao: any) {
    const loading = await this.loadingController.create({
      message: 'Carregando comentários...',
      spinner: 'crescent',
    });
    await loading.present();

    const modal = await this.modalController.create({
      component: ComentariosLocalizacoesComponent,
      componentProps: {
        comments: localizacao.comments || [],
        locationDescription: localizacao.description,
      },
    });

    await modal.present();
    await loading.dismiss();

    const { data } = await modal.onWillDismiss();
    if (data?.updatedComments) {
      localizacao.comments = data.updatedComments;
    }
  }

  async openFilters() {
    const modal = await this.modalController.create({
      component: FiltroLocalizacoesModalComponent,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.applyFilters(data.orderBy, data.showOnlyFavorites);
    }
  }

  applyFilters(orderBy: string, showOnlyFavorites: boolean) {
    let filtered = [...this.localizacoes];

    if (showOnlyFavorites) {
      filtered = filtered.filter((localizacao) => localizacao.isFav);
    }

    switch (orderBy) {
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());
        break;
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
        break;
      case 'alpha-asc':
        filtered.sort((a, b) => a.description.localeCompare(b.description));
        break;
      case 'alpha-desc':
        filtered.sort((a, b) => b.description.localeCompare(a.description));
        break;
    }

    this.filteredLocalizacoes = filtered;
  }

  async editLocalizacao(localizacao: any) {
    const modal = await this.modalController.create({
      component: EditLocalizacoesModalComponent,
      componentProps: { localizacao },
    });
  
    await modal.present();
  
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.loadLocalizacoes(); 
      this.showToast('Localização atualizada com sucesso!', 'success');
    }
  }  

  returnToTravels() {
    this.router.navigate(['/tabs/viagens']);
  }
}
