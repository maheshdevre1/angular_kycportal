import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type AlertType = 'success' | 'danger' | 'info' | 'warning';

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  autoClose?: boolean;
  timeout?: number; // ms
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private alertsSubject = new Subject<Alert | { clear: true }>();
  alerts$ = this.alertsSubject.asObservable();

  private idCounter = 0;
  private makeId() {
    this.idCounter++;
    return `alert-${Date.now()}-${this.idCounter}`;
  }

  show(message: string, type: AlertType = 'info', autoClose = true, timeout = 3000) {
    const alert: Alert = {
      id: this.makeId(),
      type,
      message,
      autoClose,
      timeout
    };
    this.alertsSubject.next(alert);
    return alert.id;
  }

  success(msg: string, autoClose = true, timeout = 3000) {
    return this.show(msg, 'success', autoClose, timeout);
  }
  danger(msg: string, autoClose = true, timeout = 3000) {
    return this.show(msg, 'danger', autoClose, timeout);
  }
  info(msg: string, autoClose = true, timeout = 3000) {
    return this.show(msg, 'info', autoClose, timeout);
  }
  warning(msg: string, autoClose = true, timeout = 3000) {
    return this.show(msg, 'warning', autoClose, timeout);
  }

  // request to clear all alerts (optional)
  clearAll() {
    this.alertsSubject.next({ clear: true });
  }
}
