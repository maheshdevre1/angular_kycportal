import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

 constructor(private http: HttpClient) { }
 
   //export  api call
   public exportDownload(response: any) {
        return this.http.post(`${baseUrl}/zipDownload`, response, {
           responseType: 'blob',  // ⬅⬅ KEY change
           observe: 'response'
           
        });
   }

   //view report api call
  public viewReport(response: any) {
    return this.http.post(`${baseUrl}/summaryDetails`, response);
  }




}
