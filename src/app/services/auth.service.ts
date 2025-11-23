import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  //check bank code exist or not
  public bankdetails(bankCode: string): Observable<any> {
    const url = `${baseUrl}/${bankCode}`;
    return this.http.post(url, null); // if backend doesn’t need a request body
  }

  //login  api call
  public generateToken(loginData: any) {
    return this.http.post(`${baseUrl}/login`, loginData);
  }

   //dashboard api call
  public getDashobard(dashboardData: any) {
    return this.http.post(`${baseUrl}/dashboard`, dashboardData);
  }

  //api call for logout
  public getLogout(logoutData: any) {
    return this.http.post(`${baseUrl}/logout`, logoutData);
  }


  

}
