import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AlertComponent } from './alert/alert.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { LayoutModule } from '@angular/cdk/layout';
import { MatChipsModule } from '@angular/material/chips';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogboxComponent } from './components/dialogbox/dialogbox.component';
import { BatchesComponent } from './components/batches/batches.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import { ExportComponent } from './components/export/export.component';
import { IndiViewReportsComponent } from './individual/indi-view-reports/indi-view-reports.component';
import { IndiLapsedComponent } from './individual/indi-lapsed/indi-lapsed.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AlertComponent,
    DashboardComponent,
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    DialogboxComponent,
    BatchesComponent,
    ExportComponent,
    IndiViewReportsComponent,
    IndiLapsedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatDividerModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ToastModule,
    MatToolbarModule,
    MatListModule,
    MatExpansionModule,
    MatSidenavModule,
    LayoutModule,
    MatChipsModule,
    MatTableModule,
    MatDialogModule,
    MatTooltipModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    MatSelectModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
