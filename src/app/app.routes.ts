import { Routes } from '@angular/router';
import {AppComponent} from './app.component';
import {LoginFormComponent} from './pages-features/login/login-form/login-form.component';
import {ClientComponent} from './pages-features/client/client.component';
import {DispatchComponent} from './pages-features/dispatch/dispatch.component';
import {CampaingComponent} from './pages-features/campaing/campaing.component';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'home', component: AppComponent},
  {path: 'login', component: LoginFormComponent},
  {path: 'client', component: ClientComponent},
  {path: 'dispatch', component: DispatchComponent},
  {path: 'campaing', component: CampaingComponent},
];
