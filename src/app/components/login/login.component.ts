import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommoncodeService } from 'src/app/services/commoncode.service';
import { CommonstoreService } from 'src/app/services/commonstore.service';
import { CommunicationService } from 'src/app/services/communication.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { LoaderService } from 'src/app/services/loader.service';
import { LoginRequest } from 'src/app/services/model';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  loginData = {} as LoginRequest;

  bankCode: string = '';
  private typingTimer: any;
  alertMessage: string | null = null;
  alertType: string = ''; // 'success' or 'danger'
  autoCloseTimeout: any;


  constructor(private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) { }


  //login for generate token
  clickOnLogin() {
   // debugger
    console.log("Login Request ==>", this.loginData);
    this.authService.generateToken(this.loginData).subscribe(
      
      (response: any) => {
        console.log("Login Respone ==>", response);
        if (response.errorCode === 0) {
        // Store  in localStorage
        const token = response.response?.token;
        const userRole = response.response?.role;
        const branchCode = response.response?.branch;
        if (token) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('userRole',userRole);
          localStorage.setItem('branchCode',branchCode);
         
        }
          //this.alertService.success(response.message, true, 3000);
          this.router.navigate(['/dashboard']);
        } else if (response.errorCode === 1) {
          this.alertService.danger(response.message, true, 3000);
        }
      },
      (error) => {
        this.alertService.danger('Failed to call API', true, 3000);
      }
    );
  }



  submitBankCode() {
    //debugger
    // clear previous timer (if user keeps typing)
    clearTimeout(this.typingTimer);

    // start new timer
    this.typingTimer = setTimeout(() => {

      const bankCode = this.loginData?.bankCode;
      if (bankCode && bankCode.length >= 3) {  // optional: validate length
        this.authService.bankdetails(bankCode).subscribe(
          (response) => {
            console.log('Back Code Response ==>', response);
            //Store bank name in localstorage
            const bankName = response.response?.bankMasterName || '';
            const bankCode = response.response?.bankMasterShortName || '';

            if (response.errorCode === 0) {
              localStorage.setItem('bankName', bankName);
              localStorage.setItem('bankCode', bankCode);
              this.alertService.success(response.message, true, 3000);
            } else if (response.errorCode === 1) {
              this.alertService.danger(response.message, true, 3000);
            }

            // ✅ Auto-close after 2 seconds
            this.autoCloseTimeout = setTimeout(() => {
              this.alertMessage = null;
            }, 3000);

          },
          (error) => {
            this.alertService.danger('Failed to call API', true, 3000);
          }
        );
      }
    }, 1500); // waits 1 second after typing stops
  }


}
