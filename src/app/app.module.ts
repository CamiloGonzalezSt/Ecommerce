import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LogoutConfirmationComponent } from './logout-confirmation/logout-confirmation.component';
import { NotFoundPage } from './not-found/not-found.page';
import { UsersComponent } from './users/users.component';
import { SqliteService } from './services/sqlite.service'; 
import { HttpClientModule } from '@angular/common/http';




@NgModule({
  declarations: [AppComponent, LogoutConfirmationComponent, NotFoundPage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, SqliteService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
