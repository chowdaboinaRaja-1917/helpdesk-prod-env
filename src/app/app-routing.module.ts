import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewRequestComponent } from './new-request/new-request.component';
import { FaqsComponent } from './faqs/faqs.component';
import { AboutComponent } from './about/about.component';
import { ErrorpageComponent } from './errorpage/errorpage.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { GuardService } from './guard.service';

const routes: Routes = [
  {
    path: "", component: LoginComponent
  },
  {
    path: "Login", component: LoginComponent
  },
  {
    path: "home", component: HomeComponent, children: [
      {
        path: "", component: DashboardComponent,
      },
      { 
        path: "newrequest", component: NewRequestComponent 
      },
      {
        path: "faqs", component: FaqsComponent,
      },
      {
        path: "about", component: AboutComponent
      },
    ], canActivate: [GuardService]
  }
  ,
  {
    path: "**", component: ErrorpageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
