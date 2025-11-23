import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonRequest } from 'src/app/services/model';
import { SidenavService } from 'src/app/services/sidenav.service';
import { DialogboxComponent } from '../dialogbox/dialogbox.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  dashbaordData = {} as CommonRequest;
  bankName: string = '';
  userName: string = '';
  userRole: string = '';

  constructor(private sidenav: SidenavService,
    private authService: AuthService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private router: Router
  ) { }


 // readonly dialog = inject(MatDialog);

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    //debugger
    const dialogRef = this.dialog.open(DialogboxComponent, {
      width: '300px',
      enterAnimationDuration,
      exitAnimationDuration
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'logout') {
        this.logout();
      }
    });
  }

  ngOnInit() {
    this.bankName = localStorage.getItem('bankName') || '';
    const role = localStorage.getItem('userRole') || '';
    switch (role) {
      case '1':
        this.userRole = 'ADMIN';
        break;
      case '40':
        this.userRole = 'CHECKER';
        break;
      case '50':
        this.userRole = 'MAKER';
        break;
      case '3':
        this.userRole = 'CPC CHECKER';
        break;
      case '4':
        this.userRole = 'CPC MAKER';
        break;
      default:
        this.userRole = 'UNKNOWN ROLE';
    }

  }


  toggleSidenav() {
    this.sidenav.toggle();
  }


  logout() {
    //debugger
    const token = localStorage.getItem('authToken');
    this.dashbaordData = {
      token: token || ''
    };
    console.log("Logout Request==>",  this.dashbaordData);
    this.authService.getLogout(this.dashbaordData).subscribe(
      (response: any) => {
        console.log("Logout Response==>", response);
        if (response.errorCode === 0) {
          localStorage.removeItem('authToken');
          this.router.navigate(['/login']);
           //this.alertService.success(response.message, true, 3000);
        } else if (response.errorCode === 2) {
          //this.alertService.danger(response.message, true, 3000);
        }else if (response.errorCode === 1) {
          //this.alertService.danger(response.message, true, 3000);
        }
      },
      (error) => {
        this.alertService.danger('Failed to call API', true, 3000);
      }
    );
  }



}
