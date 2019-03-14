import { RecipeViewComponent } from './views/recipeView/recipe-view.component';
import { WasteViewComponent } from './views/wasteView/waste-view.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';

import { WelcomeComponent } from './views/welcome/welcome.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';

import {AuthGuardService} from './services/auth-guard.service';
import {InventoryFormComponent} from './views/inventoryView/inventory-form/inventory-form.component';
import {InventoryListComponent} from './views/inventoryView/inventory-list.component'
import { InventoryEditComponent } from './views/inventoryView/inventory-edit/inventory-edit.component';

const appRoutes: Routes = [
  {
    path: 'welcome',
    component: WelcomeComponent
  },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  {
    path: 'dashboard',
    canActivate: [AuthGuardService],
    component: DashboardComponent
  },
  {
    path: 'inventory-list',
    canActivate: [AuthGuardService],
    component: InventoryListComponent
  },
  {
    path: 'inventory-form',
    canActivate: [AuthGuardService],
    component: InventoryFormComponent
  },
  {
    path: 'waste-view',
    canActivate: [AuthGuardService],
    component: WasteViewComponent
  },
  {
    path: 'recipe-view',
    canActivate: [AuthGuardService],
    component: RecipeViewComponent
  },
  {
    path: 'inventory-edit',
    canActivate: [AuthGuardService],
    component: InventoryEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
