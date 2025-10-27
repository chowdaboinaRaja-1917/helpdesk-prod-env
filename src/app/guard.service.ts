import { Injectable } from '@angular/core';
import {  CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { JsonDataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {
  authorised!:boolean;
  constructor(private ds:JsonDataService,private router:Router) { }
  canActivate(): boolean {
    const isAuthorised=sessionStorage.getItem('login')
    if(isAuthorised){
      this.authorised = JSON.parse(isAuthorised)
    }
    if(this.authorised){
      return true
    }
    else{
      this.router.navigate(['Login'])
      return false
    }
  }
}
