import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ingresadoGuard } from './ingresado.guard';
import { NotFoundPage } from './not-found/not-found.page';
import { UsersComponent } from './users/users.component'; // Ruta correcta
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate:[ingresadoGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'create-user',
    loadChildren: () => import('./create-user/create-user.module').then( m => m.CreateUserPageModule)
  },
  {
    path: 'carro',
    loadChildren: () => import('./carro/carro.module').then( m => m.CarroPageModule),
    canActivate:[ingresadoGuard]
  },
  {
    path: 'contacto',
    loadChildren: () => import('./contacto/contacto.module').then( m => m.ContactoPageModule),
    canActivate:[ingresadoGuard]
  },
  {
    path: 'detalle-producto',
    loadChildren: () => import('./detalle-producto/detalle-producto.module').then( m => m.DetalleProductoPageModule),
    canActivate:[ingresadoGuard]
  },
  
  {
    path: 'restablecer',
    loadChildren: () => import('./restablecer/restablecer.module').then( m => m.RestablecerPageModule)
  },

  {
    path: 'users',
    component: UsersComponent,
    canActivate: [ingresadoGuard] // Ajusta según sea necesario
  },
  
  { path: 'product-add', loadChildren: () => import('./producto/product-add/product-add.module').then(m => m.ProductAddPageModule),canActivate: [ingresadoGuard]  },
  { path: 'product-list', loadChildren: () => import('./producto/product-list/product-list.module').then(m => m.ProductListPageModule), canActivate: [ingresadoGuard]  },
  { path: 'product-detail/:id', loadChildren: () => import('./producto/product-detail/product-detail.module').then(m => m.ProductDetailPageModule), canActivate: [ingresadoGuard]  },
  { path: 'product-edit/:id', loadChildren: () => import('./producto/product-edit/product-edit.module').then(m => m.ProductEditPageModule), canActivate: [ingresadoGuard]  },
  { path: 'product-all', loadChildren: () => import('./producto/product-all/product-all.module').then(m => m.ProductAllPageModule), canActivate: [ingresadoGuard]  },
  
  { path: '**', component: NotFoundPage },   {
    path: 'detalle-producto',
    loadChildren: () => import('./detalle-producto/detalle-producto.module').then( m => m.DetalleProductoPageModule), canActivate: [ingresadoGuard] 
  }
// Manejo de ruta 404
  

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
