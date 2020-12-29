import { Component, OnInit } from '@angular/core';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstant } from '../globalconstant';
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router,ActivatedRoute} from  '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MessageService } from '../messageservice.service';
import * as Chartist from 'chartist';
import * as Chart from 'chart.js';
import { Label } from 'ng2-charts';
// import * as $ from 'jquery';
import * as _ from 'underscore';
declare var window: any;
declare var $;
import { hex2ascii } from 'hex2ascii';
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI; 
  temperDetails:any;
  clearSetTimeout:any;
  pendingRequest:any;
  res:any;
  chartData:any;
  tempData:any;
  dayCount: any;
  counts:any;
  public data:any=[];
  public barchart :any= [];  
  public dayLable:any=[];
  currentDate:any;
  selectedDate:any;
  date:any;
   public status:any="submit_sm";
   eClass:any;
entityData:any;
entRes:any
idEntity:any;
  constructor(
      private appdata:ApiIntegrationService,
      private toastr: ToastrService,
      private fb: FormBuilder,
      private router:Router,
      public  constants:GlobalConstant, 
      private activatedRoute:ActivatedRoute,
      private messgage : MessageService
    ) { 
   if(sessionStorage.getItem('temperDetails')){
              this.temperDetails=JSON.parse(sessionStorage.getItem('temperDetails'));
              this.tempData=this.temperDetails.data[0];  
              this.eClass=this.tempData.eclass;            
          }
          this.dayCount="7";
          this.counts=this.dayCount;
          this.getChartMessagesCount()
  }
  

  changeStatus(item:any){
    if(item==="submit_sm"){
      $("#submited").addClass("swhiteBox");
      $("#scardS").addClass("scardTitalText");
      $("#scardNS").addClass("scardNumberText");

      $("#delivered").removeClass("swhiteBox");
      $("#scardD").removeClass("scardTitalText");
      $("#scardND").removeClass("scardNumberText");


      $("#failed").removeClass("swhiteBox");
      $("#scardF").removeClass("scardTitalText");
      $("#scardNF").removeClass("scardNumberText");

      $("#untrested").removeClass("swhiteBox");
      $("#scardU").removeClass("scardTitalText");
      $("#scardNU").removeClass("scardNumberText");

    }
    else if(item==="DELIVRD"){
      $("#delivered").addClass("swhiteBox");
      $("#scardD").addClass("scardTitalText");
      $("#scardND").addClass("scardNumberText");


      $("#submited").removeClass("swhiteBox");
      $("#scardS").removeClass("scardTitalText");
      $("#scardNS").removeClass("scardNumberText");


      $("#failed").removeClass("swhiteBox");
      $("#scardF").removeClass("scardTitalText");
      $("#scardNF").removeClass("scardNumberText");

      $("#untrested").removeClass("swhiteBox");
      $("#scardU").removeClass("scardTitalText");
      $("#scardNU").removeClass("scardNumberText");



    }
    else if(item==="FAILED"){
      $("#failed").addClass("swhiteBox");
      $("#scardF").addClass("scardTitalText");
      $("#scardNF").addClass("scardNumberText");


      $("#submited").removeClass("swhiteBox");
      $("#scardS").removeClass("scardTitalText");
      $("#scardNS").removeClass("scardNumberText");


      $("#delivered").removeClass("swhiteBox");
      $("#scardD").removeClass("scardTitalText");
      $("#scardND").removeClass("scardNumberText");

      $("#untrested").removeClass("swhiteBox");
      $("#scardU").removeClass("scardTitalText");
      $("#scardNU").removeClass("scardNumberText");

    }


    else if(item==="UNTRUSTED"){
      $("#untrested").addClass("swhiteBox");
      $("#scardU").addClass("scardTitalText");
      $("#scardNU").addClass("scardNumberText");


      $("#submited").removeClass("swhiteBox");
      $("#scardS").removeClass("scardTitalText");
      $("#scardNS").removeClass("scardNumberText");


      $("#delivered").removeClass("swhiteBox");
      $("#scardD").removeClass("scardTitalText");
      $("#scardND").removeClass("scardNumberText");

      $("#failed").removeClass("swhiteBox");
      $("#scardF").removeClass("scardTitalText");
      $("#scardNF").removeClass("scardNumberText");

    }
   
    this.status=item;   
    this.dayCount=this.counts 
    this.getChartMessagesCount()
  }
  
  ctx:any;
  mention_today:boolean=true;
  currdate:any
  monthNames:any=["Jan", "Feb", "March", "April", "May", "June","July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  getChartMessagesCount(){
    if(this.counts==="year")
    {
     this.counts="year"
    }else{
     this.counts=+this.counts
    }
    let postData={
     "peid":this.tempData.peid,
     "reqType":this.eClass,
     "status":this.status,
     "viewBy":this.counts,    
   }
    clearTimeout(this.clearSetTimeout);    
    this.blockUI.start('Loading...');    
    this.pendingRequest=this.appdata.getChartMessagesCounts(postData).subscribe(res=>{
    clearTimeout(this.clearSetTimeout);
    
    this.blockUI.stop();    
    this.res=res;   
    if(this.res.statusCode==200){
      this.chartData=this.res.data;
      this.data=_.pluck(this.chartData, 'count'); 
      if(window.barchart!=undefined) {
            var oldcanvasid= window.barchart.chart.ctx.canvas;
               window.barchart.destroy();
        }
       var canvas : any = document.getElementById("canvas");
       var ctx = canvas.getContext("2d");
       var gradient = ctx.createLinearGradient(0, 0, 0, 600);
       gradient.addColorStop(0, '#04e295');
       gradient.addColorStop(1, '#00bfff');
                  
      this.dayLable=[];
      this.currdate = new Date();    
      if(this.counts==="year"){
         this.currdate .setDate(1);         
         for (i=0; i<=11; i++) {
          const fulld = (this.monthNames[this.currdate.getMonth()] + ' ' + this.currdate.getFullYear());
          this.dayLable.push(fulld);         
          this.currdate.setMonth(this.currdate.getMonth() - 1);
       }
      }else{
          for(var i=0;i<this.counts;i++){
          if(!this.mention_today && i==0)
           {
            i=1;this.counts+=1
           }      
    
          var last = new Date(this.currdate .getTime() - (i * 24 * 60 * 60 * 1000));
          var day =last.getDate();
          var month=last.getMonth();
          var monthName = this.monthNames[month]
          var year=last.getFullYear();
          const fulld = (Number(day)+' '+String(monthName));// Format date as you like
          this.dayLable.push(fulld);
        } 
      }
 

      window.barchart = new Chart(ctx, {  
        type: 'bar', 
        data: {  
          labels: this.dayLable,  
          datasets: [  
            {  
              data: this.data,  
              borderColor: '#00bfff',  
              barThickness: 25,
              backgroundColor:  gradient,            
              fill: true  
            }  
          ]  
        },  
        options: {  
          legend: {  
            display: false  
          },  
          scales: {  
            xAxes: [{     display: true,
                          gridLines: {
                               drawOnChartArea: false,drawBorder: false,
                          }
                       }],
                     yAxes: [{
                            gridLines: {
                                 drawOnChartArea: true,drawBorder: false,borderDash: [2,5],color: "gray" 
                            },
                            id: 'y-axis-1',
                            type: 'linear',
                            display: true,
                            position: 'left',
                            ticks: {
                                beginAtZero: true,
                                padding: 10,
                                 // stepSize: 2
                            }
                       }] 
          }  ,
          tooltips: {
                      position: 'average',
                      titleFontColor: '#FFF',
                      backgroundColor: '#00bfff',
                      bodyFontColor: '#000000',
                      displayColors: true
                  }
        }  
      }); 
     } else{
      this.toastr.error(this.res.message); 
     }
    },error => {               
              this.blockUI.stop();        
              this.toastr.error('Not able to connect host, please try again');      
              })        
              this.clearSetTimeout = setTimeout(() => {
                  this.pendingRequest.unsubscribe();
                   this.blockUI.stop();
              },10000);
  }
  // data: PieChartData[];   

  chart :any= []; 
  other:any;
  getPeiChart() {  
     this.other=this.submitData-(this.deleverData+this.failedData+this.pendingData)
      this.chart = new Chart('canvaspei', {  
        type: 'pie',  
        data: {  
          labels: ["Delivered","Failed","Pending","Other"],  
          datasets: [  
            {  
              // data: [this.deleverData,this.failedData,this.pendingData,this.errorData,this.other],
              data: [this.deleverData,this.failedData,this.pendingData,this.other],
              borderColor: '#D3D3D3',  
              backgroundColor: [  
                "#03bd5b",
                "Red",
                "orange",                                 
                // "#de31d5",
                "#7CDDDD" 
              ],  
              fill: true  
            }  
          ]  
        },  
        options: {  
          legend: {  
            display: false  
          },  
          scales: {  
            xAxes: [{  
              display: false  
            }],  
            yAxes: [{  
              display: false  
            }],  
          }  ,
          onClick: function (evt) {
                        var activePoint = this.getElementAtEvent(evt)[0];
                         var data = activePoint._chart.data;
                         var datasetIndex = activePoint._datasetIndex;
                         var label = activePoint._model.label;
                         var value = data.datasets[datasetIndex].data[activePoint._index];
                         console.log(label)
                         console.log(value)
                    }
        }  
      });  
  
  }
  resResp:any;
  deleverData:any=0;
  submitData:any=0;
  failedData:any=0;
  untrustedData:any=0;
  pendingData:any=0;
  errorData:any=0;
  ngOnInit() {
      // this.dayCount='';
      this.gettotalMessagesCount();
      this.getAllTMConnected();
       this.selectedDate =(((new Date()).getTime()) /1000).toFixed(0);
       this.getAllHeadersOfPeid(this.selectedDate,false);
   }

 resCount:any;
 countData:any;
 receivedData:any;
  gettotalMessagesCount(){
      let postData={
        "id":this.tempData.peid,
        "reqType":this.eClass
      }            
    this.appdata.getStatusCounts(postData).subscribe(data=>{
     this.resCount=data; 
      if(this.resCount.statusCode===200){       
       this.countData=this.resCount.data;  
      if(this.eClass=='OP'){
          this.receivedData=this.countData.TOTAL;
       }   else{
         this.submitData=this.countData.TOTAL;
       }  
       this.deleverData=this.countData.DELIVRD;
         if(this.countData.hasOwnProperty("submit_sm")){
         this.pendingData=this.countData.ESME_ROK+this.countData.submit_sm;
         }else{
           this.pendingData=this.countData.ESME_ROK+0;
         }
       this.failedData=this.countData.FAILED;
       this.errorData=this.countData.ESME_RNOK;
       this.untrustedData=this.countData.UNTRUSTED;        
       if(this.countData.hasOwnProperty("RECEIVED") && this.eClass!='OP'){
         this.receivedData=this.countData.RECEIVED?this.countData.RECEIVED:'0';
       }
       // this.getPeiChart();   
     }     
    })
   }
  resu:any;

  selectDays(value){   
     this.counts=value; 
     this.getChartMessagesCount();
  }

tmConnectedData:any=[];
resTm:any
tmDataLength:boolean=true;

getAllTMConnected(){
    let postData={
       "peid":this.tempData.peid,
       "email": this.tempData.email,
       "reqType":this.eClass,
        "days":7
      }   
      debugger   
     this.appdata.getAllTMConnected(postData).subscribe(data=>{
      this.resTm=data; 
      debugger
     if(this.resTm.statusCode===200){
       this.tmConnectedData=this.resTm.data;
       if(this.resTm.data.length){
          this.tmDataLength=false;
        }else{
            this.tmDataLength=true;
        }
     }     
    })
}

getAllHeadersData:any=[];
getHeadersData:any;
resHeader:any
headerDataLength:boolean=true;
dateNew:any;

selectByDate(item){  
       this.selectedDate=Date.parse(item)/1000;
       this.currentDate =(((new Date()).getTime()) /1000).toFixed(0);
       this.dateNew=parseInt(this.currentDate);
        if(this.selectedDate>this.dateNew){
          this.toastr.error('selected date should not be greater then current date.'); 
          return false;
        }else{         
          this.getAllHeadersOfPeid(this.selectedDate,false)
      }
}

isShowAll:boolean=false
getHeaderData:any=[];
respHeadData:any;
getAllHeadersOfPeid(date:any,value){  
    let postData={
       "peid":this.tempData.peid,
       "email": this.tempData.email,
       "reqType":this.eClass,
       "date":date
      }         
      this.isShowAll=value;
     this.appdata.getAllHeadersOfPeid(postData).subscribe(data=>{       
      this.resHeader=data;  
         if(this.resHeader.statusCode===200){
             if(this.resHeader.hasOwnProperty("data")){
               this.respHeadData=this.resHeader.data;
               if(this.respHeadData.length){
                this.headerDataLength=false;
             }else{
                this.headerDataLength=true;
           }
                 this.getAllHeadersData=[];
               if(this.isShowAll){               
                 $('#sharedModal').modal('toggle');
                 for(var i=0;i<this.respHeadData.length;i++){
                     if(this.eClass=='TM'){  
                        this.respHeadData[i].aparty=this.messgage.set('**^&%^%^$**', this.respHeadData[i].aparty);
                        this.getAllHeadersData=this.respHeadData;             
                     }else {
                          this.respHeadData[i].aparty=hex2ascii(this.respHeadData[i].aparty);
                          this.getAllHeadersData=this.respHeadData;         
                     }
                  }
               }else{                
                  for (var i=0;i<5;i++){
                        if(this.eClass=='TM'){  
                        this.respHeadData[i].aparty=this.messgage.set('**^&%^%^$**', this.respHeadData[i].aparty);
                        this.getAllHeadersData=this.respHeadData;            
                     }else {
                        this.respHeadData[i].aparty=hex2ascii(this.respHeadData[i].aparty);
                          this.getAllHeadersData=this.respHeadData;         
                     }
                } 
              }            
              
             
         }        
       }     
    })
}

showAllHeader(){
 this.getAllHeadersOfPeid(this.selectedDate,true)
}

close(){
 this.getAllHeadersOfPeid(this.selectedDate,false)
}

}
