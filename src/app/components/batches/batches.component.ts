import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { BatchesService } from 'src/app/services/batches.service';
import { BatchesRequest, DownlodBatchRequest } from 'src/app/services/model';


@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.css']
})
export class BatchesComponent implements OnInit {

  batchesData = {} as BatchesRequest;
  downloadbatchRequest = {} as DownlodBatchRequest;
  alertMessage: string | null = null;
  alertType: string = '';
  batchesList: any[] = [];
  totalBatchesCount: number = 0;
  selectedType = '2';
  pageIndex = 0;
  pageSize = 5;
  selectedFilter = 'All Data';
  batchNo: string = '';
  private originalBatchesList: any[] = [];
  customSearchText: string = '';
  private customSearchDebounceTimer: any = null;
  private CUSTOM_SEARCH_DEBOUNCE_MS = 250;
  //selectedFile?: File;
  uploadProgress = 0;
  uploading = false;
  serverResponse: any = null;
  uploadType: string = '1';   // default
selectedFile: File | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
   @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;


  constructor(
    private alertService: AlertService,
    private router: Router,
    private batchesService: BatchesService
  ) { }

  ngOnInit(): void {
    this.loadAllData();
  }

  //started - code for file upload
  openFile(type: number) {
    this.uploadType = String(type);
    this.fileInput.nativeElement.click();
    //this.onFileSelected();
  }
  onFileSelected(event: Event) {
    debugger
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      this.selectedFile = undefined;
      return;
    }
    this.selectedFile = input.files[0];
    this.serverResponse = null;
    this.uploadSelected();
  }

  uploadSelected() {
    debugger
    if (!this.selectedFile) {
      alert('Please select a file first.');
      return;
    }
    const token = localStorage.getItem('authToken') || '';
    //const type = '1'; // or whatever type you want to send
    const type = this.uploadType; 
    this.uploading = true;
    this.uploadProgress = 0;
    this.batchesService.uploadResponseStage1(this.selectedFile, token, type).subscribe(
      (response: any) => {
        console.log("Dashboard Response ==>", response);
        if (response.errorCode === 0) {
          this.alertService.success(response.message, true, 3000);
        } else if (response.errorCode === 1) {
          this.alertService.danger(response.message, true, 3000);
        }
      },
      (error) => {
        this.alertService.danger('Failed to call API', true, 3000);
      }
    );
  }


  // Code for custom search started
  onCustomSearch() {
    //debugger
    console.log('onCustomSearch fired, customSearchText=', this.customSearchText);

    if (this.customSearchDebounceTimer) {
      clearTimeout(this.customSearchDebounceTimer);
    }

    this.customSearchDebounceTimer = setTimeout(() => {
      this.applyCustomSearch();
    }, this.CUSTOM_SEARCH_DEBOUNCE_MS);
  }

  applyCustomSearch() {
    const q = (this.customSearchText || '').trim().toLowerCase();
    console.log('Normalized query q =', q);
    if (!q) {
      this.batchesList = JSON.parse(JSON.stringify(this.originalBatchesList));
      this.resetPaginatorIfNeeded();
      return;
    }
    const searchFields = ['batch', 'zipFiles', 'batchType', 'createdOn'];
    const matches: any[] = [];
    if (!this.originalBatchesList || this.originalBatchesList.length === 0) {
      console.warn('No data available to search (originalBatchesList is empty).');
      return;
    }
    for (const row of this.originalBatchesList) {
      const rowText = JSON.stringify(row).toLowerCase();
      if (rowText.includes(q)) {
        matches.push(row);
      }
    }

    if (matches.length > 0) {
      this.batchesList = JSON.parse(JSON.stringify(matches));
      console.log('Matches found:', matches.length);
    } else {
      this.batchesList = JSON.parse(JSON.stringify(this.originalBatchesList || []));
      console.log('No matches -> restored full list');
    }
    this.resetPaginatorIfNeeded();
  }

  private resetPaginatorIfNeeded() {
    //debugger
    if (this.selectedOption === 'All Data' && this.paginator) {
      this.pageIndex = 0;
      try { this.paginator.firstPage(); } catch (e) { /* safe fallback */ }
    }
  }
  // Code for custom search ended

  selectedOption: string = 'All Data';
  selectOption(value: string) {
    this.selectedOption = value;
    this.batchNo = '';
    this.pageIndex = 0;
    if (value === 'All Data') {
      this.loadAllData();
    } else {
      this.selectedType = '1';
      this.totalBatchesCount = 0;
      this.batchesList = [];
    }
  }

  loadAllData() {
    this.selectedType = '2';
    this.pageIndex = 0;
    this.pageSize = 5;
    this.batches(this.selectedType, this.pageIndex, this.pageSize, 5, '');
  }

  searchByBatch() {
    if (!this.batchNo || this.batchNo.trim() === '') {
      this.alertService.danger('Please enter batch number', true, 3000);
      return;
    }
    this.selectedType = '1';
    this.pageIndex = 0;
    this.batches(this.selectedType, this.pageIndex, this.pageSize, 0, this.batchNo.trim());
  }

  //batches function
  batches(typeValue: string, pageIndex: number, pageSize: number, pageType: number, batchId: string) {
    //debugger
    const token = localStorage.getItem('authToken');
    this.batchesData = {
      token: token || '',
      start: pageIndex,
      length: pageSize,
      type: typeValue,
      batchId: batchId
    };
    console.log('Batches Request', this.batchesData);
    this.batchesService.batches(this.batchesData).subscribe(

      (response: any) => {
        console.log('Batches Response', response);
        if (response.errorCode === 0) {
          this.batchesList = response.response?.data || [];
          this.originalBatchesList = response.response?.data || [];
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

  //download Batch
  downloadBatch(batchId: string) {
    //debugger
    const token = localStorage.getItem('authToken');

    const requestBody = {
      token: token || '',
      batchId: batchId
    };

    this.batchesService.downloadBatch(requestBody).subscribe(
      (response: any) => {
        console.log("Download Batch Response:", response);

        if (response.errorCode === 0) {
          const headers = response.response.headers;
          const body = response.response.body; // Base64 ZIP string
          // 1. Extract filename from Content-Disposition
          const contentDisposition = headers["Content-Disposition"][0];
          const filename = contentDisposition.split("filename=")[1].replace(/"/g, "");
          // 2. Decode Base64 → binary data
          const byteCharacters = atob(body);
          const byteNumbers = new Array(byteCharacters.length)
            .fill(0)
            .map((_, i) => byteCharacters.charCodeAt(i));
          const byteArray = new Uint8Array(byteNumbers);
          // 3. Convert to Blob
          const blob = new Blob([byteArray], { type: "application/zip" });
          // 4. Trigger download
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;
          link.click();
          window.URL.revokeObjectURL(link.href);
        }
        else if (response.errorCode === 4) {
          this.alertService.danger(response.message, true, 3000);
        } else if (response.errorCode === 1) {
          this.alertService.danger(response.message, true, 3000);
        }

      },
      () => {
        this.alertService.danger("API Error - Unable to download", true, 3000);
      }
    );
  }

  //batch date update
    batchesDateUpdate(batchId: string) {
    debugger
    const token = localStorage.getItem('authToken');

    const requestBody = {
      token: token || '',
      batchId: batchId
    };

    this.batchesService.batchesDateUpdate(requestBody).subscribe(
      (response: any) => {
        console.log("Download Batch Response:", response);

        if (response.errorCode === 0) {
          this.alertService.success(response.message, true, 3000);
        }
        else if (response.errorCode === 1) {
          this.alertService.danger(response.message, true, 3000);
        } else if (response.errorCode === 2) {
          this.alertService.danger(response.message, true, 3000);
          this.router.navigate(['/login']);
        }

      },
      () => {
        this.alertService.danger("Failed to call API", true, 3000);
      }
    );
  }


  onPageChange(event: PageEvent) {
    if (this.selectedOption === 'Batch Number') {
      this.batches('1', event.pageIndex, event.pageSize, 0, this.batchNo || '');
    } else {
      this.batches('2', event.pageIndex, event.pageSize, 5, '');
    }
  }
}
