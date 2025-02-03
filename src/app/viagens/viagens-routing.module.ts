import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViagensPage } from './viagens.page';

const routes: Routes = [
  {
    path: '',
    component: ViagensPage, 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViagensPageRoutingModule {}
