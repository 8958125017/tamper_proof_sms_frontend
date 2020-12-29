import { Component, OnInit} from '@angular/core';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstant } from '../globalconstant';
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router,ActivatedRoute} from  '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CustomValidators } from '../validators';
declare var $;
import { MessageService } from '../messageservice.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
 @BlockUI() blockUI: NgBlockUI; 
  clearSetTimeout:any;
  pendingRequest:any;
  terms:any;
  public isValidFormSubmitted = null;
  bodyRes:any;
  response:any;
  constructor(    private data:ApiIntegrationService,
     private toastr: ToastrService,
     private fb: FormBuilder,
     private router:Router,
     public  constants:GlobalConstant, 
     private activatedRoute:ActivatedRoute,
     private messgage : MessageService) { 

  
     }


contactForm = new FormGroup({
         name: new FormControl('', [Validators.required]),
         email: new FormControl('', [Validators.required]),   
         mobile: new FormControl('', [Validators.required]), 
         organization    : new FormControl('', [Validators.required]),
         query: new FormControl('', [Validators.required]),
  });


  //****************************Login Start Here******************************//
  resMessage:any;
  contactUs(){
      this.toastr.clear();
      if(this.contactForm.value.name == ''){
         this.toastr.error('Please enter Name');
         return false
       } else if(this.contactForm.value.email == ''){
         this.toastr.error('Please enter email');
         return false
       } else if(this.contactForm.value.mobile == ''){
         this.toastr.error('Please enter mobile number');
         return false
       } else if(this.contactForm.value.organization == ''){
         this.toastr.error('Please enter organization name');
         return false
       } else if(this.contactForm.value.query == ''){
         this.toastr.error('Please fill your query');
         return false
       }     
       else if (this.contactForm.valid) {       
        let postData={
          "name": this.contactForm.value.name,
          "email":this.contactForm.value.email,
          "mobile": this.contactForm.value.mobile,
          "organization":this.contactForm.value.organization,
          "query": this.contactForm.value.query          
        }
        clearTimeout(this.clearSetTimeout);
        this.blockUI.start('Loading...');
        this.pendingRequest=this.data.contactUs(postData).subscribe((data) => {
                clearTimeout(this.clearSetTimeout);
                this.response=data; 
                this.blockUI.stop();    
                this.toastr.clear();             
                this.bodyRes=this.response;

              if(this.bodyRes.statusCode==200){ 
                var res=this.bodyRes.data;
                this.contactForm.reset();
                $('#emailModalCenter').modal('toggle');
                this.resMessage=this.bodyRes['message'];
                //this.toastr.success("Your query submited successfully!!");
              }else{
                 this.toastr.error(this.bodyRes['message']);                         
               }
              },error => {               
               this.blockUI.stop();          
               this.toastr.error('Not able to connect host, please try again');      
               })        
               this.clearSetTimeout = setTimeout(() => {
                    this.pendingRequest.unsubscribe();
                    this.blockUI.stop();
               },60000);
      }else{
            this.isValidFormSubmitted = false;
           this.toastr.error('Please enter valid value');
         }
   }

login(){
	this.router.navigate(['/login']);
}



ngOnInit() {
  $(window).scroll(function() {
    var scroll = $(window).scrollTop();
    var box = $(".header-text").height();
    var header = $("header").height();

    if (scroll >= box - header) {
      $("header").addClass("background-header");
    } else {
      $("header").removeClass("background-header");
    }
  });
}


menuClick(){
  // $("#submited").addClass("swhiteBox");
  $(".menu-trigger").toggleClass("active");
  $(".header-area .nav").slideToggle(200);
}


}
