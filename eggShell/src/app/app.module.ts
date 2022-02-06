import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { ReactiveFormsModule } from '@angular/forms';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NavComponent } from './nav/nav.component';
import { MatCommonModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';

import { CdkAccordionModule } from '@angular/cdk/accordion';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
// import { ScrollingModule } from '@angular/cdk/scrolling';

import { AddEggComponent } from './nav/add-egg/add-egg.component';
import { AuthComponent } from './auth/auth.component';
import { BartonComponent } from './barton/barton.component';
import { GettingStartedComponent } from './getting-started/getting-started.component';
import { LoginComponent } from './auth/login/login.component';
import { MainComponent } from './nav/main/main.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { SettingsComponent } from './nav/settings/settings.component';

import { JwtInterceptor } from './common/interceptors/jwt.interceptor';
import { ConfirmPopupComponent } from './common/confirm-popup/confirm-popup.component';
import { NotificationComponent } from './nav/notification/notification.component';

@NgModule({
  declarations: [
    AppComponent,
    AddEggComponent,
    AuthComponent,
    BartonComponent,
    GettingStartedComponent,
    LoginComponent,
    NavComponent,
    RegistrationComponent,
    SettingsComponent,
    MainComponent,
    ConfirmPopupComponent,
    NotificationComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CdkAccordionModule,
    DragDropModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    OverlayModule,
    ReactiveFormsModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatCommonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatStepperModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: { hasBackDrop: true }
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {}
    },
    {
      provide: MAT_SNACK_BAR_DATA,
      useValue: {}
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    { 
      provide: LOCALE_ID, useValue: "en-US" 
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
