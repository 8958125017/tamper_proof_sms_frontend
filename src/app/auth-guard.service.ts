import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, Resolve } from '@angular/router';
import {GlobalServiceService} from './global-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(public router: Router, private global_service: GlobalServiceService){ }
	canActivate(){
		if(sessionStorage.getItem('temperDetails'))
			return true;
		else{
			this.router.navigate(['/login']);	
			return false;
		}
	}
}
