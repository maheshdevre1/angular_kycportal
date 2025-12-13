import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class LapsedService {

  constructor(private http: HttpClient) { }


  //lapsed record api call
  public lapsedRecord(request: any) {
    return this.http.post(`${baseUrl}/lapsedRecords`, request);
  }

  //reprocess lapsed record
  public reprocessLapsedRecord(request: any) {
    return this.http.post(`${baseUrl}/reprocessedLapsed`, request);
  }
}
