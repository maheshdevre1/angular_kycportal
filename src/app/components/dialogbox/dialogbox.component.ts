import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialogbox',
  templateUrl: './dialogbox.component.html',
  styleUrls: ['./dialogbox.component.css']
})
export class DialogboxComponent {
  constructor(public dialogRef: MatDialogRef<DialogboxComponent>,
              public router: Router
  ) { }

  onCancel() {
    this.dialogRef.close('cancel');
  }

  onLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('bankCode');
    localStorage.removeItem('bankName');
    localStorage.removeItem('branchCode');
    localStorage.removeItem('branches');
    localStorage.removeItem('userRole');
    this.dialogRef.close('logout');
    this.router.navigate(['/login']);
  }

}
