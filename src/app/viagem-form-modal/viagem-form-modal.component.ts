import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; 
import { CommonModule } from '@angular/common';
import { TravelService } from '../services/travel.service';

@Component({
  selector: 'app-viagem-form-modal',
  templateUrl: './viagem-form-modal.component.html',
  styleUrls: ['./viagem-form-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule], 
})
export class ViagemFormModalComponent {
  viagemForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private travelService: TravelService,
    private formBuilder: FormBuilder
  ) {
    this.viagemForm = this.formBuilder.group({
      nome: ['', Validators.required],
      destino: ['', Validators.required],
      tipo: ['', Validators.required],
      participantes: [1, [Validators.required, Validators.min(1)]],
      estado: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
    }, { validators: this.validateDates }); 
  }

  validateDates(group: AbstractControl): { [key: string]: boolean } | null {
    const dataInicio = group.get('dataInicio')?.value ? new Date(group.get('dataInicio')?.value) : null;
    const dataFim = group.get('dataFim')?.value ? new Date(group.get('dataFim')?.value) : null;
  
    if (dataInicio && dataFim && dataFim < dataInicio) {
      return { invalidDateRange: true };
    }
    return null;
  }
  
  closeModal() {
    this.modalController.dismiss();
  }


  createViagem(formValue: any) {
    if (this.viagemForm.valid) {
      const travelData = {
        description: formValue.nome,
        type: formValue.tipo,
        state: formValue.estado,
        startAt: new Date(formValue.dataInicio).toISOString(),
        endAt: new Date(formValue.dataFim).toISOString(),
        prop1: formValue.participantes.toString(),
        prop2: formValue.destino,
      };
  
      this.travelService.createTravel(travelData).subscribe(
        (response) => {
          console.log('Viagem criada com sucesso:', response);
          this.modalController.dismiss(response);
        },
        (error) => {
          console.error('Erro ao criar a viagem:', error);
        }
      );
    } else {
      console.error('Formulário inválido');
    }
  }
  
}
