import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocalizacoesPage } from './localizacoes.page';

const routes: Routes = [
  {
    path: '',
    component: LocalizacoesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocalizacoesPageRoutingModule {}
