import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService, Alert } from '../services/alert.service';


interface DisplayAlert extends Alert {
  visible: boolean;
}

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  alerts: DisplayAlert[] = [];
  sub!: Subscription;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.sub = this.alertService.alerts$.subscribe(payload => {
      if ((payload as any).clear) {
        this.alerts = [];
        return;
      }
      const alert = payload as Alert;
      const display: DisplayAlert = { ...alert, visible: true };
      // push to top so newest appears first
      this.alerts.unshift(display);

      if (display.autoClose) {
        setTimeout(() => this.close(display.id), display.timeout ?? 2000);
      }
    });
  }

  close(id: string) {
    const idx = this.alerts.findIndex(a => a.id === id);
    if (idx !== -1) {
      // add fade out class then remove after animation
      this.alerts[idx].visible = false;
      setTimeout(() => {
        this.alerts = this.alerts.filter(a => a.id !== id);
      }, 300); // matches fade animation duration
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}