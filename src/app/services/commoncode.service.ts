import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class CommoncodeService {

  constructor(private messageService: MessageService) { }

  // Notification methods
  showSuccess(msg: any) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
  }

  showError(msg: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

  showWarn(msg: any) {
    this.messageService.add({ severity: 'warn', summary: 'Warning', detail: msg });
  }

  showInfo(msg: any) {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: msg });
  }
}
