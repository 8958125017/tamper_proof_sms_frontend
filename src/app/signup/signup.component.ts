import { Component, OnInit} from '@angular/core';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstant } from '../globalconstant';
import { FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router,ActivatedRoute} from  '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CustomValidators } from '../validators';
declare var $;
import { MessageService } from '../messageservice.service';

interface inst {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI; 

  instituteType: inst[] = [
    {value: 'School', viewValue: 'School'},
    {value: 'University', viewValue: 'University'}
  ];
  
 constructor(
    private data:ApiIntegrationService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router:Router,
    public  constants:GlobalConstant, 
    private activatedRoute:ActivatedRoute,
     private messgage : MessageService
  ) { } 

showDeemed:boolean=false;
public isValidFormSubmitted = null;
public isSignupValidFormSubmitted = null;
clearSetTimeout:any;
pendingRequest:any;
public signUpForm:FormGroup;


changePasswordFormInit(){
  this.signUpForm = this.fb.group({
          email: new FormControl('', [Validators.required, Validators.email]),
          businessName: new FormControl('',[Validators.required]),      
          accredNum:new FormControl('', [Validators.required]),
          address : new FormControl(''),
          mobile: new FormControl('', [Validators.required]),  
          isDeemed: new FormControl(''),  
          country: new FormControl(''),    
          state: new FormControl('') ,
          password : new FormControl('',Validators.compose([Validators.required,Validators.minLength(6), Validators.maxLength(16),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,100})/)])),
          confirmPassword:new FormControl('', Validators.required)}, { validator: this.matchingPasswords('password', 'confirmPassword') });
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

changeInstituteType(item:any){
  this.signUpForm.value.instType=item.value;
   if(item.value=='University'){
     this.showDeemed=true;
  }else{
    this.showDeemed=false;
  }
}


//-----------------signup start here--------------------//
signup(){  
     if(this.signUpForm.value.authName == ''){
          this.toastr.error('Please enter name');
          return false;    
        }else if(this.signUpForm.value.email== ''){
           this.toastr.error('Please enter email'); 
           return false;  
         }else if(this.signUpForm.value.instType== ''){
          this.toastr.error('Please enter Institute type'); 
          return false;  
         }else if(this.signUpForm.value.instiName== ''){
            this.toastr.error('Please enter Institute name'); 
          return false; 
         }
         else if(this.signUpForm.value.instType =='University' && !this.signUpForm.value.isDeemed){
            this.toastr.error('Please select is deemed or not'); 
           return false; 
         }
         else if(this.signUpForm.value.accredNum== ''){
          this.toastr.error('Please enter auth Accrediation number'); 
          return false;  
         }else if(this.signUpForm.value.mobile== ''){
          this.toastr.error('Please enter auth mobile number'); 
          return false;  
         }
         else if(this.signUpForm.value.password== ''){
          this.toastr.error('Please enter password'); 
          return false;  
         }
         else if(this.signUpForm.value.password != this.signUpForm.value.confirmPassword ){
          this.toastr.error('Password Not matched'); 
          return false;  
         }
       else if(this.signUpForm.valid){         
            let postData ={
                      "email": this.signUpForm.value.email,
                      "peid": this.signUpForm.value.password,
                      "businessName": this.signUpForm.value.password,
                      "tax_reg_no":this.signUpForm.value.password,
                      "eclass": "EN",
                      "businessAddress": this.signUpForm.value.password,
                      "password": this.signUpForm.value.password
                }           
               clearTimeout(this.clearSetTimeout);
               this.blockUI.start();
               this.pendingRequest=this.data.signup(postData).subscribe((data) => {
               clearTimeout(this.clearSetTimeout);
               this.blockUI.stop();                
               this.isSignupValidFormSubmitted = false;
                  if(data['statusCode'] ==200){
                     this.toastr.success(data['message']);
                     this.signUpForm.reset();
                   this.router.navigate(['/login']);                    
                  }
                 else{
                      this.toastr.error(data['message']);                    
                      }

                },error => {
                           this.blockUI.stop();
                           clearTimeout(this.clearSetTimeout);
                             this.toastr.error('Not able to connect host, please try again');
                           })
                  this.clearSetTimeout = setTimeout(() => {
                      this.pendingRequest.unsubscribe();
                      this.blockUI.stop();
                 },30000);
     }else{
        this.isSignupValidFormSubmitted = false;
         this.toastr.error('something went wrong');
     }
  
}

//-----------------signup end here--------------------//

  ngOnInit() {
    this.changePasswordFormInit();
  }


}
