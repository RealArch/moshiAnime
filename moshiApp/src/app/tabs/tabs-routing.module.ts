import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'explora',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'mis-animes',
        loadChildren: () => import('../pages/mis-animes/mis-animes.module').then( m => m.MisAnimesPageModule)
      },
      {
        path: 'ajustes',
        loadChildren: () => import('../pages/ajustes/ajustes.module').then(m => m.AjustesPageModule)
      },
      {
        path: 'seasons',
        loadChildren: () => import('../pages/seasons/seasons.module').then(m => m.SeasonsPageModule),
    
      },
      {
        path: '',
        redirectTo: '/explora',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
