import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { TravelService } from '../services/travel.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-edit-viagem-modal',
  templateUrl: './edit-viagem-modal.component.html',
  styleUrls: ['./edit-viagem-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
  ],
})
export class EditViagemModalComponent {
  @Input() viagem: any; 
  editForm: FormGroup; 

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private travelService: TravelService,
    private alertController: AlertController
  ) {
    this.editForm = this.formBuilder.group({
      nome: ['', Validators.required],
      destino: ['', Validators.required],
      tipo: ['', Validators.required],
      participantes: [1, [Validators.required, Validators.min(1)]],
      estado: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
    }, { validators: this.dateValidation });
  }

  ngOnInit() {
    if (this.viagem) {
      console.log('Viagem recebida no modal:', this.viagem);
      this.editForm.patchValue({
        nome: this.viagem.description,
        destino: this.viagem.prop2,
        tipo: this.viagem.type,
        participantes: parseInt(this.viagem.prop1, 10),
        estado: this.viagem.state,
        dataInicio: this.viagem.startAt ? new Date(this.viagem.startAt).toISOString() : '',
        dataFim: this.viagem.endAt ? new Date(this.viagem.endAt).toISOString() : '',
      });
    }
  }
  

  dateValidation(group: AbstractControl): { [key: string]: any } | null {
    const dataInicio = group.get('dataInicio')?.value;
    const dataFim = group.get('dataFim')?.value;
    if (dataInicio && dataFim && new Date(dataInicio) > new Date(dataFim)) {
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
        description: this.editForm.value.nome, 
        prop2: this.editForm.value.destino,     
        type: this.editForm.value.tipo,        
        prop1: this.editForm.value.participantes.toString(),
        state: this.editForm.value.estado,     
        startAt: this.editForm.value.dataInicio, 
        endAt: this.editForm.value.dataFim,    
      };
  
      console.log('Dados para enviar:', updatedData); 
  
      this.travelService.updateTravel(this.viagem.id, updatedData, this.viagem).subscribe(
        (response) => {
          console.log('Viagem atualizada com sucesso:', response);
          this.modalController.dismiss(response); 
        },
        (error) => {
          console.error('Erro ao atualizar viagem:', error);
        }
      );
    }
  }
  
  async deleteViagem(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: 'Você tem certeza de que deseja excluir esta viagem?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Exclusão cancelada');
          },
        },
        {
          text: 'Excluir',
          handler: () => {
            this.travelService.deleteTravel(id).subscribe(
              (response) => {
                console.log('Viagem excluída:', response);
                this.modalController.dismiss({ deleted: true }); 
              },
              (error) => {
                console.error('Erro ao excluir viagem:', error);
              }
            );
          },
        },
      ],
    });
  
    await alert.present();
  }
}