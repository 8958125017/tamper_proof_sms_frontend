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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI; 
   clearSetTimeout:any;
   pendingRequest:any;
  terms:any;
    public isValidFormSubmitted = null;
     bodyRes:any;
     response:any;
  constructor(
     private data:ApiIntegrationService,
     private toastr: ToastrService,
     private fb: FormBuilder,
     private router:Router,
     public  constants:GlobalConstant, 
     private activatedRoute:ActivatedRoute,
     private messgage : MessageService
  ) { } 

       loginForm = new FormGroup({
         id: new FormControl('', [Validators.required]),
         password: new FormControl('', [Validators.required]),       
  });

  isAccept:boolean=false;
isSelected:any;
isSelect(e){  
  if(e.target.checked){
    this.isAccept=true; 
  }else{
    this.isAccept=false;
     // this.headerDoc='';
  }
}
  ngOnInit() {
  }

  //****************************Login Start Here******************************//

  login(){
      this.toastr.clear();
      if(this.loginForm.value.id == ''){
       this.toastr.error('Please enter your User ID/Password and then press login button');
       return false
       }else if(!this.isAccept){
         this.toastr.error('Please select I accept the Terms and Conditions');
         return false
       }      
       else if (this.loginForm.valid) {       
        let postData={
          "id": this.loginForm.value.id,
          "password":this.loginForm.value.password,
          "eclass": "EN"
        }
        clearTimeout(this.clearSetTimeout);
        this.blockUI.start('Logging...');
        this.pendingRequest=this.data.login(postData).subscribe((data) => {
                this.response=data;
                clearTimeout(this.clearSetTimeout);
                this.bodyRes=this.response.body;                 
                sessionStorage.clear();                             
              if(this.bodyRes.statusCode==200){ 
                if(!this.bodyRes.hasOwnProperty("data")){
                    this.blockUI.stop();
                     this.toastr.error(this.bodyRes['message']);
                    return false;

                }
                var res=this.bodyRes.data;                
                sessionStorage.setItem('temperDetails',JSON.stringify(this.bodyRes));  
                sessionStorage.setItem('eClass',this.bodyRes.data[0].eclass);                  
                    this.router.navigate(['/dashboard']).then(() => {                  
                    this.blockUI.stop();
                    this.toastr.clear();
                    // this.toastr.success("Welcome to the portal");                    
               })              
              }else{
                 this.blockUI.stop();
                 this.toastr.error(this.bodyRes['message']);
                 clearTimeout(this.clearSetTimeout);             
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
           this.toastr.error('User ID/Password wrongly mentioned, please provide valid credentials');
         }
   }

}
