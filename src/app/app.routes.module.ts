import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './views/login/login.component';
import { WelcomeComponent } from './views/welcome/welcome.component';
import { UserFormComponent } from './users/user-form/user-form.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';

import {AuthGuardService} from './services/auth-guard.service';

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: UserFormComponent
  },
  {
    path: 'welcome',
    component: WelcomeComponent
  },
  { path: '',   component: WelcomeComponent},
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
