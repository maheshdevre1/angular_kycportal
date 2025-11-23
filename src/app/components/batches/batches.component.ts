import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { BatchesService } from 'src/app/services/batches.service';
import { BatchesRequest } from 'src/app/services/model';


@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.css']
})
export class BatchesComponent implements OnInit {

  batchesData = {} as BatchesRequest;
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private alertService: AlertService,
    private router: Router,
    private batchesService: BatchesService
  ) { }

  ngOnInit(): void {
    this.loadAllData();
  }

  // Code for custom search started
   private handleBatchesResponse(response: any, pageIndex: number, pageSize: number) {
    this.batchesList = response.response?.data || [];
    this.originalBatchesList = JSON.parse(JSON.stringify(this.batchesList));
    this.totalBatchesCount = response.response?.count || 0;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
  }


  onCustomSearch() {
    if (this.customSearchDebounceTimer) {
      clearTimeout(this.customSearchDebounceTimer);
    }

    this.customSearchDebounceTimer = setTimeout(() => {
      this.applyCustomSearch();
    }, this.CUSTOM_SEARCH_DEBOUNCE_MS);
  }

  applyCustomSearch() {
    const q = (this.customSearchText || '').trim().toLowerCase();
    if (!q) {
      this.batchesList = JSON.parse(JSON.stringify(this.originalBatchesList));
      this.resetPaginatorIfNeeded();
      return;
    }
    const searchFields = ['batch', 'zipFiles', 'batchType', 'createdOn'];
    const matches: any[] = [];
    const nonMatches: any[] = [];

    for (const row of this.originalBatchesList) {
      let isMatch = false;
      for (const field of searchFields) {
        const val = (row[field] ?? '').toString().toLowerCase();
        if (val.includes(q)) {
          isMatch = true;
          break;
        }
      }
      if (isMatch) matches.push(row);
      else nonMatches.push(row);
    }

    // Put matches on top, non-matches below
    this.batchesList = [...matches, ...nonMatches];

    // If you want exact ordering inside matches (e.g., sort by best match),
    // you can apply further sort logic here.

    // Reset paginator to first page when showing filtered results (if paginator visible)
    this.resetPaginatorIfNeeded();
  }


  // Utility: if paginator is visible (All Data), set to first page so matches are visible
  private resetPaginatorIfNeeded() {
    // only reset when showing All Data (your condition for showing paginator)
    if (this.selectedOption === 'All Data' && this.paginator) {
      // set component pageIndex to zero and visually reset paginator
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


  onPageChange(event: PageEvent) {
    if (this.selectedOption === 'Batch Number') {
      this.batches('1', event.pageIndex, event.pageSize, 0, this.batchNo || '');
    } else {
      this.batches('2', event.pageIndex, event.pageSize, 5, '');
    }
  }
}
