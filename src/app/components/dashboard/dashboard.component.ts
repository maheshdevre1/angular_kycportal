import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonRequest } from 'src/app/services/model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {


  dashbaordData = {} as CommonRequest;

  bankCode: string = '';
  bankName : string = '';
  branchCode : string = '';
  lastLogin : string = '';
  userName : string = '';
  roleName : string = '';
  pendingCount : string = '';
  legalPendingCount : string = '';
  indiFailedCount : string = '';
  legFailedCount : string = '';
  indiDeletedRecord : string = '';
  legDeletedRecord : string = '';
  indiLapsedRecord : string = '';
  legLapsedRecord : string = '';
  indiPendingApproval : string = '';
  legPendingApproval : string = '';
 
  private typingTimer: any;
  alertMessage: string | null = null;
  alertType: string = ''; // 'success' or 'danger'
  autoCloseTimeout: any;


  constructor(private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit(){
    //debugger
    this.bankName = localStorage.getItem('bankName') || '';
    this.bankCode = localStorage.getItem('bankCode') || '';
    this.branchCode = localStorage.getItem('branchCode') || '';
    //this.userRole = localStorage.getItem('userRole') || '';
    //this.userName = localStorage.getItem('userName') || '';
    console.log("Bank Name:", this.bankName);
    this.getDashboard();
  }


  getDashboard() {
    //debugger

    const token = localStorage.getItem('authToken');
    //Assign token to request body
    this.dashbaordData = {
      token: token || ''
    };
    console.log("Dashboard Request ==>",this.dashbaordData );
    this.authService.getDashobard(this.dashbaordData).subscribe(
      (response: any) => {
        console.log("Dashboard Response ==>",response);
        if (response.errorCode === 0) {
        const dashboardData = JSON.parse(response.data);
        this.lastLogin = response.lastLogin;
        this.roleName = dashboardData.RoleName;
        this.userName = dashboardData.UserName;
        this.pendingCount = dashboardData.IndvPendingNew || 0;
        this.legalPendingCount = dashboardData.LePendingNew || 0;
        this.indiFailedCount = response.indiCount.failedRecord || 0;
        this.legFailedCount = response.legalCount.legalfailedRecord || 0;
        this.indiDeletedRecord = response.indiCount.deletedRecord || 0;
        this.legDeletedRecord = response.legalCount.legaldeletedRecord || 0;
        this.indiLapsedRecord = response.indiCount.lapsedRecord || 0;
        this.legLapsedRecord = response.legalCount.legallapsedRecord || 0;
        this.indiPendingApproval = dashboardData.IndvPendingApproval;
        this.legPendingApproval = dashboardData.LePendingApproval;
       




        } else if (response.errorCode === 1) {
          this.alertService.danger(response.message, true, 3000);
        }
      },
      (error) => {
        this.alertService.danger('Failed to call API', true, 3000);
      }
    );
  }

}
