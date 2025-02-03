import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ViagemFormModalComponent } from './viagem-form-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('ViagemFormModalComponent', () => {
  let component: ViagemFormModalComponent;
  let fixture: ComponentFixture<ViagemFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViagemFormModalComponent],
      imports: [IonicModule.forRoot(), ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ViagemFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
