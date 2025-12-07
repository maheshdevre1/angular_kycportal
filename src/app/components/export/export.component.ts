import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { ExportService } from 'src/app/services/export.service';
import { ExportRequest } from 'src/app/services/model';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent {

  exportRequest = {} as ExportRequest;


  constructor(private exportService: ExportService,
    private alertService: AlertService,
    private router: Router
  ) { }



  // null = all closed; otherwise 'individual' | 'legal' | 'admin'
  openPanel: string | null = null;

  toggle(panel: string) {
    this.openPanel = this.openPanel === panel ? null : panel;
  }

  // helper if you need in template
  isOpen(panel: string) {
    return this.openPanel === panel;
  }

  //function to downlaod export zip
  getExportReport(type : string) {
    //debugger;
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    this.exportRequest = {
      token: token || '',
      type: type
    };

    console.log("Export Request ==>", this.exportRequest);

    this.exportService.exportDownload(this.exportRequest).subscribe(
      (response: any) => {

        console.log("Export Response (raw) ==>", response);

        const contentType = response.headers.get('Content-Type') || response.headers.get('content-type');

        // Handle JSON errors
        if (contentType && contentType.includes('application/json')) {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const json = JSON.parse(reader.result as string);
              console.log("Parsed JSON response ==>", json);

              if (json.errorCode === 1) {
                this.alertService.danger(json.message, true, 3000);
              } else if (json.errorCode === 2) {
                this.alertService.danger(json.message, true, 3000);
                this.router.navigate(['/login']);
              }
            } catch {
              this.alertService.danger("Invalid error response", true, 3000);
            }
          };
          reader.readAsText(response.body);
          return;
        }

        // Extract filename from backend header
        const disposition = response.headers.get('Content-Disposition') || response.headers.get('content-disposition');
        let fileName = 'report.zip'; // fallback

        if (disposition) {
          const match = /filename=(.*?)(;|$)/i.exec(disposition);
          if (match && match[1]) {
            fileName = match[1].trim();
          }
        }

        // Download ZIP with actual filename
        const blob = new Blob([response.body], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName; 
        a.click();

        window.URL.revokeObjectURL(url);

        
      },
      (error) => {
        console.error("Download error", error);
        this.alertService.danger("Failed to call API", true, 3000);
      }
    );
  }


}



