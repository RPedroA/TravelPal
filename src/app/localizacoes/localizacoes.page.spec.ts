import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalizacoesPage } from './localizacoes.page';

describe('LocalizacoesPage', () => {
  let component: LocalizacoesPage;
  let fixture: ComponentFixture<LocalizacoesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalizacoesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
