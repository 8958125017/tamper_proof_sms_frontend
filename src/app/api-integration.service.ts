import { Injectable } from '@angular/core';
import { ConstantModule} from './constants';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { retry, catchError } from 'rxjs/operators';

import * as Rx from 'rxjs/Rx';
import 'rxjs/add/observable/of';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { throwError } from 'rxjs';
import { Route, Router } from "@angular/router";
const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin':'*',
    'Authorization':'authkey',
    'userid':'1'
  })
};

@Injectable({
  providedIn: 'root'
})

export class ApiIntegrationService {
tempData:any;
temperDetails:any;
eClass:any;
 constructor(private http: HttpClient,private constant:ConstantModule) { 

 }
  public baseURL = this.constant.basePath;
 
  signup(data){    
      return this.http.post(this.baseURL+'college/signup',data).pipe(
        retry(3)
      );
  }


  login(data){    
    return this.http.post(this.baseURL+'en/login',data, {
        headers: new HttpHeaders()
            .set('Content-Type', 'application/json'),
        observe: 'response'
    })
    .map(res => {    
      return res;        
    }).pipe(
      retry(3)        
    );
  }  
  
  changePassword(data){
      this.eClass = sessionStorage.getItem('eClass');
       if(this.eClass==="OP"){
          var apiPath='en/changePassword';
       }else{
         var apiPath='en/changePassword';
       }
       return this.http.post(this.baseURL+apiPath,data).pipe(
            retry(3)
          );
    }

  generateSecretKey(data){
     this.eClass = sessionStorage.getItem('eClass');
       if(this.eClass==="OP"){
          var apiPath='en/generateSecretKey';
       }else{
         var apiPath='en/generateSecretKey';
       }
       return this.http.post(this.baseURL+apiPath,data).pipe(
            retry(3)
          );
    }

    getEnterpriseDetails(data){
       this.eClass = sessionStorage.getItem('eClass');
       if(this.eClass==="OP"){
          var apiPath='en/getEnterpriseDetails';
       }else{
         var apiPath='en/getEnterpriseDetails';
       }
       return this.http.post(this.baseURL+apiPath,data).pipe(
            retry(3)
          );
    }

getStatusCounts(data){
       this.eClass = sessionStorage.getItem('eClass');
       if(this.eClass==="OP"){
          var apiPath='opMessage/getStatusCounts';
       }else if(this.eClass==="TM"){
          var apiPath='tmMessage/getStatusCounts';
       }else{
         var apiPath='message/getStatusCounts';
       }
       return this.http.post(this.baseURL+apiPath,data).pipe(
            retry(3)
          );
    }

    getChartMessagesCounts(data){
       this.eClass = sessionStorage.getItem('eClass');
       if(this.eClass==="OP"){
          var apiPath='opMessage/getChartMessagesCounts';
       }else if(this.eClass==="TM"){
          var apiPath='tmMessage/getChartMessagesCounts';
       }else{
         var apiPath='message/getChartMessagesCounts';
       }
       return this.http.post(this.baseURL+apiPath,data).pipe(
            retry(3)
          );
    }

    getNodeCount(data){
       this.eClass = sessionStorage.getItem('eClass');
       if(this.eClass==="OP"){
          var apiPath='opMessage/getNodeCount';
       }else if(this.eClass==="TM"){
          var apiPath='tmMessage/getNodeCount';
       }else{
         var apiPath='message/getNodeCount';
       }
       return this.http.post(this.baseURL+apiPath,data).pipe(
            retry(3)
          );
    }

    getAllMessagesByStatus(data){
       this.eClass = sessionStorage.getItem('eClass');
       if(this.eClass==="OP"){
          var apiPath='opMessage/getAllMessagesByStatus';
       }else if(this.eClass==="TM"){
          var apiPath='tmMessage/getAllMessagesByStatus';
       }else{
         var apiPath='message/getAllMessagesByStatus';
       }
       return this.http.post(this.baseURL+apiPath,data).pipe(
            retry(3)
          );
    }

    getAllMessagesByTime(data){
      this.eClass = sessionStorage.getItem('eClass');
       if(this.eClass==="OP"){
          var apiPath='opMessage/getAllMessagesByTime';
       }else if(this.eClass==="TM"){
          var apiPath='tmMessage/getAllMessagesByTime';
       }else{
         var apiPath='message/getAllMessagesByTime';
       }
       return this.http.post(this.baseURL+apiPath,data).pipe(
            retry(3)
          );
    }

    getMessage(data){
       this.eClass = sessionStorage.getItem('eClass');
       if(this.eClass==="OP"){
          var apiPath='opMessage/getMessage';
       }else if(this.eClass==="TM"){
          var apiPath='tmMessage/getMessage';
       }else{
         var apiPath='message/getMessage';
       }
       return this.http.post(this.baseURL+apiPath,data).pipe(
            retry(3)
          );
    }

    getAllHeadersOfPeid(data){
      this.eClass = sessionStorage.getItem('eClass');
       if(this.eClass==="OP"){
          var apiPath='opMessage/getAllHeadersOfPeid';
       }else if(this.eClass==="TM"){
          var apiPath='tmMessage/getAllHeadersOfPeid';
       }else{
         var apiPath='message/getAllHeadersOfPeid';
       }
       return this.http.post(this.baseURL+apiPath,data).pipe(
            retry(3)
          );
    }

    getAllTMConnected(data){
      this.eClass = sessionStorage.getItem('eClass');
       if(this.eClass==="OP"){
          var apiPath='opMessage/getAllTMConnected';
       }else if(this.eClass==="TM"){
          var apiPath='tmMessage/getAllPEConnected';
       }else{
         var apiPath='message/getAllTMConnected';
       }
       return this.http.post(this.baseURL+apiPath,data).pipe(
            retry(3)
          );
    }

    viewKeys(data){
      this.eClass = sessionStorage.getItem('eClass');
       if(this.eClass==="OP"){
          var apiPath='en/viewKeys';
       }else{
         var apiPath='en/viewKeys';
       }
       return this.http.post(this.baseURL+apiPath,data).pipe(
            retry(3)
          );
    }

    getAllMessagesCountByStatus(data){      
      this.eClass = sessionStorage.getItem('eClass');
       if(this.eClass=="OP"){         
          var apiPath='opMessage/getAllMessagesCountByStatus';
       }else if(this.eClass==="TM"){
          var apiPath='tmMessage/getAllMessagesCountByStatus';
       }else{         
         var apiPath='message/getAllMessagesCountByStatus';
       }
       return this.http.post(this.baseURL+apiPath,data).pipe(
            retry(3)
          );
    }

    getNodeGraph(data){
      this.eClass = sessionStorage.getItem('eClass');
       if(this.eClass==="OP"){
          var apiPath='tracing/getGraphById';
       }else if(this.eClass==="TM"){
          var apiPath='tracing/getGraphById';
       }else{
         var apiPath='tracing/getGraphById';
       }
       
       return this.http.post(this.baseURL+apiPath,data).pipe(
            retry(3)
        );
    }

searchMessage(data){
      this.eClass = sessionStorage.getItem('eClass');
       if(this.eClass==="OP"){
          var apiPath='opMessage/searchMessage';
       }else if(this.eClass==="TM"){
          var apiPath='tmMessage/searchMessage';
       }else{
         var apiPath='message/searchMessage';
       }
       return this.http.post(this.baseURL+apiPath,data).pipe(
            retry(3)
        );
    }

   getGraphByMsgId(data){
      this.eClass = sessionStorage.getItem('eClass');
       if(this.eClass==="OP"){
          var apiPath='tracing/getGraphById';
       }else if(this.eClass==="TM"){
          var apiPath='tracing/getGraphById';
       }else{
         var apiPath='tracing/getGraphById';
       }
       return this.http.post(this.baseURL+apiPath,data).pipe(
            retry(3)
        );
    }
    contactUs(data){    
      return this.http.post(this.baseURL+'en/contactUs',data).pipe(
        retry(3)
      );
  }

  getEntity(data){    
    this.eClass = sessionStorage.getItem('eClass');
       if(this.eClass==="OP"||this.eClass==="TM"){
          var apiPath='message/getEntity';
       }       
       return this.http.post(this.baseURL+apiPath,data).pipe(
            retry(3)
      );
   }



  getGraphByDate(data){    
    this.eClass = sessionStorage.getItem('eClass');
       if(this.eClass==="OP"){
          var apiPath='message/getGraphByDate';
       }else if(this.eClass==="TM"){
          var apiPath='tmMessage/getGraphByDate';
       }else{
          var apiPath='message/getGraphByDate';
       }
       return this.http.post(this.baseURL+apiPath,data).pipe(
            retry(3)
        );
   }


   getGraphById(data){    
    this.eClass = sessionStorage.getItem('eClass');
       if(this.eClass==="OP"){
          var apiPath='tracing/getGraphById';
       }else if(this.eClass==="TM"){
          var apiPath='tracing/getGraphById';
       }else{
          var apiPath='tracing/getGraphById';
       }
       return this.http.post(this.baseURL+apiPath,data).pipe(
            retry(3)
        );
   }
  }
