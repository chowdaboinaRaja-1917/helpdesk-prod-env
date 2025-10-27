import { Component, ChangeDetectorRef, AfterViewInit, Pipe } from '@angular/core';
import { JsonDataService } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

declare var bootstrap: any;
@Component({
  selector: 'app-home',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  allUsersRequest!: any;            //all the users store here
  openRequests: any[] = []; //open requests store here
  inProgressRequests: any[] = [];  // inprogress requests store here
  completedRequests: any[] = [];  //complteted request store here
  cancelledRequests: any[] = []; //cancelled requests store here
  request!: any;        //
  requestDetails: any; //request view
  allRequests: any;   //all the requests store here
  userId: any;       //user email address
  singleUserRequests: any;        //whose logged to account that  user tickes store here
  allUsers!: any;   //all the user deatails store here
  singleUser: any;    //who is logged to dash
  isUser: any;
  isLoading!: boolean;  //loading component is visable or not based on the isLoading attribute
  isReadOnly!: boolean;
  userallrequests: any;
  adminallres: any;
  constructor(private ds: JsonDataService, private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef) {
  }


  //filtering the user whos logged in dashboard
  ngOnInit(): void {
    this.userId = this.route.snapshot.queryParams['email']
    this.loadData();
  }

  //loading the data based on the email
  loadData() {
    this.isLoading = true;  // Start loading
    forkJoin({
      userDetails: this.ds.getUserDetails(),
      requests: this.ds.getDetails()
    }).subscribe({
      next: ({ userDetails, requests }) => {
        this.allUsers = userDetails;
        this.allUsersRequest = Object.keys(requests).map(key => ({ id: key, ...requests[key] })).filter(request => request);
        this.singleUser =  Object.keys(this.allUsers).map(key=>({id:key,...this.allUsers[key]})).find((request: any) => request.email === this.userId);

        //if single user exists then only it will go next step other wise notfound error
        if (this.singleUser) {
          this.ds.setRoleAccess(this.singleUser.role);
          console.log(this.allUsers,this.allUsersRequest)
          this.singleUserRequests = this.allUsersRequest.filter((request: any) => request.email === this.userId);
          console.log(this.singleUserRequests,'requests')
          this.filterRequests(this.singleUser.role === 'user' ? this.singleUserRequests : this.allUsersRequest)
        }
        else {
          this.router.navigate(['**'])
        }
        this.isLoading = false;  // Stop loading
        // this.cdr.detectChanges();  // Ensure view updates
      },
      error: (err) => {
        console.error('Error loading data:', err);
        if (err)
          this.router.navigate(['**'])
        this.isLoading = false;
        // Stop loading on error
      }
    });
  }





  //When user click on ticket id this function should work
  viewRequest(id: any, type: string) {
    this.ds.setClickType(type)    //Call the service and here set  the type of click if user click view type will view , if click on edit type will edit
    if (this.singleUser.role === 'user') {    //Chcecking the wether user or admin when click edit or view
      this.request = this.singleUserRequests.find((ticket: any) => ticket.id === id) // If it is user , assign their tickets.
      console.log(this.request)
    }
    else if (this.singleUser.role === 'admin') {
      //If he is admin then assign all the requests
      this.isLoading = true
      this.router.navigate(['home/newrequest'], { queryParams: { request_id: id } }); //After  checking it will redirect to our request form
      // this.request = this.allRequests.find((ticket: any) => ticket.id === id) //here filter the request based on the clicking id
    }
    this.requestDetails = this.request;
    console.log(this.requestDetails)
    this.request;
  }

  ngAfterViewInit(): void {
    // Initialize Bootstrap tooltips after the view is initialized
    setTimeout(() => {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    }, 0);
    this.allRequests = [...this.openRequests, ...this.inProgressRequests, ...this.completedRequests, ...this.cancelledRequests];
  }







  //Edit Request
  editRequest(details: any, type: string) {
    this.isLoading = true
    this.ds.setClickType(type);
    this.requestDetails = details
    this.request;
    this.router.navigate(['home/newrequest'], { queryParams: { request_id: details.request_id ,id:details.id} });

  }






  //filtering the tickets based on the status
  filterRequests(user: any): any {
    this.openRequests = user.filter((ticket: any) => ticket.status === 'Open');
    this.inProgressRequests = user.filter((ticket: any) => ticket.status === 'InProgress');
    this.completedRequests = user.filter((ticket: any) => ticket.status === 'Completed');
    this.cancelledRequests = user.filter((ticket: any) => ticket.status === 'Cancelled');
    console.log(this.cancelledRequests, 'cancelled')
    const priorityOrder: Record<string, number> = { 'High': 1, 'Medium': 2, 'Low': 3 };
    const sortByPriorityAndDate = (a: any, b: any) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
    }
    // Sort OpnRequests by priority and then by creation date
    this.openRequests.sort(sortByPriorityAndDate);

    // Sort inProgressRequests by priority and then by creation date
    this.inProgressRequests.sort(sortByPriorityAndDate);

    // Sort completedRequests by priority and then by creation date
    this.completedRequests.sort(sortByPriorityAndDate);

    // Sort cancelledRequests by priority and then by creation date
    this.cancelledRequests.sort(sortByPriorityAndDate);
    // Concatenate all sorted arrays to maintain the order
    this.allRequests = [...this.openRequests, ...this.inProgressRequests, ...this.completedRequests, ...this.cancelledRequests];
    console.log(this.allRequests)
    console.log(this.openRequests)
    console.log(this.cancelledRequests)
    if (this.singleUser.role === 'user') {
      this.userallrequests = this.allRequests
    }
    else {
      this.adminallres = this.allRequests
    }
    this.cdr.detectChanges();
  }

  deleteRequest(details: any) {
    const dltrequest = confirm('Are you sure you want to delete the request?');
    if (dltrequest) {
      const data = {
        ...details,
        status: 'Cancelled',
      };
      this.ds.deleteRequest(details.id, data).subscribe(
        response => {
          console.log('Status updated to Cancelled', response);

          // Update the request status in the local data
          const updatedRequest = { ...details, status: 'Cancelled' };

          // Update allUsersRequest
          const allUsersRequestIndex = this.allUsersRequest.findIndex((ticket: any) => ticket.id === details.id);
          if (allUsersRequestIndex !== -1) {
            this.allUsersRequest[allUsersRequestIndex] = updatedRequest;
          }

          // Update singleUserRequests if the user is not an admin
          if (this.singleUser.role === 'user') {
            const singleUserRequestIndex = this.singleUserRequests.findIndex((ticket: any) => ticket.id === details.id);
            
            if (singleUserRequestIndex !== -1) {
              this.singleUserRequests[singleUserRequestIndex] = updatedRequest;
            }
          } else {
            this.singleUserRequests = this.allUsersRequest.filter((request: any) => request.email === this.userId);
          }

          // Filter requests again to update the UI
          this.filterRequests(this.singleUser.role === 'user' ? this.singleUserRequests : this.allUsersRequest);

          // Trigger change detection manually
          this.cdr.detectChanges();
        },
        error => {
          console.error('Error updating status:', error);
          if (error) this.router.navigate(['**']);
        }
      );
    }
  }
}