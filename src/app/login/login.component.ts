import { Component } from '@angular/core';
import { JsonDataService } from '../data.service';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { forkJoin, throwError } from 'rxjs';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  isLoading: any;
  inValidUser!: boolean;
  userdetails: any;
  roleAccess!: string;
  email!: string;
  password!: string;
  validUser: any;
  iserror!: boolean;
  badError!: boolean
  errorMessage!: string;
  isOnline:boolean=navigator.onLine
  constructor(private ds: JsonDataService, private router: Router) { }
  ngOnInit(): void {
    window.addEventListener('online', () => this.isOnline = true);
    window.addEventListener('offline', () => this.isOnline = false);

    //Loading The userdata from data.service
    forkJoin({
      details: this.ds.getUserDetails()
    }).subscribe(
      {
        next: ({ details }) => {
          this.userdetails = details
          console.log(this.userdetails)
        },
        error: (err) => {
          this.errorMessage = err
          // Stop loading on error
        }
      }

    )
  }

  showPassword() {
    const input = document.getElementById('password') as HTMLInputElement
    const showicon = document.getElementById('show') as HTMLInputElement
    const hidecon = document.getElementById('hide') as HTMLInputElement
    if (input) {
      if (input?.type === 'password') {
        input.type = 'text'
        hidecon.style.display = 'none'
        showicon.style.display = 'block'

      }
      else {
        input.type = 'password'
        hidecon.style.display = 'block'
        showicon.style.display = 'none'
      }
    }
  }
  //click on login button it will work
  Login() {
    //if the jsonlink fails to loda then throw an error
    if (this.errorMessage) {
      this.isLoading = false
      this.badError = true
      setTimeout(() => {
        this.iserror = false
      }, 3000)
    }
    else {
      this.isLoading = true;
    }
    this.validUser = Object.keys(this.userdetails).map(key=>({id:key,...this.userdetails[key]})).find((request: any) => request.email === this.email) //find enter email is exit or not
    if (!this.validUser) {
      this.inValidUser = true
      this.isLoading = false;
      setTimeout(() => {
        this.inValidUser = false;
      }, 3000)
    }
    else {
      if (this.validUser.email === this.email && this.validUser.password === this.password) { //if email is exit check the password
        this.ds.Login(true)
        sessionStorage.setItem("email",this.validUser.email)
        this.ds.setUserName(this.validUser.name)
        this.ds.setLoginUserId(this.email)
        this.router.navigate(['/home'], { queryParams: { email: this.email } })
      }
      else {
        this.iserror = true
        setTimeout(() => {
          this.iserror = false
        }, 3000)
      }
      this.isLoading = false
    }



  }
}
