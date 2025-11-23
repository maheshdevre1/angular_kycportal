import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidenavService {
  // private _open$ = new BehaviorSubject<boolean>(false);
  // open$ = this._open$.asObservable();

  // toggle() {
  //   this._open$.next(!this._open$.value);
  // }
  // open() {
  //   this._open$.next(true);
  // }
  // close() {
  //   this._open$.next(false);
  // }


  private openSubject = new BehaviorSubject<boolean>(false);
  open$ = this.openSubject.asObservable();

  open() { this.openSubject.next(true); }
  close(){ this.openSubject.next(false); }
  toggle(){ this.openSubject.next(!this.openSubject.value); } // convenience
  setOpen(v: boolean){ this.openSubject.next(v); }
}
