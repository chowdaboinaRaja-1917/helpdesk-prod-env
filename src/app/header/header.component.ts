import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonDataService } from '../data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  email!: string;
  password!: string;
  confirmPassword!: string;
  userId: any;
  userName: string|undefined;
  user!: string;
  isError!: boolean;
  userDetails: any;
  userRole: any;
  loggedsername:any;
  iswelcome:any;
  constructor(private router: Router, private route: ActivatedRoute, private ds: JsonDataService, private cdr: ChangeDetectorRef) { }



  ngOnInit(): void {

    this.iswelcome = sessionStorage.getItem('login')
    setTimeout(()=>{
      this.iswelcome=false
    },3000)
    // this.userId = this.route.snapshot.queryParams['email']
    const email = sessionStorage.getItem('email')
    if(email){
      this.userId=email
    }
    this.ds.getUserDetails().subscribe(((res) => {
      this.userDetails = res
      this.userRole = Object.keys(this.userDetails).map(key=>({id:key,...this.userDetails[key]})).find((request: any) => request.email === this.userId);
    }))
    this.loggedsername = sessionStorage.getItem('userName')
    let username = this.loggedsername?.split(' ')
    if(username){
      if(username.length===2){
        this.userName = username['0'].charAt(0)+username['1'].charAt(0)
        this.cdr.detectChanges()
      }
      else{
        this.userName = username['0'].charAt(0)
      }
    }
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
  showConfirmPassword(){
    const input = document.getElementById('confirm') as HTMLInputElement
    const showicon = document.getElementById('show-confirm') as HTMLInputElement
    const hidecon = document.getElementById('hide-confirm') as HTMLInputElement
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

//when user or admin visit any other components and they need to goback click home button
goBack() {
 
    this.router.navigate(['home'],{queryParams:{email:this.userId}})
  }


  //leave the page click on logout
  logout() {
    let logout = confirm("Are you sure want to logout")
    if (logout == true) {
      this.ds.Login(false)
      this.router.navigate(['Login'])
    }
  }
  //here checking the password and confirm password are same or not
  checkPassword() {
    this.isError = this.password !== this.confirmPassword;
  }


  //when click add user buttn then its adding new user
  adduser() {
    
    let data = {
      'id':Math.round(Math.random()*100),
      'email': this.email,
      'password': this.password,
      'role': 'user',
      'name': this.user
    
    }
    //if all the fileds enter then only admin add a new user
    if (this.email && this.password && this.user && this.confirmPassword && !this.isError) {
      this.ds.postUserDetails(data).subscribe((res) => {
        alert('User added successfully!')
      })
      console.log('Form submitted');
    }
  }
  //when admin click reset all the fileds data cleared
  reset() {
    this.email = this.password = this.user = this.confirmPassword = '';
  }
}
