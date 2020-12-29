
import { FormArray, FormControl, FormGroup, ValidationErrors, AbstractControl } from '@angular/forms'; 

export class CustomValidators {
// var reg =/^\d{10}$/;
static validMobile(n: FormControl): ValidationErrors {
// var reg = /(7|8|9)\d{9}/;
  //var reg = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
const number = n.value;
var isValid = true;

if (number != null && number != "") {
     var reg = /^[0]?[56789]\d{9}$/;
isValid = reg.test(number)? true : false;
   }
const message = {
  'validMobile':{
   'message': 'Mobile number is not Valid'
  }
};
return isValid ? null : message;
};
  static validPin(P: FormControl): ValidationErrors {
    var reg = /^[1-9][0-9]{5}$/;
   const number = P.value;
   var isValid = true;
   const message = {
     'validPin':{
      'message': 'invalid pattern'
     }
  };
  isValid = reg.test(number)? true : false;
  return isValid ? null : message;
};
static validName(a: FormControl): ValidationErrors {
  const name = a.value;

  var isValid = true;

  if (name != null && name != "") {
     var reg = /^[ a-zA-Z \-]+$/;
   isValid = reg.test(name)? true : false;
  }

const message = {
    'validName': {
      'message': ' Name not valid.'
    }
};

return isValid ? null : message;
}
  static vaildEmail(c: FormControl): ValidationErrors {
    const email = c.value;
    var isValid = true;
    if (email != null && email != "") {
      var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      var regemail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    isValid = regemail.test(email) ? true : false;
    }
    const message = {
      'vaildEmail': {
        'message': 'Email address not valid.'
      }
    };
    return isValid ? null : message;
  }

  static vaildEmail1(c: FormControl): ValidationErrors {
    const email = c.value;
    var isValid = true;
    if (email != null && email != "") {
      var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      // var regemail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      var regemail = /^[a-zA-Z]+[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z.]{2,5}$/;

    isValid = regemail.test(email) ? true : false;
    }
    const message = {
      'vaildEmail': {
        'message': 'Email address not valid.'
      }
    };
    return isValid ? null : message;
  }


  static vaildMobile(c: FormControl): ValidationErrors {
    var Mobile = c.value;
      var msg = "";
    if (Mobile != null && Mobile!="") {
      if (isNaN(Mobile) || Mobile.indexOf(" ") != -1 ) {
        msg = "Invalid Mobile No.";
      }
      //else if (Mobile.length > 10 || Mobile.length < 10) {
      //  msg = "Mobile No. should be 10 digit";
      //}
      //if (!(Mobile.charAt(0) == "9" || Mobile.charAt(0) == "8" || Mobile.charAt(0) == "7" || Mobile.charAt(0) == "6" )) {
      //  msg = "Mobile No. should start with 9 or 8 ";
      //}
    }
    var isValid = true;
    const message = {
      'vaildMobile': {
        'message': msg
      }
    };
    isValid = msg=="" ? true : false;
    return isValid ? null : message;
  }

  static vaildDefaltValueDDl(c: FormControl): ValidationErrors {
    const message = {
      'vaildEmail': {
        'message': 'This field is required.'
      }
    };
    return c.value != '0' ? null : message;
  }

  static age(c: FormControl): ValidationErrors {
    const num = Number(c.value);
    const isValid = !isNaN(num) && num >= 18 && num <= 85;
    const message = {
      'age': {
        'message': 'The age must be a valid number between 18 and 85' // Will changes the error defined in errors helper.
      }
    };
    return isValid ? null : message;
  }

  static PasswordPolicy(c: FormControl): ValidationErrors {
    const password = c.value;
 
    var regPolicy = /^(?=^.{6,24}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"":;'?/>.<,])(?!.*\s).*$/;
    var isValid = true;

    const message = {
      'PasswordPolicy': {
        'message': 'Password Policy not match.'
      }
    };
    if(password!=''){
      isValid = regPolicy.test(password) ? true : false;
      return isValid ? null : message;
    }

  }
  static MatchPassword(AC: AbstractControl) {
    let password = AC.get('Password').value; // to get value in input tag
    let confirmPassword = AC.get('ConfirmPassword').value; // to get value in input tag
    if (password != confirmPassword) {
      AC.get('ConfirmPassword').setErrors({ MatchPassword: true })
    }
    else {
      return null
    }
  };

  // /// >= validation
  // static Min(c: FormControl): ValidationErrors {
  //   const Min = c.value;
  //  // var regPolicy = /^(?=^.{6,24}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"":;'?/>.<,])(?!.*\s).*$/;
  //   var isValid = true;
  //   const message = {
  //     'MinMaxPolicy': {
  //       'message': 'Password Policy not match.'
  //     }
  //   };
  //   //isValid = regPolicy.test(password) ? true : false;
  //   return isValid ? null : message;
  // }
  // static Max(AC: AbstractControl) {
  //   let password = AC.get('NewPassword').value; // to get value in input tag
  //   let confirmPassword = AC.get('ConfirmPassword').value; // to get value in input tag
  //   if (password != confirmPassword) {
  //     AC.get('ConfirmPassword').setErrors({ MatchPassword: true })
  //   }
  //   else {
  //     return null
  //   }
  // };
  //////////////  validation for pan  /////////////fv
  static validpanformate(pan: FormControl): ValidationErrors {
    // var reg = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
  const pnumber = pan.value;
  var pisValid = true;
  if (pnumber != null && pnumber != "") {
    var reg = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    pisValid = reg.test(pnumber)? true : false;
  }
  const message = {
    'validpanformate':{
     'message': 'PAN invalid pattern'
    }
};
//  isValid = reg.test(number)? true : false;
return pisValid ? null : message;
};

  //////////////  end pan validation ////////////

  //////////////  validation for pan  /////////////fv
  static validgdteenformate(pa: FormControl): ValidationErrors {
    // var reg = /^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/;
  const number = pa.value;
  var isValid = true;
  if (number != null && number != "") {
    var reg = /^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/;
    isValid = reg.test(number)? true : false;
  }
  const message = {
    'validgdteenformate':{
     'message': 'GSTIN invalid pattern'
    }
};
//  isValid = reg.test(number)? true : false;
return isValid ? null : message;
};

//////////////  validation for pan  /////////////fv
static validformatePan(pa: FormControl): ValidationErrors {
  // var reg = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
const number = pa.value;
var isValid = true;
if (number != null && number != "" && number.length==10) {
  var reg = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
  isValid = reg.test(number)? true : false;
  var message = {
    'validpanformate':{
     'message': 'PAN invalid pattern'
    }
};
}
else if(number != null && number != "" && number.length>10){
  var reg = /^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/;
  isValid = reg.test(number)? true : false;
  var message = {
    'validpanformate':{
     'message': 'GSTIN is invalid'
    }
};
}

return isValid ? null : message;
};

static validNumber(n: FormControl): ValidationErrors {
  //var reg = /(7|8|9)\d{9}/;
  var reg = /^-?(0|[1-9]\d*)?$/;
  //var reg = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
const number = n.value;
var isValid = true;
const message = {
  'validNumber':{
   'message': 'invalid pattern'
  }
};
isValid = reg.test(number)? true : false;
return isValid ? null : message;
};

  //////////////  end pan validation ////////////
  static validNamepan(a: FormControl): ValidationErrors {
    const name = a.value;
    var isValid = true;
  if (name != null && name != "") {
    var reg = /^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/;
    isValid = reg.test(name)? true : false;
  }
  const message = {
    'validNamepan':{
     'message': 'PAN invalid pattern'
    }
};
// isValid = reg.test(name)? true : false;
  return isValid ? null : message;
  }

  static removeSpaces(control: AbstractControl) {
    if (control && control.value && !control.value.replace(/\s/g, '').length) {
      control.setValue('');
    }
    return null;
  }


  static valideCtcNumber(n: FormControl): ValidationErrors {
    //var reg = /^[1-9][0-9]*$/;
    //alert('123');
    var reg =/^[0][1-9]+|[1-9]\d*/;
    //var reg = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
  const number = n.value;
  var isValid = true;
  const message = {
    'validNumber':{
     'message': 'invalid pattern'
    }
  };
  isValid = reg.test(number)? true : false;
  return isValid ? null : message;
  };

}


