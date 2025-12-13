import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { LapsedService } from 'src/app/services/lapsed.service';
import { LapsedRecordRequest, ReprocessLapsedRequest } from 'src/app/services/model';
import { finalize } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-indi-lapsed',
  templateUrl: './indi-lapsed.component.html',
  styleUrls: ['./indi-lapsed.component.css']
})
export class IndiLapsedComponent {

  lapsedRecordRequest = {} as LapsedRecordRequest;
  reprocessLapsedRequest = {} as ReprocessLapsedRequest;
  userRole: string = '';
  token: string = '';
  isLoading = false;
  totalCount = 0;
  tableData: any[] = [];
  pageIndex = 0;
  pageSize = 5;
  selectAll: boolean = false;
  selectedFilter = 'All Data';
  cifList: any[] = [];
  customerId: string = '';
  rowId: string = '';
  selectedType = '3';
  selectedRows: { rowId: number; customerID: string }[] = [];



  constructor(
    private alertService: AlertService,
    private router: Router,
    private lapsedService: LapsedService
  ) { }



  ngOnInit() {
    //debugger
    this.userRole = localStorage.getItem('userRole') || '';
    this.lapsedDetails(this.selectedType, this.pageIndex, this.pageSize, this.rowId, this.customerId);


  }


  // paginator change event
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.lapsedDetails(this.selectedType, this.pageIndex, this.pageSize, this.rowId, this.customerId);
  }


  selectedOption: string = 'All Data';
  selectOption(value: string) {
    this.selectedOption = value;
    this.customerId = '';
    this.pageIndex = 0;
    if (value === 'All Data') {
      this.loadAllData();
    } else {

      this.selectedType = '1';
      this.totalCount = 0;
      this.cifList = [];
    }
  }


  loadAllData() {
    this.selectedType = '3';
    this.pageIndex = 0;
    this.pageSize = 5;
    this.lapsedDetails(this.selectedType, this.pageIndex, this.pageSize, this.rowId, this.customerId);
  }


  searchByCustomerId() {
    if (!this.customerId || this.customerId.trim() === '') {
      this.alertService.danger('Please enter Customer Id', true, 3000);
      return;
    }
    this.selectedType = '1';
    this.pageIndex = 0;
    this.lapsedDetails(this.selectedType, this.pageIndex, this.pageSize, this.rowId, this.customerId.trim());
  }

  //lapsed record function strated
  lapsedDetails(selectedType: string, pageIndex: number, pageSize: number, rowld: string, customerId: string) {
    //debugger
    const token = localStorage.getItem('authToken') || '';


    this.lapsedRecordRequest = {
      searchId: customerId,
      rowId: rowld,
      type: selectedType,
      token: token,
      start: pageIndex,
      length: pageSize
    };

    console.log('Lapsed Record Request', this.lapsedRecordRequest);

    this.isLoading = true;

    this.lapsedService.lapsedRecord(this.lapsedRecordRequest)
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe(
        (response: any) => {
          console.log('View Report Response', response);
          if (response.errorCode === 0) {
            this.totalCount = response.response?.totalCount ?? 0;
            this.tableData = response.response?.data ?? [];
          } else if (response.errorCode === 1) {
            this.tableData = [];  // ✅ Clear table data
            this.totalCount = 0;  // (Optional) reset count
            this.alertService.danger(response.message, true, 3000);
          } else if (response.errorCode === 2) {
            this.alertService.danger(response.message, true, 3000);
            this.router.navigate(['/login']);
          } else if (response.errorCode === 500) {
            this.alertService.danger(response.message, true, 3000);
          }
        },
        (error: HttpErrorResponse) => {
          //this.alertService.danger('Failed to call API', true, 3000);

          const serverMessage = error.error && (error.error.message || error.error?.response?.message);

          if (serverMessage) {
            this.alertService.danger(serverMessage, true, 5000);
          } else if (error.status === 0) {
            // network / CORS / unreachable
            this.alertService.danger('Network error: please check your connection or CORS policy', true, 5000);
          } else {
            // Fallback message includes status code for debugging
            this.alertService.danger(`Failed to call API (status ${error.status}).`, true, 5000);
          }
        }
      );
  }
  //lapsed record function ended


  //reprocess lapsed recor started
  reprocessLapsedRecord() {
    const token = localStorage.getItem('authToken') || '';
    this.reprocessLapsedRequest = {
      token: token,
      listOfCustomerId: this.getSelectedRows()
    };

    console.log('ReprocessLapsed Record Request', this.reprocessLapsedRequest);

    this.isLoading = true;

    this.lapsedService.reprocessLapsedRecord(this.reprocessLapsedRequest)
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe(
        (response: any) => {
          console.log('View Report Response', response);
          if (response.errorCode === 0) {
            this.lapsedDetails(this.selectedType, this.pageIndex, this.pageSize, this.rowId, this.customerId);
           this.alertService.success(response.message, true, 3000);

          } else if (response.errorCode === 1) {
             this.alertService.danger(response.message, true, 3000);
          } else if (response.errorCode === 2) {
            this.alertService.danger(response.message, true, 3000);
            this.router.navigate(['/login']);
          }
        },
        (error: HttpErrorResponse) => {
         

          const serverMessage = error.error && (error.error.message || error.error?.response?.message);

          if (serverMessage) {
            this.alertService.danger(serverMessage, true, 5000);
          } else if (error.status === 0) {
            // network / CORS / unreachable
            this.alertService.danger('Network error: please check your connection or CORS policy', true, 5000);
          } else {
            // Fallback message includes status code for debugging
            this.alertService.danger(`Failed to call API (status ${error.status}).`, true, 5000);
          }
        }
      );
  }
//reprocess lapsed record ended


  //code for checkbax started
  toggleSelectAll() {
    this.tableData.forEach(item => {
      item.selected = this.selectAll;
    });
  }

  checkIfAllSelected() {
    this.selectAll = this.tableData.every(item => item.selected);
  }

  getSelectedRows() {
    return this.tableData
      .filter(item => item.selected)
      .map(item => ({
        rowId: item.rowId,
        customerID: item.customerID
      }));
  }
  //code for checkbox ended



}
