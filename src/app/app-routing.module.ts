import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {AdminsComponent} from './admins/admins.component';
import {SettingsComponent} from './settings/settings.component';
import {GuardsComponent} from './guards/guards.component';
import {FacilitiesComponent} from './facilities/facilities.component';
import {QuestionsComponent} from './questions/questions.component';
import { AuthGuard } from './_helpers/auth.guard';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'admins', component: AdminsComponent, canActivate: [AuthGuard] },
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
    { path: 'guards', component: GuardsComponent, canActivate: [AuthGuard] },
    { path: 'facilities', component: FacilitiesComponent, canActivate: [AuthGuard] },
    { path: 'questions', component: QuestionsComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
