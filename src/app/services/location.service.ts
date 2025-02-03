import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, finalize, catchError } from 'rxjs';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
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
      cssClass: 'custom-loading-class',
    });
    toast.present();
  }

  getLocations(travelId: string): Observable<any[]> {
    const headers = this.getAuthHeaders();

    return this.http
      .get<any[]>(`${this.baseUrl}/${travelId}/locations`, { headers })
      .pipe(
        map((locations: any[]) => {
          console.log(`Locations loaded for travel ${travelId}:`, locations);
          if (locations && locations.length > 0) {
            return locations.sort(
              (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
            );
          }
          return locations;
        }),
        catchError(async (error) => {
          console.error('Error loading locations:', error);
          await this.showAlert(
            'Erro ao carregar localizações',
            'Não foi possível carregar as localizações. Tente novamente mais tarde.'
          );
          throw error;
        })
      );
  }

  createLocation(travelId: string, locationData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    const loadingPromise = this.showLoading('A criar localização...');
    
    const payload = {
      travelId,
      description: locationData.description,
      type: locationData.type,
      prop1: locationData['cost'] ? locationData['cost'].toString() : '0', 
      state: locationData.state,
      startAt: locationData.startAt,
      endAt: locationData.endAt,
    };

    console.log('Creating location with data:', payload);

    return this.http
      .post<any>(`${this.baseUrl}/locations`, payload, { headers })
      .pipe(
        finalize(async () => {
          const loading = await loadingPromise;
          await loading.dismiss();
          this.showToast('Localização criada com sucesso!', 'success');
        }),
        catchError(async (error) => {
          console.error('Error creating location:', error);
          await this.showAlert(
            'Erro ao criar localização',
            'Não foi possível criar a localização. Verifique os dados e tente novamente.'
          );
          throw error;
        })
      );
  }

  updateLocation(locationId: string, locationData: Partial<any>): Observable<any> {
    const headers = this.getAuthHeaders();
    const loadingPromise = this.showLoading('A atualizar localização...');
  
    const payload = {
      ...locationData,
      ['prop1']: locationData['prop1'] ? locationData['prop1'].toString() : '0', 
      startAt: locationData['startAt'] ? new Date(locationData['startAt']).toISOString() : null, 
      endAt: locationData['endAt'] ? new Date(locationData['endAt']).toISOString() : null, 
    };
  
    console.log(`Atualizando localização ${locationId} com dados:`, payload);
  
    return this.http
      .put<any>(`${this.baseUrl}/locations/${locationId}`, payload, { headers })
      .pipe(
        finalize(async () => {
          const loading = await loadingPromise;
          await loading.dismiss();
          this.showToast('Localização atualizada com sucesso!', 'success');
        }),
        catchError(async (error) => {
          console.error('Erro ao atualizar localização:', error);
          await this.showAlert(
            'Erro ao atualizar localização',
            'Não foi possível atualizar a localização. Tente novamente.'
          );
          throw error;
        })
      );
  }
  
  

  deleteLocation(locationId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const loadingPromise = this.showLoading('A excluir localização...');

    console.log(`Deleting location with ID: ${locationId}`);

    return this.http
      .delete<any>(`${this.baseUrl}/locations/${locationId}`, { headers })
      .pipe(
        finalize(async () => {
          const loading = await loadingPromise;
          await loading.dismiss();
          this.showToast('Localização excluída com sucesso!', 'success');
        }),
        catchError(async (error) => {
          console.error('Error deleting location:', error);
          await this.showAlert(
            'Erro ao excluir localização',
            'Não foi possível excluir a localização. Tente novamente.'
          );
          throw error;
        })
      );
  }

  toggleFavorite(locationId: string, isFav: boolean): Observable<any> {
    const headers = this.getAuthHeaders();
    const updatedLocation = { isFav };

    console.log(`Toggling favorite for location ${locationId}:`, { isFav });

    return this.http
      .put<any>(`${this.baseUrl}/locations/${locationId}`, updatedLocation, { headers })
      .pipe(
        catchError(async (error) => {
          console.error('Error updating favorite:', error);
          await this.showAlert(
            'Erro ao atualizar favorito',
            'Não foi possível atualizar o estado de favorito. Tente novamente.'
          );
          throw error;
        })
      );
  }

  createComment(locationId: string, comment: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const payload = { locationId, comment };

    console.log('Sending comment to API:', payload);

    return this.http
      .post<any>(`${this.baseUrl}/locations/comments`, payload, { headers })
      .pipe(
        finalize(() => {
          this.showToast('Comentário adicionado com sucesso!', 'success');
        }),
        catchError(async (error) => {
          console.error('Error adding comment:', error);
          await this.showAlert(
            'Erro ao adicionar comentário',
            'Não foi possível adicionar o comentário. Tente novamente.'
          );
          throw error;
        })
      );
  }

  deleteComment(commentId: string): Observable<any> {
    const headers = this.getAuthHeaders();

    console.log(`Deleting comment ID: ${commentId}`);

    return this.http
      .delete<any>(`${this.baseUrl}/locations/comments/${commentId}`, { headers })
      .pipe(
        catchError(async (error) => {
          console.error('Error deleting comment:', error);
          await this.showAlert(
            'Erro ao remover comentário',
            'Não foi possível remover o comentário. Tente novamente.'
          );
          throw error;
        })
      );
  }

  private getAuthHeaders(): HttpHeaders {
    const username = 'r.u.a@ipvc.pt';
    const password = 'N9#zWt2Y';
    return new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
      'Content-Type': 'application/json',
    });
  }
}
