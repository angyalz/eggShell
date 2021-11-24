import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEggComponent } from './components/add-egg/add-egg.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  { path: 'add-egg', component: AddEggComponent },
  // { path: 'login', component: LoginComponent },
  // { path: 'registration', component: RegistrationComponent },
  { path: 'settings', component: SettingsComponent},
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
