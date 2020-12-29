import { Component, OnInit, ElementRef } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy,formatDate} from '@angular/common';
import { Router } from '@angular/router';
declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'home_outline', class: '' },
    { path: '/my-document', title: 'My Document',  icon:'library_books', class: '' },
    // { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
    // { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
    // { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    // // { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
    // { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    // { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];
   
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
   temperDetails:any;
    businessName:any;
     today= new Date();
    jstoday = '';
  constructor(location: Location,  private element: ElementRef, private router: Router) {
      this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530');
   }

  ngOnInit() {
         if(sessionStorage.getItem('temperDetails')){
              this.temperDetails=JSON.parse(sessionStorage.getItem('temperDetails'));                            
              this.businessName=this.temperDetails.data[0].businessName;              
              // console.log("this.telename"+this.instDetails);
          }
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

  // isMobileMenu() {
  //     if ($(window).width() > 768) {
  //         return false;
  //     }
  //     return true;
  // };

  logout(){
        sessionStorage.clear();
        this.router.navigateByUrl('/login'); 
  }
}
