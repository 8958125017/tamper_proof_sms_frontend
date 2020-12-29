import { Injectable, EventEmitter, Input, Output } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { Route, Router } from "@angular/router";
import { FormControl } from '@angular/forms'
import { Observable } from 'rxjs/Rx';
import * as Rx from 'rxjs/Rx';
import 'rxjs/add/observable/of';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ToastrService } from 'ngx-toastr';
import {ConstantModule} from './constants';

@Injectable({
    providedIn: 'root'
})
export class GlobalServiceService {
    // private toasterService: ToasterService;
    user: any;
    userInfo: any;
    userType: any;
    public headers: Headers;
    public requestoptions: RequestOptions;
    public res: Response;
    public loggedInObs: Rx.Subject<any> = new Rx.Subject<any>();
    isLogedInUser: boolean;
    public basePath = this.constant.basePath;
  constructor(
                public http: Http,
                public router: Router,
                private toastr: ToastrService,
                private constant : ConstantModule
                 // toasterService:ToasterService
               )
              {    }

    showNotification(message, type) {
        // this.toasterService.clear();
        if (type == 2) {
            this.toastr.success(message)
            // this.toasterService.pop('success', "", message);
        }
        if (type == 4) {
            this.toastr.error(message)
            // this.toasterService.pop('error', "", message);
        }


    }



    public getRequsetOptions(url: string): RequestOptions {

        let headers;
        if (sessionStorage.getItem('token')) {          
            headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("token",sessionStorage.getItem('usertokenforTm'));
        }
        else {
            // this.consoleFun('Unautorized Request !');
        }
        let requestoptions = new RequestOptions({
            method: RequestMethod.Get,
            url: url,
            headers: headers
        });
        return requestoptions;
    }



    public PostRequestUnautorized(url?: string, data?: any): any {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let requestoptions = new RequestOptions({
            method: RequestMethod.Post,
            url: url,
            headers: headers,
            body: JSON.stringify(data)
        });

        return this.http.request(new Request(requestoptions))
            .map((res: Response) => {


                return [{ status: res.status, json: res.json() }]
            })
            .catch((error: any) => {

                return Observable.throw(error);
            });
    }

    public PostRequest(url: string, data: any, flag?: any): any {
        var TOKEN = sessionStorage.getItem('usertokenforTm');
        let headers;
        headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("authorization", TOKEN);
        this.requestoptions = new RequestOptions({
            method: RequestMethod.Post,
            url: url,
            headers: headers,
            body: JSON.stringify(data)
        })

        return this.http.request(new Request(this.requestoptions))
            .map((res: Response) => {
                if (res.status == 200) {
                    return [{ status: res.status, json: res }]
                }
            })
            .catch((error: any) => {

                if (error.status == 401) {
                    sessionStorage.clear();
                    this.showNotification('Unauthorized access', 4);
                    this.router.navigateByUrl('/login');
                }
                if (error.status === 0) {
                    this.showNotification('No internet connection, Please try again!.', 4);
                }
                return Observable.throw(error);
            });
    }

    public GetRequest(url: string): any {

        return this.http.request(new Request(this.getRequsetOptions(url)))
            .map((res: Response) => {
                let jsonObj: any;
                if (res.status === 204) {
                    jsonObj = null;
                }
                else {
                    jsonObj = res.json()
                }
                return [{ status: res.status, json: jsonObj }]
            })
            .catch(error => {
                if (error.status == 0)
                    // this.consoleFun('error here', error);
                    return Observable.throw(error);
            });
    }



    public logout() {
        //const url = this.basePath + "admin/logout" ;
        //let obj = {token:this.userInfo.token};
        // this.PostRequest(url,obj).subscribe(res => {
        // this.consoleFun(res[0].json.json());
        sessionStorage.clear();
        this.router.navigateByUrl('/login');
        // }, err => {
        //   this.consoleFun(err);
        // })
    }




			isLogedIn(){
			         this.user=JSON.parse(sessionStorage.getItem('tmDetails'));
			         if(this.user!=null||this.user!=undefined){
			           return true;
			         }{
			              return false;
                          //return true;
			         }
			    }

}
