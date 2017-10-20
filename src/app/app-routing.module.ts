import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ModListComponent} from './mod-list/mod-list.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'list',
    component: ModListComponent
  },
  {
    path: '',
    redirectTo: '/list',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
