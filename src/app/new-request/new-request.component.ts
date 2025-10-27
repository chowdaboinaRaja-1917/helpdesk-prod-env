import { Component } from '@angular/core';
import { JsonDataService } from '../data.service';
import { RequestData } from '../josnData.model';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
Router

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrl: './new-request.component.css'
})
export class NewRequestComponent {
  isLoading!: boolean;
  minDate: any;
  details: any;
  status!: string;
  title!: string;
  category!: string;
  description!: string;
  priority!: string;
  email: string = '';
  onbehalf!: boolean;
  disabled: boolean = true;
  requestId!:number;
  isCreate: any = true;
  requestDetails: any;
  userId!: string;
  role!: string;
  isReadonly!: boolean;
  createdBy!: string;
  createdDate!: any;
  ResolvedBy: any='';
  ResolvedDate!: any;
  comments!: string;
  clickType!: string;
  isHidden!: boolean;
  request: any;
  userDetails: any
  isnotExists!: boolean;
  validUserorNot:any;
  constructor(private ds: JsonDataService, private route: ActivatedRoute, private router: Router) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }
  textchange() {
    if (this.onbehalf == true) {
      this.disabled = false
    }
    else if (this.onbehalf == false) {
      this.disabled = true
    }
  }

  //user hit crteate button then raise new ticket
  onSubmit(t: any) {
    this.requestId = this.route.snapshot.queryParams['id'];
    console.log(this.requestId)
    let created_at = new Date().toLocaleString();
    let data: RequestData = {
      request_id: Math.floor(Math.random() * 900000) + 100000,
      category: this.category,
      title: this.title,
      description: this.description,
      status: 'Open',
      priority: this.priority,
      created_at: created_at,
      email: this.email,
      onbehalf: this.onbehalf,
      comments: this.comments,
      created_by: this.userId,
      created_date: new Date().toLocaleString(),
      resolved_by: this.ResolvedBy,
      resolved_date: this.ResolvedDate
    }
    //all the fileds are enter then only its work
    if (t.valid) {
      forkJoin({ res: this.ds.getUserDetails() }).subscribe({
        next: ({ res }) => {
          this.userDetails = res
          this.validUserorNot = Object.keys(this.userDetails).map(key=>({id:key,...this.userDetails[key]})).find((request: any) => request.email === this.email);
          console.log(this.userDetails,'userdetails')
          if (this.validUserorNot) {
            this.isLoading = true
            this.ds.postDetails(data).subscribe((res) => {
              this.isLoading = false
              alert(`New request is raised successfully! \n Your Request id is: ${data.request_id}`)
              this.router.navigate(['home'], { queryParams: { email: this.userId } })
            }, error => {
              if (error) {
                this.router.navigate(['**'])
              }
            })
          }
          else{
            this.isnotExists=true
          }
        }
      })
    }
  }


  ngOnInit(): void {
   
    const email = sessionStorage.getItem('email')
    if (email) {
      this.userId = email
    }
    if (this.userId) {
      this.email = this.userId
    }

    const role = sessionStorage.getItem('role')
    if (role) {
      this.role = JSON.parse(role)
    }
    this.requestId = this.route.snapshot.queryParams['request_id'];
    if (this.requestId) {
      const clickType = sessionStorage.getItem('type')
      if (clickType) {
        this.clickType = JSON.parse(clickType)
      }
      this.isLoading = true
      this.ds.getDetails().subscribe((requests: any) => {
        console.log(requests)

        const requestsArray = Object.keys(requests).map(key => ({
          ...requests[key],
          id: key
        }));
        this.request = requestsArray.find((t: any) => t.request_id == this.requestId);
        if (this.request) {
          if (this.role === 'admin' && this.clickType == 'View') {
            this.isReadonly = true
            this.isHidden = false
          }
          else {
            this.isReadonly = false
            this.isHidden = true
          }
          setTimeout(() => {
            this.isLoading = false
          }, 10)
          this.isCreate = false;
          this.title = this.request.title;
          this.category = this.request.category;
          this.ResolvedBy = this.request.resolved_by;
          this.ResolvedDate = this.request.resolved_date;
          this.status = this.request.status
          this.email = this.request.email;
          this.comments = this.request.comments;
          this.description = this.request.description;
          this.priority = this.request.priority;
          this.onbehalf = this.request.onbehalf;
        }
      });
    }
  }


  //When admin click on update and changing the status as complete the comment,resolved_by,resolved_date textboxes visible
  chanageStatus() {
    if (this.status === 'Completed') {
      this.isHidden = false
      this.ResolvedBy = sessionStorage.getItem("email")
      console.log(this.ResolvedBy,'resolvdby')
    }
    else {
      this.isHidden = true
    }
  }



//update the request
  onUpdate(v: any) {
    const id = this.route.snapshot.queryParams['id']
    console.log(v)
    if (v.valid) {
      this.isLoading = true;
      forkJoin({ res: this.ds.getRequestDetails(id) }).subscribe({
        next: ({ res }) => {
          this.requestDetails = res;
          let data = {
            ...this.requestDetails,
            title: this.title,
            category: this.category,
            description: this.description,
            priority: this.priority,
            email: this.email,
            status: this.status,
            comments: this.comments,
            resolved_by: this.ResolvedBy,
            resolved_date: this.ResolvedDate
          }
          forkJoin({ res: this.ds.updateRequest(id, data) }).subscribe({
            next: ({ res }) => {
              this.isLoading = false;
              //this.router.navigate([`home/${this.ds.getloginUserId()}`])
              this.router.navigate(['home'], { queryParams: { email: this.userId } })
            },
            error: (err) => {
              console.error('Error loading data:', err);
              if (err)
                this.router.navigate(['**'])
              this.isLoading = false;
              // Stop loading on error
            }
          })
        }
      })
    }
  }

  //when cancel the update then return back to dashboard
  onCancel() {
    console.log('email', this.userId)
    this.router.navigate(['home'], { queryParams: { email: this.userId } })
  }
}


