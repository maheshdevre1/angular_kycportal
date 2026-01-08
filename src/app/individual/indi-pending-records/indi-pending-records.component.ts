import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/services/alert.service';
import { PendingRecordRequest } from 'src/app/services/model';
import { PendingRecordService } from 'src/app/services/pending-record.service';

@Component({
  selector: 'app-indi-pending-records',
  templateUrl: './indi-pending-records.component.html',
  styleUrls: ['./indi-pending-records.component.css'],

})
export class IndiPendingRecordsComponent {


  pendingRecordRequest = {} as PendingRecordRequest;
  batchesList: any[] = [];
  totalBatchesCount: number = 0;
  selectedType = '';

  startedDate = '';
  endedDate = '';
  pageIndex = 0;
  pageSize = 5;
  selectedFilter = 'All Data';
  customerId: string = '';
  customSearchText: string = '';
  selectAll: boolean = false;
  tableData: any[] = [];

  selectedOption: string = 'Select Category';
  selectedType1: string = 'Select Type';
  action: string = '';
  selectedAction: string = '';
  startDate!: NgbDateStruct;
  endDate!: NgbDateStruct;
  startDateStr!: string;
  endDateStr!: string;






  constructor(
    private alertService: AlertService,
    private router: Router,
    private pendingRecordService: PendingRecordService
  ) { }

  ngOnInit() {
    const today = new Date();
    this.endDate = this.toStruct(today);
    this.startDate = this.toStruct(this.addDays(today, -3));
    this.startDateStr = this.toDateString(this.startDate);
    this.endDateStr = this.toDateString(this.endDate);
  }


  // fetch start date and end ended ==>   started



  toDateString(d: NgbDateStruct): string {
    const year = d.year;
    const month = String(d.month).padStart(2, '0');
    const day = String(d.day).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onEndChange(date: NgbDateStruct) {
    this.endDate = date;
    this.startDate = this.toStruct(this.addDays(this.toDate(date), -3));

    this.startDateStr = this.toDateString(this.startDate);
    this.endDateStr = this.toDateString(this.endDate);
  }

  onStartChange(date: NgbDateStruct) {
    this.startDate = date;
    this.endDate = this.toStruct(this.addDays(this.toDate(date), 3));

    this.startDateStr = this.toDateString(this.startDate);
    this.endDateStr = this.toDateString(this.endDate);
  }

  /* helpers */
  toStruct(d: Date): NgbDateStruct {
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
  }

  toDate(d: NgbDateStruct): Date {
    return new Date(d.year, d.month - 1, d.day);
  }

  addDays(d: Date, days: number): Date {
    const r = new Date(d);
    r.setDate(r.getDate() + days);
    return r;
  }

  // fetch start date and end ended ==>   ended


  //function for pending records http://localhost:8084/pendingRecords started
  searchByCustomerId() {
    if (this.customerId && this.customerId.trim() !== '') {
      this.selectedType = '1';
    } else if(this.action === 'all') {
      this.selectedType = '2';
      this.action = 'all';
    }else if(this.action === 'amend') {
      this.selectedType = '2';
      this.action = 'amend';
    }else if(this.action === 'decline'){
      this.selectedType = '2';
      this.action = 'decline';
    }
    this.pageIndex = 0;
    this.pendingReords(this.selectedType, this.pageIndex, this.pageSize, 0, this.customerId.trim(), this.action, this.startDateStr, this.endDateStr);

  }

  pendingReords(typeValue: string, pageIndex: number, pageSize: number,
    pageType: number, searchId: string, action: string, startDateStr: string, endDateStr: string) {
    //debugger
    const token = localStorage.getItem('authToken');
    this.pendingRecordRequest = {
      type: typeValue,
      searchId: searchId,
      token: token || '',
      action: action,
      startDate: startDateStr,
      endDate: endDateStr,
      start: pageIndex,
      length: pageSize,

    };
    console.log('Pending Record Request', this.pendingRecordRequest);
    this.pendingRecordService.pendingRecord(this.pendingRecordRequest).subscribe(

      (response: any) => {
        console.log('Pending Record Response', response);
        if (response.errorCode === 0) {
          this.tableData = response.response?.data || [];
          //this.originalBatchesList = response.response?.data || [];
          this.totalBatchesCount = response.response?.count || 0;
          this.pageIndex = pageIndex;
          this.pageSize = pageSize;

        } else if (response.errorCode === 1) {
          this.alertService.danger(response.message, true, 3000);
        } else if (response.errorCode === 2) {
          this.alertService.danger(response.message, true, 3000);
          this.router.navigate(['/login']);
        }
      },
      (error) => {
        this.alertService.danger('Failed to call API', true, 3000);
      }
    );
  }

  //function for pending records http://localhost:8084/pendingRecords ended




  selectOption(action: string) {
    this.selectedOption = action;
    this.customerId = '';
    // this.pageIndex = 0n
    if (action === 'all') {
      // this.loadAllData();
      this.selectedType = '2';
      this.selectedType1 = action;
      // this.pendingReords(this.selectedType, this.pageIndex, this.pageSize, 0, this.customerId.trim(), this.action, this.startDateStr, this.endDateStr);

    } else {
      this.selectedType = '1';
      this.totalBatchesCount = 0;
      this.batchesList = [];
    }
  }

  selectOptionType(type: string) {

    this.action = type;
    this.customerId = '';

    if (this.action === 'all') {

      this.selectedType = '2';
      this.selectedType1 = 'All';

    } else if (this.action === 'amend') {
      this.selectedType = '2';
      this.selectedType1 = 'Amend';
    }else if(this.action === 'decline'){
      this.selectedType = '2';
      this.selectedType1 = 'Decline';
    }

    }
  








  onCustomSearch() {

  }

  openFile(type: number) { }

  onFileSelected(event: Event) { }

  toggleSelectAll() { }

  checkIfAllSelected() { }

}
