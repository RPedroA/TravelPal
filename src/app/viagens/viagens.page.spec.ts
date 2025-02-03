import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ViagensPage } from './viagens.page';

describe('ViagensPage', () => {
  let component: ViagensPage;
  let fixture: ComponentFixture<ViagensPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViagensPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ViagensPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
