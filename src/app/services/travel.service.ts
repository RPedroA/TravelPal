import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, finalize, catchError } from 'rxjs';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class TravelService {
  private baseUrl = 'https://mobile-api-one.vercel.app/api/travels';

  constructor(
    private http: HttpClient,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController 
  ) {}

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'], 
    });
    await alert.present();
  }

  private async showLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
      cssClass: 'custom-loading-class',
      spinner: 'crescent',
    });
    await loading.present();
    return loading;
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color,
      cssClass: 'custom-loading-class'
    });
    toast.present();
  }

  getTravels(): Observable<any[]> {
    const username = 'r.u.a@ipvc.pt';
    const password = 'N9#zWt2Y';
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
      'Content-Type': 'application/json',
    });
  
    const loading = this.showLoading('A carregar viagens...');
  
    return this.http.get<any[]>(this.baseUrl, { headers }).pipe(
      finalize(async () => (await loading).dismiss()),
      map((travels: any[]) => {

        if (travels && travels.length > 0) {
          return travels.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        return travels; 
      }),
      catchError(async (error) => {
        await this.showAlert(
          'Erro ao carregar viagens',
          'Não foi possível carregar as viagens. Tente novamente mais tarde.'
        );
        throw error;
      })
    );
  }
  
  createTravel(travelData: any): Observable<any> {
    const username = 'r.u.a@ipvc.pt';
    const password = 'N9#zWt2Y';
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
      'Content-Type': 'application/json',
    });

    const loading = this.showLoading('A criar viagem...');

    return this.http.post<any>(this.baseUrl, travelData, { headers }).pipe(
      finalize(async () => {
        (await loading).dismiss();
        this.showToast('Viagem criada com sucesso!', 'success');
      }),
      catchError(async (error) => {
        await this.showAlert('Erro ao criar viagem', 'Não foi possível criar a viagem. Verifique os dados e tente novamente.');
        throw error;
      })
    );
  }

  updateTravel(id: string, travelData: Partial<any>, currentTravel: any): Observable<any> {
    const username = 'r.u.a@ipvc.pt';
    const password = 'N9#zWt2Y';
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
      'Content-Type': 'application/json',
    });
  
    const updatedTravel = {
      ...currentTravel, 
      ...travelData, 
    };
  
    const loading = this.showLoading('A atualizar viagem...');
  
    return this.http.put<any>(`${this.baseUrl}/${id}`, updatedTravel, { headers }).pipe(
      finalize(async () => {
        (await loading).dismiss();
        this.showToast('Viagem atualizada com sucesso!', 'success');
      }),
      catchError(async (error) => {
        await this.showAlert('Erro ao atualizar viagem', 'Não foi possível atualizar a viagem. Tente novamente.');
        throw error;
      })
    );
  }
  
  

  deleteTravel(id: string): Observable<any> {
    const username = 'r.u.a@ipvc.pt';
    const password = 'N9#zWt2Y';
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
    });

    const loading = this.showLoading('A excluir viagem...');

    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers }).pipe(
      finalize(async () => {
        (await loading).dismiss();
        this.showToast('Viagem excluída com sucesso!', 'danger');
      }),
      catchError(async (error) => {
        await this.showAlert('Erro ao excluir viagem', 'Não foi possível excluir a viagem. Tente novamente.');
        throw error;
      })
    );
  }

  toggleFavorite(id: string, isFav: boolean, currentTravel: any): Observable<any> {
    const username = 'r.u.a@ipvc.pt';
    const password = 'N9#zWt2Y';
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
      'Content-Type': 'application/json',
    });
  
    const updatedTravel = {
      ...currentTravel,
      isFav: isFav,
    };
  
    return this.http.put<any>(`${this.baseUrl}/${id}`, updatedTravel, { headers }).pipe(
      catchError(async (error) => {
        await this.showAlert(
          'Erro ao atualizar favorito',
          'Não foi possível atualizar o estado de favorito. Tente novamente.'
        );
        throw error;
      })
    );
  }
  
  

  createComment(travelId: string, comment: string): Observable<any> {
    const username = 'r.u.a@ipvc.pt';
    const password = 'N9#zWt2Y';
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
      'Content-Type': 'application/json',
    });
  
    const commentData = { travelId, comment };
  
    return this.http.post<any>(`${this.baseUrl}/comments`, commentData, { headers }).pipe(
      finalize(() => {
        this.showToast('Comentário adicionado com sucesso!', 'success');
      }),
      catchError(async (error) => {
        await this.showAlert('Erro ao adicionar comentário', 'Não foi possível adicionar o comentário. Tente novamente.');
        throw error;
      })
    );
  }
  
  deleteComment(commentId: string): Observable<any> {
    const username = 'r.u.a@ipvc.pt';
    const password = 'N9#zWt2Y';
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
      'Content-Type': 'application/json',
    });
  
    return this.http.delete<any>(`${this.baseUrl}/comments/${commentId}`, { headers }).pipe(
      finalize(() => {
        this.showToast('Comentário removido com sucesso!', 'success');
      }),
      catchError(async (error) => {
        await this.showAlert('Erro ao remover comentário', 'Não foi possível remover o comentário. Tente novamente.');
        throw error;
      })
    );
  }

  
}
