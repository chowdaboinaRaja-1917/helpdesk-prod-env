

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonDataService {
  private roleAccess!: string;
  clicktype!: string;
  userName!: string;
  private baseUrl = 'https://help-desk-5bcfa-default-rtdb.firebaseio.com/requests';
  private userurl = 'https://help-desk-5bcfa-default-rtdb.firebaseio.com/users'

  constructor(private http: HttpClient,) { }


  //getuserdeatils

  getUserDetails(): Observable<any> {
    return this.http.get(`${this.userurl}.json`).pipe(
      catchError(this.handleError)
    );
  }
  // Create
  postDetails(record: any): Observable<any> {
    return this.http.post(`${this.baseUrl}.json`, record).pipe(
      catchError(this.handleError)
    );;
  }


  //postuserdetails
  postUserDetails(record: any): Observable<any> {
    return this.http.post(`${this.userurl}.json`, record).pipe(
      catchError(this.handleError)
    );;
  }

  // Read (All Records)
  getDetails(): Observable<any> {
    return this.http.get(`${this.baseUrl}.json`).pipe(
      catchError(this.handleError)
    );;
  }

  // Read (Single Record)
  getRequestDetails(recordId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${recordId}.json`);
  }

  // Update
  updateRequest(recordId: string, record: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${recordId}.json`, record);
  }

  // Delete
  deleteRequest(recordId: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${recordId}.json`, data);
  }
  // deleteRequest(recordId:any){
  //   return this.http.delete(`${this.baseUrl}/${recordId}.json`);
  // }
  deleteRecord(recordId: string, data: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${recordId}.json`, data);
  }


  //set username 
  setUserName(name: string) {
    sessionStorage.setItem('userName', name)
  }

  //set login as true if user login to their account
  Login(val: boolean) {
    sessionStorage.setItem('login', JSON.stringify(val))
  }

  //set the click type  edit or view
  setClickType(type: string) {
    sessionStorage.setItem('type', JSON.stringify(type))
  }




  //set the userid whos logged to helpdesk
  setLoginUserId(id: string) {
    sessionStorage.setItem('email', id)
  }


  //set the role wether the role user or admin
  setRoleAccess(role: string) {
    this.roleAccess = role
    sessionStorage.setItem('role', JSON.stringify(this.roleAccess))
  }

  //get the role wether the role is user or admin
  getRoleAccess() {
    return this.roleAccess
  }


 //eroor handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = ''
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        errorMessage = `Backend returned code ${error.status}, body was: `, error.error);
    }
    errorMessage += "Something bad happened,try again later"
    // Return an observable with a user-facing error message.
    return throwError(() => new Error(errorMessage));
  }
}