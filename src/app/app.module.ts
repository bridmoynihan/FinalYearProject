import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AppRoutingModule } from './app.routes.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import {environment} from '../environments/environment';
import { WelcomeComponent } from './views/welcome/welcome.component';
import { UserFormComponent } from './users/user-form/user-form.component';

import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import {BsDropdownModule} from 'ngx-bootstrap';
import {InventoryService} from './services/inventory.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    WelcomeComponent,
    UserFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'angular-auth-firebase'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot()

  ],
  providers: [AuthService, AuthGuardService, InventoryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
