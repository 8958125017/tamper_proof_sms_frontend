import { Injectable } from '@angular/core';
declare var $;
@Injectable({
  providedIn: 'root'
})

export class GlobalConstant {  

    errorMessages:any="Something went wrong,may be internet not connected or server not response,please try again!"; 
   //company name used in footer for QTL
    public qtlFooter :any="Connect Enterprise Solutions";
    
     //company name used in footer for VMIPL
    public vmiplFooter:any="Smart Enterprise Solutions";


    public replicaFor:any="qtl";


    /********************New Toaster Messages*****************/
 showErrorToaster(msg){
   $('#bootAlert').hide();
   $('#bootAlert').removeClass('alert-success').addClass('alert-error').show(function(){
                                $('.myclass').html(msg);
                             });
}

showSuccessMessage(msg){
  setTimeout (() => {
      $('#bootAlert').hide();
    }, 5000)
  $('#bootAlert').removeClass('alert-error').addClass('alert-success').show(function(){
                                $('.myclass').html(msg);
                              });
}
}
