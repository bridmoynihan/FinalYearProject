import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeComponent } from './views/welcome/welcome.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';

import {AuthGuardService} from './services/auth-guard.service';

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
