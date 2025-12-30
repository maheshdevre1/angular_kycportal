import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BatchesComponent } from './components/batches/batches.component';
import { ExportComponent } from './components/export/export.component';
import { IndiViewReportsComponent } from './individual/indi-view-reports/indi-view-reports.component';
import { IndiLapsedComponent } from './individual/indi-lapsed/indi-lapsed.component';
import { authGuard } from './services/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, data: { hideNavbar: true, hideSidebar: true,hideFooter:true}  },
  { path: 'dashboard', canActivate: [authGuard], component: DashboardComponent},
  { path: 'batches', canActivate: [authGuard], component: BatchesComponent },
  { path: 'export', canActivate: [authGuard], component: ExportComponent},
  {path : 'indi_view_report', canActivate: [authGuard], component: IndiViewReportsComponent},
  {path : 'indi_lapsed', canActivate: [authGuard], component: IndiLapsedComponent},
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
