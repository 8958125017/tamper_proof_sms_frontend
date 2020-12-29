import { HttpEvent, 
         HttpInterceptor, 
         HttpHandler, 
         HttpRequest, 
         HttpResponse,
         HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError,tap } from 'rxjs/operators';
import { GlobalConstant } from './globalconstant';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
declare var $;
export class HttpErrorInterceptor implements HttpInterceptor {
  @BlockUI() blockUI: NgBlockUI;
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        //this.blockUI.start('Loading...');
        return next.handle(request).pipe(
        tap(
        event => {
          //logging the http response to browser's console in case of a success
          if (event instanceof HttpResponse) {
          // this.blockUI.stop();      
          }
        },   
    ),catchError( (error: HttpErrorResponse) => {       
             $('#bootAlert').hide();
            // this.blockUI.stop();      
            let errMsg = '';
            // Client Side Error
            if (error.error instanceof ErrorEvent) {        
              errMsg = `Error: ${error.error.message}`;
             // this.showErrorToaster('Not able to connect host, please try again');
            } 
            else {  // Server Side Error
              errMsg = `Error Code: ${error.status},  Message: ${error.message}`;
           //   this.showErrorToaster('Not able to connect host, please try again');
            }
            return throwError(errMsg);
          })); 

  }

   showErrorToaster(msg){
   $('#bootAlert').hide();
   $('#bootAlert').removeClass('alert-success').addClass('alert-error').show(function(){
                                $('.myclass').html(msg);
                             });
}
} 
