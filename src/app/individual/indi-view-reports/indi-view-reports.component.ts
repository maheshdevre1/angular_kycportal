import { Component, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { ExportService } from 'src/app/services/export.service';
import { BranchInfo, ViewReportRequest } from 'src/app/services/model';

@Component({
  selector: 'app-indi-view-reports',
  templateUrl: './indi-view-reports.component.html',
  styleUrls: ['./indi-view-reports.component.css']
})
export class IndiViewReportsComponent {
  @ViewChild('branchSelect') branchSelect!: MatSelect;

  viewReportRequest = {} as ViewReportRequest;
  selectedCount: number = 0;
  branchList: { code: string; name: string }[] = [];
  selectedBranches: { code: string; name: string }[] = [];
  tableData: any[] = [];
  totalCount = 0;
  activeType: string = 'A'; 
  pageIndex = 0;
  pageSize = 5;
  searchText: string = '';
  filteredBranchList: any[] = [];
  customSearchText: string = '';
  private customSearchDebounceTimer: any = null;
  private CUSTOM_SEARCH_DEBOUNCE_MS = 250;

  // track if a tab was clicked (auto-select + auto-fetch) at least once
  private tabAutoFetched: Record<string, boolean> = {};

  tabs: { label: string; type: string }[] = [
    { label: 'Branch Summary', type: 'A' },   
    { label: 'Progressive Summary', type: 'C' },
    { label: 'Deleted CIF', type: 'E' },
    { label: 'Restored CIF', type: 'G' },
    { label: 'Pending CIF', type: 'I' },
    { label: 'Failed CIF', type: 'J' }
  ];


  constructor(
    private alertService: AlertService,
    private router: Router,
    private exportService: ExportService
  ) { }



  ngOnInit() {
    //debugger
    this.activeType = 'A';
    this.filteredBranchList = this.branchList;
    const branches = JSON.parse(localStorage.getItem("branches") || "[]");
    this.branchList = branches;
    this.selectedBranches = branches.slice();
    this.selectedCount = this.selectedBranches.length;
    this.tabs.forEach(t => (this.tabAutoFetched[t.type] = false));
    setTimeout(() => {
      this.selectTab(this.tabs[0]);
    });
  }


//filter branches
filterBranches() {
  debugger
  const text = this.searchText.toLowerCase();

  this.filteredBranchList = this.branchList.filter(b =>
    b.name.toLowerCase().includes(text) ||
    b.code.toLowerCase().includes(text)
  );
}

  // Called when user clicks Search button (resets to first page)
onSearchClick() {
  this.pageIndex = 0;        // reset to first page
  this.viewreport(this.pageIndex, this.pageSize);
}

  // called when a tab is clicked
  selectTab(tab: { label: string; type: string }) {
    this.activeType = tab.type;
    // if this tab wasn't auto-fetched before, auto-select all branches and call viewreport()
    if (!this.tabAutoFetched[tab.type]) {
      // mark it so we don't auto-fetch again for this tab
      // this.tabAutoFetched[tab.type] = true;
      // // select all branches in the UI and update internal selectedBranches
      this.selectAllBranches();
      // call viewreport immediately with auto-selected branches
      this.viewreport(this.pageIndex, this.pageSize);
    }
}

  // select all branches programmatically and update local selection state
  selectAllBranches() {
    // if branchSelect is available (ViewChild), use it to select mat-option items
    if (this.branchSelect && this.branchSelect.options) {
      this.branchSelect.options.forEach(opt => opt.select());
    }
    // ensure internal model mirrors selection (defensive: clone array)
    this.selectedBranches = this.branchList.slice();
    this.selectedCount = this.selectedBranches.length;
  }

  // safe trackBy for ngFor
  trackByFn(index: number, item: any): any {
    return item?.branchCode ?? index;
  }

  isSelected(branch: any): boolean {
    return this.selectedBranches.some(b => b.code === branch.name);
  }

  // returns true when all are selected
  isAllSelected(): boolean {
    return this.selectedBranches.length === this.branchList.length && this.branchList.length > 0;
  }

  // toggle select/deselect all
  toggleAllSelection() {
    if (this.isAllSelected()) {
      // clear selection
      this.branchSelect.options.forEach(opt => opt.deselect());
      this.selectedBranches = [];
    } else {
      // select all
      this.branchSelect.options.forEach(opt => opt.select());
      // mat-select will emit selectionChange; but to be safe:
      this.selectedBranches = this.branchList.slice();
    }
    this.selectedCount = this.selectedBranches.length;
  }

 // selectionChange handler (user manual selection)
  onSelectChange(event: any) {
    this.selectedBranches = event?.value ?? [];
    this.selectedCount = this.selectedBranches.length;
  }

  // Map selected branches to backend format { branchId, branchName }
  private buildBranchInfo(): BranchInfo[] {
    return this.selectedBranches.map(b => ({
      branchId: b.code,
      branchName: b.name
    }));
  }



  // Called when user clicks "Branch Summary" button
  viewreport(pageIndex: number, pageSize: number) {
    //debugger
    const token = localStorage.getItem('authToken') || '';

    this.viewReportRequest = {
      token,
      start: pageIndex,
      length: pageSize,
      type: this.activeType,
      branchInfo: this.buildBranchInfo()
    };

    console.log('View Report Request', this.viewReportRequest);

    this.exportService.viewReport(this.viewReportRequest).subscribe(
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
        }
      },
      (error) => {
        this.alertService.danger('Failed to call API', true, 3000);
      }
    );
  }


   // paginator change event
onPageChange(event: PageEvent) {
  this.pageIndex = event.pageIndex;
  this.pageSize = event.pageSize;
  this.viewreport(this.pageIndex, this.pageSize);
}


// Code for custom search started
  onCustomSearch() {
    debugger
    console.log('onCustomSearch fired, customSearchText=', this.customSearchText);

    if (this.customSearchDebounceTimer) {
      clearTimeout(this.customSearchDebounceTimer);
    }

    this.customSearchDebounceTimer = setTimeout(() => {
      this.applyCustomSearch();
    }, this.CUSTOM_SEARCH_DEBOUNCE_MS);
  }

  applyCustomSearch() {
    debugger
    const q = (this.customSearchText || '').trim().toLowerCase();
    console.log('Normalized query q =', q);
    if (!q) {
      this.branchList = JSON.parse(JSON.stringify(this.branchList));
     // this.resetPaginatorIfNeeded();
      return;
    }
    const searchFields = ['code', 'name'];
    const matches: any[] = [];
    if (!this.branchList || this.branchList.length === 0) {
      console.warn('No data available to search (originalBatchesList is empty).');
      return;
    }
    for (const row of this.branchList) {
      const rowText = JSON.stringify(row).toLowerCase();
      if (rowText.includes(q)) {
        matches.push(row);
      }
    }

    if (matches.length > 0) {
      this.branchList = JSON.parse(JSON.stringify(matches));
      console.log('Matches found:', matches.length);
    } else {
      this.branchList = JSON.parse(JSON.stringify(this.branchList || []));
      console.log('No matches -> restored full list');
    }
   // this.resetPaginatorIfNeeded();
  }

  // Code for custom search ended

  
  


}
