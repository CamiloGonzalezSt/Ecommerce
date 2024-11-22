import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ingresadoGuard } from './ingresado.guard';
import { NotFoundPage } from './not-found/not-found.page';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { RegisterComponent } from './login/register/register.component';


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
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
    loadChildren: () => import('./carro/carro.module').then(m => m.CarroPageModule)
  },
  {
    path: 'contacto',
    loadChildren: () => import('./contacto/contacto.module').then(m => m.ContactoPageModule)
  },
  {
    path: 'detalle-producto',
    loadChildren: () => import('./detalle-producto/detalle-producto.module').then(m => m.DetalleProductoPageModule)
  },
  {
    path: 'product-add',
    loadChildren: () => import('./producto/product-add/product-add.module').then(m => m.ProductAddPageModule)
  },
  {
    path: 'product-list',
    loadChildren: () => import('./producto/product-list/product-list.module').then(m => m.ProductListPageModule)
  },
  {
    path: 'product-edit/:id',
    loadChildren: () => import('./producto/product-edit/product-edit.module').then(m => m.ProductEditPageModule)
  },
  {
    path: 'product-all',
    loadChildren: () => import('./producto/product-all/product-all.module').then(m => m.ProductAllPageModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then( m => m.UsersPageModule)
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
    path: '**',
    component: NotFoundPage
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
