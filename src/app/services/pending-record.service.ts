import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class PendingRecordService {

   constructor(private http: HttpClient) { }
  
    //pending record   api call
    public pendingRecord(request: any) {
      return this.http.post(`${baseUrl}/pendingRecords`, request);
    }

  
}
