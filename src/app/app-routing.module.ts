import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard,redirectUnauthorizedTo } from '@angular/fire/auth-guard';
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'pagina-anime/:id',
    loadChildren: () => import('./pages/pagina-anime/pagina-anime.module').then( m => m.PaginaAnimePageModule),
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'pagina-anime/:id/:url',
    loadChildren: () => import('./pages/browser/browser.module').then( m => m.BrowserPageModule),
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
  },

  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then( m => m.SearchPageModule),
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'perfilnpx',
    loadChildren: () => import('./pages/cliente/user/perfilnpx/perfilnpx.module').then( m => m.PerfilnpxPageModule),
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule),
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }

  },
  {
    path: 'mis-animes',
    loadChildren: () => import('./pages/mis-animes/mis-animes.module').then( m => m.MisAnimesPageModule),
    canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }

  },



];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
