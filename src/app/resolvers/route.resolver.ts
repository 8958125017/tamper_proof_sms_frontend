import { Injectable } from '@angular/core';
import { ApiIntegrationService } from '../api-integration.service';
import { Router, Resolve, RouterStateSnapshot,ActivatedRouteSnapshot } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { withLatestFrom } from 'rxjs/operators';
@Injectable()
export class RouteResolver implements Resolve<any> {
   @BlockUI() blockUI: NgBlockUI; 
	temperDetails:any;
	tempData:any;
	snenCount:any;
	deliverCount:any;
	postData:any={};
	postData2:any={};
	postData3:any={};
	postData4:any={};
	postData5:any={};
	postData6:any={};
   constructor(public dataService: ApiIntegrationService) { 

   if(sessionStorage.getItem('temperDetails')){
               this.temperDetails=JSON.parse(sessionStorage.getItem('temperDetails'));
               this.tempData=this.temperDetails.data[0];         
          }
      }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
     this.blockUI.start('Loading...');
    this.postData={
        "peid":this.tempData.peid,
        "email": this.tempData.email,
         } 
    
     this.postData2={
	        "peid":this.tempData.peid,
	        "email": this.tempData.email,
	        "status": "DELIVRD"
         } 
      this.postData3={
	        "peid":this.tempData.peid,
	        "email": this.tempData.email,
	        "status": "ESME_ROK"
      }
    
       this.postData4={
        "peid":this.tempData.peid,
        "email": this.tempData.email,
        "status": "FAILED"
      }
      
      this.postData5={
	        "peid":this.tempData.peid,
	        "email": this.tempData.email,
	        "status": "ESME_RNOK"
      }
      this.postData6={
	        "peid":this.tempData.peid,
	        "email": this.tempData.email,
	        "status": "UNTRUSTED"
      }
      return this.dataService.getAllMessagesCountByStatus(this.postData).map(data=>{
          // this.blockUI.stop();
          return data
        }).pipe(
      withLatestFrom(
        this.dataService.getAllMessagesCountByStatus(this.postData2).map(data=>{
          // this.blockUI.stop();
          return data
        }),
        this.dataService.getAllMessagesCountByStatus(this.postData3).map(data=>{
          // this.blockUI.stop();
          return data
        }),
        this.dataService.getAllMessagesCountByStatus(this.postData4).map(data=>{
          // this.blockUI.stop();
          return data
        }),
        this.dataService.getAllMessagesCountByStatus(this.postData5).map(data=>{
          // this.blockUI.stop();
          return data
        }),
        this.dataService.getAllMessagesCountByStatus(this.postData6).map(data=>{
          this.blockUI.stop();
          return data
        })
      )
     );
   }
}