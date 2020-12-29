
import { Component, OnInit } from '@angular/core';
import { ApiIntegrationService } from  '../api-integration.service';
import { Router , RouterModule , Routes} from  '@angular/router';
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { ToastrService} from 'ngx-toastr';
import { CustomValidators } from '../validators';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {GlobalServiceService} from '../global-service.service'
declare var $;

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {
   @BlockUI() blockUI: NgBlockUI;
  user:any;
  clearSetTimeout:any;
  pendingRequest:any;
  public currentPass : any;
  public newPass : any;
  public newConfirmPass: any;
  public Passwordnotmatch : any;
  public companyEmail :any;
  tempData:any;
  temperDetails:any;
  eClass:any;
  public changepassForm:FormGroup;
  public emailPattern =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  constructor(private data : ApiIntegrationService,private globalService:GlobalServiceService,private fb: FormBuilder,private toastr: ToastrService,private router: Router)
  {
     if(sessionStorage.getItem('temperDetails')){
              this.temperDetails=JSON.parse(sessionStorage.getItem('temperDetails'));
              this.tempData=this.temperDetails.data[0];
               this.eClass=this.tempData.eclass;
          }
}


changePasswordFormInit(){
        this.changepassForm = this.fb.group({
                // companyEmail       : new FormControl('',Validators.compose([Validators.required,CustomValidators.removeSpaces,Validators.pattern(this.emailPattern)])),              
                 currentPass   :     new FormControl('',Validators.required),
                 newPass : new FormControl('',Validators.compose([Validators.required,Validators.minLength(6), Validators.maxLength(16),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,100})/)])),
                 newConfirmPass:new FormControl('', Validators.required)}, { validator: this.matchingPasswords('newPass', 'newConfirmPass') });
      }
     

      matchingPasswords(passwordKey: string, confirmPasswordKey: string) {      
        return (group: FormGroup): { [key: string]: any } => {
            let password = group.controls[passwordKey];
            let confirmPassword = group.controls[confirmPasswordKey];
            if (password.value !== confirmPassword.value) {
                return {
                    mismatchedPasswords: true
                };
            }
        }
    }



  ngOnInit() {
     this.changePasswordFormInit();
     this.passwordStrength();
  }

  submitForPasswrd(){ 
     this.toastr.clear();
     if(!this.changepassForm.value.currentPass){
        this.toastr.error("Please enter current password");
        return false;
     }else if(!this.changepassForm.value.newPass){
       this.toastr.error("Please enter new password");
        return false;
     }else if(!this.changepassForm.value.newConfirmPass){
       this.toastr.error("Please enter confirm new  password");
        return false;
     }
     else if(this.changepassForm.value.currentPass === this.changepassForm.value.newPass){
      this.toastr.error('Your new password is same as old password') 
      this.blockUI.stop(); 
      return false;
      
    }
   else{
    let postData = {
       'id' : this.tempData.id,
      'current_password': this.changepassForm.value.currentPass,
      'new_password': this.changepassForm.value.newPass,
      "reqType":this.eClass,
    }  
  this.blockUI.start();
  this.pendingRequest=this.data.changePassword(postData).subscribe(
     data => {
      this.blockUI.stop();      
      clearTimeout(this.clearSetTimeout);      
      if (data['statusCode'] == 200) {
       this.router.navigate(['/dashboard']); 
        this.toastr.success("Password changed successfully")       
       this.changepassForm.reset();
      } else {
        this.toastr.error(data['message'])
      }
    },error => {               
             this.blockUI.stop();
              clearTimeout(this.clearSetTimeout);          
            this.toastr.error('Not able to connect host, please try again');      
             })        
             this.clearSetTimeout = setTimeout(() => {
                  this.pendingRequest.unsubscribe();
                  this.blockUI.stop();
             },10000);  
   }
    }


    // Password Strength with jquery
  passwordStrength(){
    $('#password').keyup(function() {
   
    $('#result').html(checkStrength($('#password').val()));
    })
    function checkStrength(password) {
    var strength = 0;
    if (password.length < 3) {
    $('#result').removeClass();
    $('#result').addClass('short')
     return 'Too short'
    }
    if (password.length > 5) strength += 1
    // If password contains both lower and uppercase characters, increase strength value.
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1
    // If it has numbers and characters, increase strength value.
    if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) strength += 1
    // If it has one special character, increase strength value.
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
    // If it has two special characters, increase strength value.
    // if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
    // // Calculated strength value, we can return messages
    // If value is less than 2
    if (strength < 4) {
    $('#result').removeClass()
    $('#result').addClass('weak')
    return 'Weak'
    } else {
    $('#result').removeClass()
    $('#result').addClass('strong')
     return 'Strong'
    }
    }
}

  


}
