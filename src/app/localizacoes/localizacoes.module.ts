import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocalizacoesPageRoutingModule } from './localizacoes-routing.module';

import { LocalizacoesPage } from './localizacoes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocalizacoesPageRoutingModule,
    LocalizacoesPage
  ],
})
export class LocalizacoesPageModule {}
