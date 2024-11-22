import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LogoutConfirmationComponent } from './logout-confirmation/logout-confirmation.component';
import { NotFoundPage } from './not-found/not-found.page';
import { SqliteService } from './services/sqlite.service'; 
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [AppComponent, LogoutConfirmationComponent, NotFoundPage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule, FormsModule, BrowserAnimationsModule,   MatSelectModule,
    MatInputModule,
    MatFormFieldModule,],
  providers: [SQLite, InAppBrowser,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, SqliteService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
