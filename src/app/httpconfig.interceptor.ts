import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent,HttpErrorResponse, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError} from "rxjs/internal/operators";
import { Router, RouterModule, Routes} from '@angular/router';
import { ApiIntegrationService } from './api-integration.service';
import { ToastrService} from 'ngx-toastr';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: ApiIntegrationService, private router :Router, private toastr: ToastrService,) { }
 	
 	intercept(req: HttpRequest<any>, next: HttpHandler) { 		
    	const token: string = sessionStorage.getItem('usertokenforTm');
    	const authRequest = req.clone({
      		headers: req.headers.set("Authorization", "Bearer " +token)
    	});    	
	    return next.handle(authRequest)
	    .pipe(catchError((err: any) => {
	         
	        if (err instanceof HttpErrorResponse) {
	            if (err.status === 401) {
	            	this.toastr.error('Unauthorized access');
	            	this.router.navigate(['/login'])
	            }
	        }

	      return new Observable<HttpEvent<any>>();
	    }));
  	}
}