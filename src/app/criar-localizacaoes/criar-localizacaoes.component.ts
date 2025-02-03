import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-criar-localizacoes',
  templateUrl: './criar-localizacaoes.component.html',
  styleUrls: ['./criar-localizacaoes.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
})
export class CriarLocalizacoesComponent {
  @Input() travelId: string = ''; 
  localizacaoForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private locationService: LocationService,
    private formBuilder: FormBuilder
  ) {
    this.localizacaoForm = this.formBuilder.group(
      {
        description: ['', Validators.required],
        type: ['', Validators.required],
        cost: [0, [Validators.required, Validators.min(0)]], 
        state: ['', Validators.required],
        startAt: ['', Validators.required],
        endAt: ['', Validators.required],
      },
      { validators: this.validateDates }
    );
  }

  validateDates(group: AbstractControl): { [key: string]: boolean } | null {
    const startAt = group.get('startAt')?.value ? new Date(group.get('startAt')?.value) : null;
    const endAt = group.get('endAt')?.value ? new Date(group.get('endAt')?.value) : null;

    if (startAt && endAt && endAt < startAt) {
      return { invalidDateRange: true };
    }
    return null;
  }

  closeModal() {
    this.modalController.dismiss();
  }

  createLocation() {
    if (this.localizacaoForm.valid) {
      const locationData = {
        description: this.localizacaoForm.value.description,
        type: this.localizacaoForm.value.type,
        cost: this.localizacaoForm.value.cost.toString(), 
        state: this.localizacaoForm.value.state,
        startAt: new Date(this.localizacaoForm.value.startAt).toISOString(),
        endAt: new Date(this.localizacaoForm.value.endAt).toISOString(),
      };

      console.log('Enviando Localização:', locationData);

      this.locationService.createLocation(this.travelId, locationData).subscribe({
        next: (response) => {
          console.log('Localização criada com sucesso:', response);
          this.modalController.dismiss(response);
        },
        error: (error) => {
          console.error('Erro ao criar a localização:', error);
        }
      });
    } else {
      console.error('Formulário inválido');
    }
  }
}
