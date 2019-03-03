import { DeleteModalComponent } from './views/inventoryView/delete-modal.component';
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
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
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
import { WasteGraphComponent } from './views/wasteView/waste-graph.component';
import { InventoryEditComponent } from './views/inventoryView/inventory-edit/inventory-edit.component';
import { WasteViewComponent } from './views/wasteView/waste-view.component';

import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import {InventoryService} from './services/inventory.service';
import {WasteService} from './services/waste.service';
import { PlotlyModule } from 'angular-plotly.js';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    WelcomeComponent,
    NavbarComponent,
    InventoryFormComponent,
    InventoryListComponent,
    WasteGraphComponent,
    WasteViewComponent,
    InventoryEditComponent,  //can remove this
    DeleteModalComponent
  
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
    NgbModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    PlotlyModule
  ],
  entryComponents: [DeleteModalComponent],
  providers: [AuthService, AuthGuardService, InventoryService, WasteService],
  bootstrap: [AppComponent]
})
export class AppModule { }
