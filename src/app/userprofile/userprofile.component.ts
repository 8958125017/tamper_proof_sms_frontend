import { Component, OnInit,ViewChild,ElementRef} from '@angular/core';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstant } from '../globalconstant';
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router,ActivatedRoute} from  '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CustomValidators } from '../validators';
import { MessageService } from '../messageservice.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserprofileComponent implements OnInit {
 @BlockUI() blockUI: NgBlockUI; 
    temperDetails:any;
    clearSetTimeout:any;
    pendingRequest:any;
    res:any;
    tempData:any
    enterpriseData:any={};
    constructor(
			  	private data:ApiIntegrationService,
			    private toastr: ToastrService,
			    private fb: FormBuilder,
			    private router:Router,
			    public  constants:GlobalConstant, 
			    private messgage : MessageService
		    ) { 
  			     if(sessionStorage.getItem('temperDetails')){
  			              this.temperDetails=JSON.parse(sessionStorage.getItem('temperDetails'));
  			              this.tempData=this.temperDetails.data[0];
  			       }  			 
          }

//------------------------------Get Enterprise Details start Section-----------------------------//
		getEnterpriseDetails(){ 
			   let postData={
			     "id"  : this.tempData.id,
			  	 "peid": this.tempData.peid
			   }
		    clearTimeout(this.clearSetTimeout);
		    this.blockUI.start('Loading...');
		    this.pendingRequest=this.data.getEnterpriseDetails(postData).subscribe(res=>{
		    clearTimeout(this.clearSetTimeout);
		    this.blockUI.stop();    
		    this.res=res;
		    if(this.res.statusCode==200){
		    	 this.enterpriseData=this.res.data;		  
		     } else{
		      this.toastr.error(this.res.messgage); 
		     }
		    },error => {               
		               this.blockUI.stop();      
		              })        
		              this.clearSetTimeout = setTimeout(() => {
		                   this.pendingRequest.unsubscribe();
		                   this.blockUI.stop();
		              },10000);
		}

//------------------------------Get Enterprise Details End Section-----------------------------//

//------------------------------Edit Profile start Here---------------------------------------//
 editProfile(){
 	this.toastr.success("submit successfully"); 
 	this.router.navigate(['/dashboard']);
 	 // let postData={
   //      	"id": "EN1293836195",
	  //       "peid": "12345"
   //    }  
   //    return false    
   //   this.data.getAllMessagesCountByStatus(postData).subscribe(data=>{
      
   //   }     
   //  })
 }

//-----------------------------Edit Profile End Here------------------------------------------//
  ngOnInit() {
  	this.getEnterpriseDetails();
  }

}
