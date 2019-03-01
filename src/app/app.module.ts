import { InventoryEditComponent } from './views/inventoryView/inventory-edit/inventory-edit.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AppRoutingModule } from './app.routes.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import {BsDropdownModule} from 'ngx-bootstrap';
import {FlexLayoutModule} from '@angular/flex-layout';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import 'hammerjs';

import { AppComponent } from './app.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import {environment} from '../environments/environment';
import { WelcomeComponent } from './views/welcome/welcome.component';
import {NavbarComponent} from './views/navbar/navbar.component';
import { InventoryFormComponent } from './views/inventoryView/inventory-form/inventory-form.component';
import {InventoryListComponent} from './views/inventoryView/inventory-list.component';

import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import {InventoryService} from './services/inventory.service';
import {WasteService} from './services/waste.service'
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    WelcomeComponent,
    NavbarComponent,
    InventoryFormComponent,
    InventoryListComponent,
    InventoryEditComponent //can remove this
  
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
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    FlexLayoutModule

  ],
  providers: [AuthService, AuthGuardService, InventoryService, WasteService],
  bootstrap: [AppComponent]
})
export class AppModule { }
