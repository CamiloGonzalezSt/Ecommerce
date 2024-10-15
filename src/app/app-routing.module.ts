import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { noIngresadoGuard } from './no-ingresado.guard';
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
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canActivate:[noIngresadoGuard] //Aquí decimos que la pagina login se mostrará a todos, no necesitan estar registrados para ver esta pagina
  },
  {
    path: 'create-user',
    loadChildren: () => import('./create-user/create-user.module').then( m => m.CreateUserPageModule),
    canActivate:[noIngresadoGuard] //Aquí decimos que la pagina login se mostrará a todos, no necesitan estar registrados para ver esta pagina
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
    path: 'restablecer',
    loadChildren: () => import('./restablecer/restablecer.module').then( m => m.RestablecerPageModule),
    canActivate:[noIngresadoGuard] //Aquí decimos que la pagina login se mostrará a todos, no necesitan estar registrados para ver esta pagina
  },
  {
    path: 'crear',
    loadChildren: () => import('./productos/crear/crear.module').then( m => m.CrearPageModule),
    canActivate:[ingresadoGuard]
  },
  {
    path: 'actualizar',
    loadChildren: () => import('./productos/actualizar/actualizar.module').then( m => m.ActualizarPageModule),
    canActivate:[ingresadoGuard]
  },
  {
    path: 'eliminar',
    loadChildren: () => import('./productos/eliminar/eliminar.module').then( m => m.EliminarPageModule),
    canActivate:[ingresadoGuard]
  },
  {
    path: 'listar',
    loadChildren: () => import('./productos/listar/listar.module').then( m => m.ListarPageModule),
    canActivate:[ingresadoGuard]
  },

  {
    path: 'users',
    component: UsersComponent,
    canActivate: [ingresadoGuard] // Ajusta según sea necesario
  },
  
  { path: 'product-add', loadChildren: () => import('./producto/product-add/product-add.module').then(m => m.ProductAddPageModule) },
  { path: 'product-list', loadChildren: () => import('./producto/product-list/product-list.module').then(m => m.ProductListPageModule) },
  { path: 'product-detail/:id', loadChildren: () => import('./producto/product-detail/product-detail.module').then(m => m.ProductDetailPageModule) },
  { path: 'product-edit/:id', loadChildren: () => import('./producto/product-edit/product-edit.module').then(m => m.ProductEditPageModule) },
  { path: 'product-all', loadChildren: () => import('./producto/product-all/product-all.module').then(m => m.ProductAllPageModule) },
  
  { path: '**', component: NotFoundPage } // Manejo de ruta 404
  

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
