import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class BatchesService {

  
  constructor(private http: HttpClient) {}

  //batches  api call
  public batches(response: any) {
    return this.http.post(`${baseUrl}/batches`, response);
  }
}
