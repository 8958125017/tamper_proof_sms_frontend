import { Component, OnInit,ViewChild,ElementRef} from '@angular/core';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstant } from '../globalconstant';
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router} from  '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
declare var $;
import { MessageService } from '../messageservice.service';

@Component({
  selector: 'app-developer-section',
  templateUrl: './developer-section.component.html',
  styleUrls: ['./developer-section.component.scss']
})
export class DeveloperSectionComponent implements OnInit {
@BlockUI() blockUI: NgBlockUI; 
    temperDetails:any;
    clearSetTimeout:any;
    pendingRequest:any;
    res:any;
    tempData:any
    enterpriseData:any={};
    page: number = 1;
    genrateKey:any;
    resp:any
    viewData:any={};
    password:any;
    showButton:boolean=false;

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
       if(!this.enterpriseData.seckey){
        this.showButton=true;
       }else{
          this.showButton=false;
       }
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

//--------------------------------Generate new Key start Section------------------------------/


generateSecretKey(){
	let postData={
     "id"  : this.tempData.id,
  	 "peid": this.tempData.peid
   }
   
    clearTimeout(this.clearSetTimeout);
    this.blockUI.start('Loading...');
    
    this.pendingRequest=this.data.generateSecretKey(postData).subscribe(res=>{
    clearTimeout(this.clearSetTimeout);
    this.blockUI.stop();
    
    this.res=res;
    if(this.res.statusCode==200){
       this.enterpriseData=this.res.data;      
     } else{
      this.toastr.error(this.res.message); 
     }
    },error => {               
              this.blockUI.stop();        
              this.toastr.error('Not able to connect host, please try again');      
              })        
              this.clearSetTimeout = setTimeout(() => {
                   this.pendingRequest.unsubscribe();
                   this.blockUI.stop();
              },10000);
}

//--------------------------------Generate new Key End Section------------------------------/


//----------------------------View key section start----------------------------//
  getKey(){
    
    if(!this.password){
       this.toastr.error('please enter password');  
    }else{
       let postData={
        "id": this.tempData.id,
        "password":this.password
        }
       this.blockUI.start('Loading...');
       this.data.viewKeys(postData).subscribe(data=>{
       this.blockUI.stop();
       this.password='';
       this.resp=data;     
       this.showKey=false;
           if(this.resp.statusCode===200){
             this.viewData=this.resp.data;
             // $('#apiModal').modal('toggle');
          }   else{
            this.toastr.error(this.resp.message);
          }  
        })
     }  	
   }
showKey:boolean=false;

  viewKeys(){
    $('#apiModal').modal('toggle'); 
    this.showKey=true;	
   }

//----------------------------View key section end----------------------------//
sidebarInfo(item){
  
  if(item == "whytraceTxt"){
    $("#whytraceTxt").addClass("showbookSection");
    $("#gettrace").removeClass("showbookSection");
    $("#centos").removeClass("showbookSection");
    $("#Ubuntu").removeClass("showbookSection");
    $("#Linux").removeClass("showbookSection");
    $("#Windows").removeClass("showbookSection");
    $("#requisites").removeClass("showbookSection");
    $("#installation").removeClass("showbookSection");
    $("#services").removeClass("showbookSection");
    $("#config").removeClass("showbookSection");
  }

 else if(item == "gettrace"){
    $("#gettrace").addClass("showbookSection");
    $("#whytraceTxt").removeClass("showbookSection");
    $("#centos").removeClass("showbookSection");
    $("#Ubuntu").removeClass("showbookSection");
    $("#Linux").removeClass("showbookSection");
    $("#Windows").removeClass("showbookSection");
    $("#requisites").removeClass("showbookSection");
    $("#installation").removeClass("showbookSection");
    $("#services").removeClass("showbookSection");
    $("#config").removeClass("showbookSection");
  }

  else if(item == "centos"){
    $("#centos").addClass("showbookSection");
    $("#whytraceTxt").removeClass("showbookSection");
    $("#gettrace").removeClass("showbookSection");
    $("#Ubuntu").removeClass("showbookSection");
    $("#Linux").removeClass("showbookSection");
    $("#Windows").removeClass("showbookSection");
    $("#requisites").removeClass("showbookSection");
    $("#installation").removeClass("showbookSection");
    $("#services").removeClass("showbookSection");
    $("#config").removeClass("showbookSection");
  }
  else if(item == "ubuntu"){
    $("#Ubuntu").addClass("showbookSection");
    $("#whytraceTxt").removeClass("showbookSection");
    $("#centos").removeClass("showbookSection");
    $("#gettrace").removeClass("showbookSection");
    $("#Linux").removeClass("showbookSection");
    $("#Windows").removeClass("showbookSection");
    $("#requisites").removeClass("showbookSection");
    $("#installation").removeClass("showbookSection");
    $("#services").removeClass("showbookSection");
    $("#config").removeClass("showbookSection");
  }

  else if(item == "linux"){
    $("#Linux").addClass("showbookSection");
    $("#whytraceTxt").removeClass("showbookSection");
    $("#centos").removeClass("showbookSection");
    $("#Ubuntu").removeClass("showbookSection");
    $("#gettrace").removeClass("showbookSection");
    $("#Windows").removeClass("showbookSection");
    $("#requisites").removeClass("showbookSection");
    $("#installation").removeClass("showbookSection");
    $("#services").removeClass("showbookSection");
    $("#config").removeClass("showbookSection");
  }

  else if(item == "windows"){
    $("#Windows").addClass("showbookSection");
    $("#whytraceTxt").removeClass("showbookSection");
    $("#centos").removeClass("showbookSection");
    $("#Ubuntu").removeClass("showbookSection");
    $("#Linux").removeClass("showbookSection");
    $("#gettrace").removeClass("showbookSection");
    $("#requisites").removeClass("showbookSection");
    $("#installation").removeClass("showbookSection");
    $("#services").removeClass("showbookSection");
    $("#config").removeClass("showbookSection");
  }

  else if(item == "requisites"){
    $("#requisites").addClass("showbookSection");
    $("#whytraceTxt").removeClass("showbookSection");
    $("#centos").removeClass("showbookSection");
    $("#Ubuntu").removeClass("showbookSection");
    $("#Linux").removeClass("showbookSection");
    $("#Windows").removeClass("showbookSection");
    $("#gettrace").removeClass("showbookSection");
    $("#installation").removeClass("showbookSection");
    $("#services").removeClass("showbookSection");
    $("#config").removeClass("showbookSection");
  }


  else if(item == "isntallation"){
    $("#installation").addClass("showbookSection");
    $("#whytraceTxt").removeClass("showbookSection");
    $("#centos").removeClass("showbookSection");
    $("#Ubuntu").removeClass("showbookSection");
    $("#Linux").removeClass("showbookSection");
    $("#Windows").removeClass("showbookSection");
    $("#requisites").removeClass("showbookSection");
    $("#gettrace").removeClass("showbookSection");
    $("#services").removeClass("showbookSection");
    $("#config").removeClass("showbookSection");
  }

  else if(item == "services"){
    $("#services").addClass("showbookSection");
    $("#whytraceTxt").removeClass("showbookSection");
    $("#centos").removeClass("showbookSection");
    $("#Ubuntu").removeClass("showbookSection");
    $("#Linux").removeClass("showbookSection");
    $("#Windows").removeClass("showbookSection");
    $("#requisites").removeClass("showbookSection");
    $("#installation").removeClass("showbookSection");
    $("#gettrace").removeClass("showbookSection");
    $("#config").removeClass("showbookSection");
  }

  
  else if(item == "settingconfig"){
    $("#config").addClass("showbookSection");
    $("#whytraceTxt").removeClass("showbookSection");
    $("#centos").removeClass("showbookSection");
    $("#Ubuntu").removeClass("showbookSection");
    $("#Linux").removeClass("showbookSection");
    $("#Windows").removeClass("showbookSection");
    $("#requisites").removeClass("showbookSection");
    $("#installation").removeClass("showbookSection");
    $("#services").removeClass("showbookSection");
    $("#gettrace").removeClass("showbookSection");
  }


}


  ngOnInit() {
    this.getEnterpriseDetails();
    $("#whytraceTxt").addClass("showbookSection");
  }
}
