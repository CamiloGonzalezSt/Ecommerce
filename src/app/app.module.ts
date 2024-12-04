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
import { CommonModule } from '@angular/common';
import { UpdateClienteComponent } from './modals/update-cliente/update-cliente.component';
import { UpdatePasswordClientComponent } from './modals/update-password-client/update-password-client.component';
import { UpdateUsernameClientComponent } from './modals/update-username-client/update-username-client.component';
import { UpdateProfilePhotoComponent } from './modals/update-profile-photo/update-profile-photo.component';
import { IonicStorageModule } from '@ionic/storage-angular';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'
import { OrderDetailsComponent } from './order-details/order-details.component';



const firebaseConfig = {
  apiKey: "AIzaSyBodD3Sbap7BzLJRGXHdkCEzvpRGUV3hq4",
  authDomain: "ecommerce-ca.firebaseapp.com",
  projectId: "ecommerce-ca",
  storageBucket: "ecommerce-ca.firebasestorage.app",
  messagingSenderId: "622977442857",
  appId: "1:622977442857:web:5c8cb84684e9243423a838",
  measurementId: "G-TFGBQ7SHC1"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

@NgModule({
  declarations: [AppComponent, LogoutConfirmationComponent, NotFoundPage, OrderDetailsComponent,UpdateClienteComponent, UpdatePasswordClientComponent, UpdateUsernameClientComponent, UpdateProfilePhotoComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule, FormsModule, BrowserAnimationsModule,   MatSelectModule,
    MatInputModule,
    MatFormFieldModule, CommonModule, IonicModule, IonicStorageModule, AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, ],
  providers: [SQLite, InAppBrowser,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, SqliteService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
