import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from  '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    'Content-Type': 'application/json'    
  });

  constructor(private http: HttpClient) { }

  getList(){
    return this.http.get(`${this.apiUrl}organization/getList`,{headers: this.headers})
    .pipe(
      catchError(this.error)
    );
  }

  createOrganization(params): Observable<any> {
    let API_URL = `${this.apiUrl}organization/createOrganization`;
    return this.http.post(API_URL, params, {headers: this.headers})
    .pipe(
      catchError(this.error)
    )
  }

  addOrganizationContact(params): Observable<any> {
    let API_URL = `${this.apiUrl}organization/addOrganizationContact`;
    return this.http.post(API_URL, params, {headers: this.headers})
    .pipe(
      catchError(this.error)
    )
  }
  
  // Handle Errors 
  error(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
  
}
