import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BatchesComponent } from './components/batches/batches.component';
import { ExportComponent } from './components/export/export.component';
import { IndiViewReportsComponent } from './individual/indi-view-reports/indi-view-reports.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, data: { hideNavbar: true, hideSidebar: true,hideFooter:true}  },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'batches', component: BatchesComponent },
  { path: 'export', component: ExportComponent },
  {path : 'indi_view_report', component: IndiViewReportsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
