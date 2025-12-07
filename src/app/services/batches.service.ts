import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BatchesService {


  constructor(private http: HttpClient) { }

  //batches  api call
  public batches(response: any) {
    return this.http.post(`${baseUrl}/batches`, response);
  }

  //download batch file api
  public downloadBatch(response: any) {
    return this.http.post(`${baseUrl}/downloadBatch`, response);
  }

  //date update
  public batchesDateUpdate(response: any) {
    return this.http.post(`${baseUrl}/batchesDateUpdate`, response);
  }

  //upload response stage 1 file
  uploadResponseStage1(file: File, token: string, type: string): Observable<any> {
    const response = new FormData();
    response.append('file', file, file.name);
    response.append('token', token);
    response.append('type', type);
    return this.http.post(`${baseUrl}/responseStage1Upload`, response);
  }


}
