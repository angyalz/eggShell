import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEggComponent } from './components/add-egg/add-egg.component';
import { BartonComponent } from './barton/barton.component';
import { GettingStartedComponent } from './getting-started/getting-started.component';
import { LoginComponent } from './auth/login/login.component';
import { MainComponent } from './components/main/main.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  { path: 'add-egg', component: AddEggComponent },
  { path: 'barton', component: BartonComponent },
  { path: 'getting-started', component: GettingStartedComponent },
  { path: 'main', component: MainComponent },
  // { path: 'login', component: LoginComponent },
  // { path: 'registration', component: RegistrationComponent },
  { path: 'settings', component: SettingsComponent},
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
