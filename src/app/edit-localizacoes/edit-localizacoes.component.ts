import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-edit-localizacoes',
  templateUrl: './edit-localizacoes.component.html',
  styleUrls: ['./edit-localizacoes.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
})
export class EditLocalizacoesModalComponent implements OnInit {
  @Input() localizacao: any; 
  editForm: FormGroup; 

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private alertController: AlertController
  ) {
    this.editForm = this.formBuilder.group({
      description: ['', Validators.required],
      type: ['', Validators.required],
      cost: [0, [Validators.required, Validators.min(0)]],
      state: ['', Validators.required],
      startAt: ['', Validators.required],
      endAt: ['', Validators.required],
    }, { validators: this.dateValidation });
  }

  ngOnInit() {
    if (this.localizacao) {
      console.log('Localização recebida no modal:', this.localizacao);
  
      this.editForm.patchValue({
        description: this.localizacao.description,
        type: this.localizacao.type,
        cost: this.localizacao.prop1 ? parseFloat(this.localizacao.prop1) : 0, 
        state: this.localizacao.state,
        startAt: this.localizacao.startAt ? new Date(this.localizacao.startAt).toISOString() : '',
        endAt: this.localizacao.endAt ? new Date(this.localizacao.endAt).toISOString() : '',
      });
    }
  }
  
  
  dateValidation(group: AbstractControl): { [key: string]: any } | null {
    const startAt = group.get('startAt')?.value;
    const endAt = group.get('endAt')?.value;
    if (startAt && endAt && new Date(startAt) > new Date(endAt)) {
      return { invalidDateRange: true };
    }
    return null;
  }

  closeModal() {
    this.modalController.dismiss();
  }

  saveChanges() {
    if (this.editForm.valid) {
      const updatedData = {
        description: this.editForm.value.description,
        type: this.editForm.value.type,
        prop1: this.editForm.value.cost.toString(), 
        state: this.editForm.value.state,
        startAt: new Date(this.editForm.value.startAt).toISOString(), 
        endAt: new Date(this.editForm.value.endAt).toISOString(), 
      };
  
      console.log('Enviando atualização:', updatedData);
  
      this.locationService.updateLocation(this.localizacao.id, updatedData).subscribe(
        (response) => {
          console.log('Localização atualizada com sucesso:', response);
          this.modalController.dismiss(response);
        },
        (error) => {
          console.error('Erro ao atualizar localização:', error);
        }
      );
    }
  }
  

  async deleteLocalizacao(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: 'Você tem certeza de que deseja excluir esta localização?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Excluir',
          handler: () => {
            this.locationService.deleteLocation(id).subscribe(
              (response) => {
                console.log('Localização excluída:', response);
                this.modalController.dismiss({ deleted: true });
              },
              (error) => {
                console.error('Erro ao excluir localização:', error);
              }
            );
          },
        },
      ],
    });

    await alert.present();
  }
}
