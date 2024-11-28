import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ingresadoGuard } from './ingresado.guard';
import { NotFoundPage } from './not-found/not-found.page';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { RegisterComponent } from './login/register/register.component';


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)//, canActivate: [ingresadoGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'carro',
    loadChildren: () => import('./carro/carro.module').then(m => m.CarroPageModule)//, canActivate: [ingresadoGuard]
  },
  {
    path: 'contacto',
    loadChildren: () => import('./contacto/contacto.module').then(m => m.ContactoPageModule)//, canActivate: [ingresadoGuard]
  },
  {
    path: 'detalle-producto',
    loadChildren: () => import('./detalle-producto/detalle-producto.module').then(m => m.DetalleProductoPageModule)//, canActivate: [ingresadoGuard]
  },
  {
    path: 'product-add',
    loadChildren: () => import('./producto/product-add/product-add.module').then(m => m.ProductAddPageModule)//, canActivate: [ingresadoGuard]
  },
  {
    path: 'product-list',
    loadChildren: () => import('./producto/product-list/product-list.module').then(m => m.ProductListPageModule)//, canActivate: [ingresadoGuard]
  },
  {
    path: 'product-edit/:id',
    loadChildren: () => import('./producto/product-edit/product-edit.module').then(m => m.ProductEditPageModule)//, canActivate: [ingresadoGuard]
  },
  {
    path: 'product-all',
    loadChildren: () => import('./producto/product-all/product-all.module').then(m => m.ProductAllPageModule)//, canActivate: [ingresadoGuard]
  },
  {
    path: 'client-profile',
    loadChildren: () => import('./login/profiles/client-profile/client-profile.module').then(m => m.ClientProfilePageModule)//, canActivate: [ingresadoGuard]
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'mujer-productos',
    loadChildren: () => import('./mujer-productos/mujer-productos.module').then( m => m.MujerProductosPageModule)//, canActivate: [ingresadoGuard]
  },
  {
    path: 'tecnologia',
    loadChildren: () => import('./tecnologia/tecnologia.module').then( m => m.TecnologiaPageModule)//, canActivate: [ingresadoGuard]
  },
  {
    path: 'hombre',
    loadChildren: () => import('./hombre/hombre.module').then( m => m.HombrePageModule)
  },
  {
    path: 'hogar',
    loadChildren: () => import('./hogar/hogar.module').then( m => m.HogarPageModule)
  },
  {
    path: '**',
    component: NotFoundPage
  }

  


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
