import { Component,EventEmitter,OnInit,Input,Output,ViewEncapsulation } from '@angular/core';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstant } from '../globalconstant';
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router,ActivatedRoute} from  '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CustomValidators } from '../validators';
import { MessageService } from '../messageservice.service';
import * as Chartist from 'chartist';
import * as Chart from 'chart.js';
import { Label } from 'ng2-charts';
declare var $;
import { HierarchyPointNode } from "d3";
import { hex2ascii } from 'hex2ascii';

// ---------------------------Start Go js Start Here-----------------------//

import * as go from 'gojs';
const graph = go.GraphObject.make;
declare var $;
import * as moment from 'moment';

// ---------------------------Start Go js End Here-----------------------//

import * as d3 from "d3";
export const margin = { top: 20, right: 120, bottom: 20, left: 205 };
export const width = 1080;
export const height = 800 - margin.top - margin.bottom;


@Component({
   selector: 'app-dashboard',
   templateUrl: './dashboard.component.html',
   styleUrls: ['./dashboard.component.css'],
   encapsulation: ViewEncapsulation.None,
})

export class DashboardComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI; 
  temperDetails:any;
  clearSetTimeout:any;
  pendingRequest:any;
  res:any;
  messageData:any=[];
  emailId:any;
  itemsPerPage: any = 10;
  dataLength: boolean = true;
  page: number = 1;
  messagecount:any=1;
  searchKey:any;
  resp:any;
  tempData:any;
  public status:any="all";
  resResp:any;
  private svg;
  private treeLayout;
  private root;
  private tooltip;
  eClass:any;
  entityData:any;
  entRes:any
  idEntity:any;
  

  // ---------------------------Start Go js first tracing Start Here-----------------------//
    public diagram: go.Diagram = null;
    public model: go.Model;
    public geo: any;
    public opacity: any = 1;

      public diagram2: go.Diagram = null;
      public model2: go.Model;
      public geo2: any;
      public opacity2: any = 1;
  constructor( 
  
     private dataService:ApiIntegrationService,
     private toastr: ToastrService,
     private fb: FormBuilder,
     private router:Router,
     public  constants:GlobalConstant, 
     private activatedRoute:ActivatedRoute,
     private messgage : MessageService) {
       
         if(sessionStorage.getItem('temperDetails')){
              this.temperDetails=JSON.parse(sessionStorage.getItem('temperDetails'));
              this.tempData=this.temperDetails.data[0];
              this.eClass=this.tempData.eclass;
          }  
          if(this.eClass!="EN"){
            
             this.getEntity()
          }   
         
          this.getcount(this.status);
          this.gettotalMessagesCount();
      }
  getEntity(){
    let postData={
            "reqid": this.tempData.id,
             // "reqid": "QTL1234567",
            "reqType":this.eClass
    }
    this.dataService.getEntity(postData).subscribe(res=>{
      this.entRes=res;
      
      if(this.entRes.statusCode===200){
        this.entityData=this.entRes.data;
      }
    });
  }

   entityId:any;
    activeEntityId(value) {          
     this.entityId = value;
    }
    
// get total count
  getcount(status){
      let postData={
        "peid":this.tempData.peid,
        "email": this.tempData.email,
        "reqType":this.eClass,
        "status": status
      }  
       if(status==="all"){
       delete postData["status"];
     }     
     this.dataService.getAllMessagesCountByStatus(postData).subscribe(data=>{
      this.resp=data;     
       if(this.resp.statusCode===200){       
         this.messagecount=this.resp.data;          
         this.getAllMessagesByStatus();     
       }     
    })
   }


respData:any=[];
getAllMessagesByStatus(){ 
   let postData = {
      "peid":   this.tempData.peid,
      "email":  this.tempData.email,
      "reqType":this.eClass,
      "status": this.status,      
      "page":   this.page,
      "count":  10
     }
       if(this.eClass=="TM"){
           postData["msgtype"] = this.statusBy
          }  
     if(this.status==="all"){
       delete postData["status"];
     } 
    clearTimeout(this.clearSetTimeout);    
    this.blockUI.start('Loading...');
    this.pendingRequest=this.dataService.getAllMessagesByStatus(postData).subscribe(res=>{
    clearTimeout(this.clearSetTimeout);
    this.blockUI.stop();  
     this.respData=[];
    this.messageData=[];
    this.res=res;
    if(this.res.statusCode==200){
       this.respData=this.res.data;            
       
        for(var i=0;i<this.respData.length;i++){
           if(this.eClass=='TM'){
             debugger
             if(this.respData[i].isEncrypt==1){
                this.respData[i].bparty=this.messgage.set('#^&%^%^$**', this.respData[i].bparty);
                this.respData[i].aparty=this.messgage.set('**^&%^%^$**', this.respData[i].aparty);
                this.messageData=this.respData;
             }else{            
                this.respData[i].bparty=hex2ascii(this.respData[i].bparty);
                this.respData[i].aparty=hex2ascii(this.respData[i].aparty);
                this.messageData=this.respData;
             }
           }else if(this.eClass!='TM'){           
                this.respData[i].bparty=hex2ascii(this.respData[i].bparty);
                this.respData[i].aparty=hex2ascii(this.respData[i].aparty);
                this.messageData=this.respData;             
           }
        }
       if(this.messageData.length){
          this.dataLength = false;
        }else{
          this.dataLength = true;
        }
     } else{
        this.dataLength = true;
     }
    },error => {               
              this.blockUI.stop();       
              this.toastr.error('Not able to connect host, please try again');      
              })        
              this.clearSetTimeout = setTimeout(() => {
                   this.pendingRequest.unsubscribe();
                   this.blockUI.stop();
              },60000);
}



pageChanged(event) {
      this.page = event; 
      this.getAllMessagesByStatus(); 
}


pageChangeSelect(e){
  this.itemsPerPage = e;
  this.getAllMessagesByStatus();
}


 changeStatus(status){
    this.page = 1;
    this.itemsPerPage = 25;
    this.status = status;
    this.getcount(status);
  }
  changeStatus2(status){
    this.page = 1;
    this.itemsPerPage = 25;
    this.statusBy = status;
    this.getcount(status);
  }
  
  receivedData:any=0;
  deleverData:any=0;
  submitData:any=0;
  failedData:any=0;
  untrustedData:any=0;
  pendingData:any=0;
  errorData:any=0;

  // ngOnInit(){   
  //   
  //   this.nodeGraph();   
  // }



resCount:any;
countData:any;
  gettotalMessagesCount(){
      let postData={
        "id":this.tempData.peid,
        "reqType":this.eClass
      }            
     this.dataService.getStatusCounts(postData).subscribe(data=>{
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
         this.pendingData=this.countData.ESME_ROK;
       }
             
       this.failedData=this.countData.FAILED;
       this.errorData=this.countData.ESME_RNOK;
       this.untrustedData=this.countData.UNTRUSTED; 
       if(this.countData.hasOwnProperty("RECEIVED") && this.eClass!='OP'){
         this.receivedData=this.countData.RECEIVED?this.countData.RECEIVED:'0';
       }
     }     
    })
   }
   
   public data:any=[];
   other:any;
   chart :any= []; 
   
   

resu:any;
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
    this.dataService.getAllTMConnected(postData).subscribe(data=>{
      this.resTm=data;       
      if(this.resTm.statusCode===200){
        for(var i=0;i<this.resTm.data.length;i++){
          if(i!=5){
              this.tmConnectedData.push(this.resTm.data[i]);
            }        
        }      
        if(this.resTm.data.length){
          this.tmDataLength=false;
        }else{
            this.tmDataLength=true;
        }
     }     
    })
}

getAllHeadersData:any=[];
resHeader:any
headerDataLength:boolean=true;
getAllHeadersOfPeid(){
    let postData={
        "peid":this.tempData.peid,
        "email": this.tempData.email,       
        "reqType":this.eClass
      }      
      
     this.dataService.getAllHeadersOfPeid(postData).subscribe(data=>{
      this.resHeader=data;        
       if(this.resHeader.statusCode===200){
           for(var i=0;i<this.resHeader.data.length;i++){
            if(i!=5){
              this.getAllHeadersData.push(this.resHeader.data[i]);
            }            
        }
        if(this.resHeader.data.length){
          this.headerDataLength=false;
        }else{
            this.headerDataLength=true;
        }
       }     
    })
  }


  
  
   link:any=[];
   node:any=[];
   resGraph:any;
    layoutSettings :any= {
    orientation: 'LR',
    nodePadding: 15
  };

  nodeLength:boolean=false;



statusBy:any="sent";
selectStatus:any;
getBySentReceivesStatus(item){  
  this.selectStatus=item;
}

 date:any;
 treeData:any;
 nodeData:any;
 nodeData2:any;
 ngOnInit() {
        this.getNodeData();           
}

getNodeData(){
  var date = new Date();
        var dateFrom=date.setDate(date.getDate() - 7);         
        this.selectFromDate=Math.trunc(dateFrom/1000);
        var dateNew =(((new Date()).getTime()) /1000).toFixed(0);
        this.curentData=parseInt(dateNew);        
        var dateNew =(((new Date()).getTime()) /1000).toFixed(0);
        this.curentData=parseInt(dateNew);
        let postData={
                  "id":this.tempData.peid,
                   "reqType":"Date" ,
                  "from":this.selectFromDate,
                  "to":this.curentData,
                  "eclass":this.eClass
          }
         
        clearTimeout(this.clearSetTimeout);
        this.blockUI.start('Loading...');
        this.pendingRequest=this.dataService.getNodeGraph(postData).subscribe(data=>{
         this.blockUI.stop();
         this.resGraph=data;   
         clearTimeout(this.clearSetTimeout);   
           
         if(this.resGraph.statusCode===200){       
             if(this.resGraph.data.nodeDataArray.length>0&&this.resGraph.data.linkDataArray.length>0){
               this.nodeData=this.resGraph.data;
               
               this.shownodegraph();  // new node graph call
               this.nodeLength=true;                  
          }else{
            this.nodeLength=false;             
          }
         }else if(this.resGraph.statusCode===404){
            this.nodeLength=false;           
         }
       },error => {               
               this.blockUI.stop();          
               this.toastr.error('Not able to connect host, please try again');      
               })
         this.clearSetTimeout = setTimeout(() => {
                    this.pendingRequest.unsubscribe();
                    this.blockUI.stop();
               },60000);
}

fromDate:any;
toDate:any;
selectFromDate:any;
selectToDate:any;
curentData:any;
startTime:any='00:00'             
endTime :any= '23:59';
startObj:any;
toObj:any
getnodeGraphTracing(){
       
      if(!this.fromDate){
        this.toastr.error('please select from date'); 
        return false
      }else if(!this.toDate){
         this.toastr.error('please select to date'); 
        return false
      }else{
             var date = new Date();
             var dateNew =(((new Date()).getTime()) /1000).toFixed(0);
              this.curentData=parseInt(dateNew);
             var newDate = moment(date).format('YYYY-MM-DD');
               if(this.toDate < newDate && this.fromDate<newDate){    
                  this.startObj = moment(this.fromDate + this.startTime, 'YYYY-MM-DDLT');             
                  this.toObj = moment(this.toDate + this.endTime, 'YYYY-MM-DDLT');               // conversion                
                            
                }else if(this.toDate == newDate && this.fromDate<newDate){
                    const CurrTime = Date().slice(16,21);
                    this.startObj = moment(this.fromDate + this.startTime, 'YYYY-MM-DDLT');             
                    this.toObj = moment(this.toDate + CurrTime, 'YYYY-MM-DDLT');               // conversion                  
                   
                }else if(this.fromDate == this.toDate){
                    const CurrTime = Date().slice(16,21);
                     this.startObj = moment(this.fromDate + this.startTime, 'YYYY-MM-DDLT');             
                     this.toObj = moment(this.toDate + CurrTime, 'YYYY-MM-DDLT');               // conversion                                
                }else if(this.fromDate > this.toDate){
                  this.toastr.error('From date should not be greater then to date'); 
                  return false
                }else if(this.toDate > moment(this.curentData).format('YYYY-MM-DD')){
                  this.toastr.error('To date should not be greater then current date'); 
                  return false
                }
                var fromDateTime = this.startObj.format('YYYY-MM-DDTHH:mm');
                var toDateTime   = this.toObj.format('YYYY-MM-DDTHH:mm');
                this.selectFromDate=Date.parse(fromDateTime)/1000;
                this.selectToDate=Date.parse(toDateTime)/1000;
                if(this.selectFromDate>this.selectToDate){
                   this.toastr.error('From date should not be greater then to date'); 
                   return false
                }else if(this.selectFromDate>this.curentData){
                  this.toastr.error('From date should not be greater then current date'); 
                   return false
                }else{
                  let postData={
                      "id":this.tempData.peid,
                      "from":this.selectFromDate,
                      "to":this.selectToDate,
                      "reqType":"Date",
                      "eclass":this.eClass
                  }        
                clearTimeout(this.clearSetTimeout);
                this.blockUI.start('Loading...');            
                this.pendingRequest=this.dataService.getNodeGraph(postData).subscribe(data=>{
                this.blockUI.stop();       
                 clearTimeout(this.clearSetTimeout);       
                this.resGraph={}; 
                this.nodeData="";        
                this.resGraph=data;        
               if(this.resGraph.statusCode===200){       
               if(this.resGraph.data.nodeDataArray.length>0&&this.resGraph.data.linkDataArray.length>0){
                 this.nodeLength=true;
                 this.nodeData=this.resGraph.data;
                 this.shownodegraph();                    
               }else{
                 this.nodeLength=false;             
               }
              }else if(this.resGraph.statusCode===404){
                  this.nodeLength=false;
                  this.nodeData=""; 
                  $("#myDiagramDiv").html("");
                  $("#mySavedModel").html("");
                  clearTimeout(this.clearTimeout);
              }
            },error => {               
                   this.blockUI.stop();          
                   this.toastr.error('Not able to connect host, please try again');      
                   }) 
                 this.clearSetTimeout = setTimeout(() => {
                        this.pendingRequest.unsubscribe();
                        this.blockUI.stop();
                   },60000);

       }
      }
    }

     // ----------------------start Go js functionlity start here--------------------------//

    clearTimeout:any
    shownodegraph(){
        clearTimeout(this.clearTimeout);
        var _self = this;
        var projectDiagramDiv = document.getElementById("myDiagramDiv");
        var projectDiagram = go.Diagram.fromDiv(projectDiagramDiv);
        if(projectDiagram){
              projectDiagram.div = null;
         }
        this.diagram = graph(go.Diagram, "myDiagramDiv", // create a Diagram for the DIV HTML element
            {
                "initialAutoScale": go.Diagram.Uniform, // scale to show all of the contents               
                "initialDocumentSpot": go.Spot.Top,
                "initialViewportSpot": go.Spot.Top,
                "maxSelectionCount": 1, // don't allow users to select more than one thing at a time
                "isReadOnly": true,
                "panningTool.isEnabled": true, // dragable with this
                "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, // for zoom in zoom out
                "toolManager.hoverDelay": 100,
                "undoManager.isEnabled": true,  // use for dragable
                "hasHorizontalScrollbar": true,
                "hasVerticalScrollbar": true,
                "contentAlignment": go.Spot.Center,
                "scale": 1,                
                "ChangedSelection": function onSelectionChanged() {
                  // $('#sharedModal').modal('toggle');
                  
                    var node = _self.diagram.selection.first();
                    if (!(node instanceof go.Node)) {
                        return;
                    }                    
                    var data = node.data;
                    var image = document.getElementById("Image") as HTMLImageElement;
                    var title = document.getElementById("Title");
                    var description = document.getElementById("Description");
                    if (data.imgsrc) {
                        image.src = data.imgsrc;
                        image.alt = data.caption;
                    } else {
                        image.src = "";
                        image.alt = "";
                    }
                    title.textContent = data.text;
                    description.textContent = data.description;
                }, // view additional information
            });
        this.diagram.nodeTemplate =
            graph(go.Node, "Spot", {
                    locationObjectName: "PORT",
                    locationSpot: go.Spot.Center, // location point is the middle top of the PORT
                    linkConnected: _self.updatePortHeight,
                    linkDisconnected: _self.updatePortHeight,
                    toolTip: graph("ToolTip",
                        graph(go.TextBlock, {
                                font: "12pt Helvetica, Arial, sans-serif",
                                textAlign: "center",
                                stroke: "#000000",
                                overflow: go.TextBlock.OverflowEllipsis, 
                                margin:2,
                                alignment: go.Spot.Top,
                                alignmentFocus: go.Spot.Top,
                                wrap: go.TextBlock.WrapFit, 
                                stretch: go.GraphObject.Horizontal
                            },
                            new go.Binding("text", "", function(data) {
                                return data.tooltip?data.tooltip:'NA'
                                 // + ":\n\n" + data.description;
                            }))
                    )
                },
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                // The main element of the Spot panel is a vertical panel housing an optional icon,
                // plus a rectangle that acts as the port

                graph(go.Panel, "Vertical",
                  graph(go.Picture,
                    {
                      name: "Picture",
                      desiredSize: new go.Size(90, 120),
                      // margin: new go.Margin(6, 8, 6, 10),
                    },
                      
                    new go.Binding("source", "icon", function (icon) {                      
                          if (icon) {
                            return "assets/nodeTracing/" + icon + ".png"  
                          }
                          else{
                            //return "assets/nodeTracing/OP.png"
                          }
                          
                        })),

                    //  graph(go.Shape, {
                    //         width: 40,
                    //         height: 0,
                    //         stroke: null,
                    //         strokeWidth: 0,
                    //         fill: "gray"
                    //     },
                    //     new go.Binding("height", "icon", function() {
                    //         return 40;
                    //     }),

                    //     new go.Binding("fill", "color", function(colorname) {
                    //         var Colors: any = {
                    //             "blue": "#3bdbd8",
                    //             "green": "#1FF3AD",                               
                    //             "yellow": "#f08c00"
                    //         }
                    //         var c = Colors[colorname];
                    //         if (c) {
                    //             return c;
                    //         } else {
                    //             return "gray";
                    //         }
                    //     }),

                    //     new go.Binding("geometry", "icon", function(geoname) {
                    //         var Icons = {
                    //             "PE": "",
                    //             "OP": "",                              
                    //             "TM": ""
                    //         };
                    //         Icons.PE ="M19.5975177,9.6835461 L18.8848227,9.32680851 L18.8848227,5.79971631 C18.8848227,5.58617021 18.7755319,5.38822695 18.5940426,5.27539007 L10.3021986,0.0929787234 C10.3021986,0.0929787234 10.1675887,0.000921985816 9.97574468,4.82271508e-05 C9.78390071,-0.00163120567 9.64765957,0.0929787234 9.64765957,0.0929787234 L1.35567376,5.27539007 C1.17425532,5.38822695 1.0648227,5.58617021 1.0648227,5.79971631 L1.0648227,9.32588652 L0.35035461,9.68347518 C0.141134752,9.78851064 0.00836879433,10.0020567 0.00836879433,10.2364539 L0.00836879433,36.6756738 C0.00836879433,36.9334752 0.168085106,37.1635461 0.409432624,37.2546809 L9.75695035,40.76 C9.75695035,40.76 9.8541844,40.798227 9.97397163,40.799078 C10.0938298,40.799078 10.190922,40.76 10.190922,40.76 L19.5376596,37.2546809 C19.7807801,37.1643972 19.9396454,36.9334752 19.9396454,36.6756738 L19.9396454,10.2356738 C19.9396454,10.0021277 19.8076596,9.7877305 19.5975177,9.6835461 Z M4.23765957,37.952695 C4.23765957,38.0204255 4.20375887,38.0829078 4.14907801,38.1219858 C4.11347518,38.145461 4.07269504,38.1585106 4.03099291,38.1585106 C4.00666667,38.1585106 3.98234043,38.1541135 3.95893617,38.145461 L1.60985816,37.2634043 C1.53,37.2339007 1.47617021,37.1566667 1.47617021,37.0707092 L1.47617021,29.251844 C1.47617021,29.1937589 1.50134752,29.136383 1.54560284,29.097305 C1.58992908,29.058227 1.64893617,29.040922 1.7070922,29.0478723 L4.05617021,29.3412766 C4.15950355,29.3543262 4.23673759,29.4411348 4.23673759,29.5453191 L4.23673759,37.952695 L4.23765957,37.952695 Z M8.50609929,39.5525532 C8.50609929,39.6202128 8.47312057,39.682766 8.41751773,39.721844 C8.38276596,39.7452482 8.34198582,39.7591489 8.30035461,39.7591489 C8.27602837,39.7591489 8.25085106,39.7539716 8.22829787,39.7452482 L5.27163121,38.6367376 C5.19092199,38.6063121 5.13794326,38.5299291 5.13794326,38.4431915 L5.13794326,29.7111348 C5.13794326,29.6529787 5.16312057,29.5956738 5.20822695,29.5565957 C5.25255319,29.5175177 5.31156028,29.5001418 5.36971631,29.5070922 L8.32638298,29.8769504 C8.42971631,29.889078 8.50695035,29.9767376 8.50695035,30.08 L8.50695035,39.5525532 L8.50609929,39.5525532 Z M8.50609929,27.712766 C8.50609929,27.7692199 8.48262411,27.8238298 8.44099291,27.8629078 C8.40276596,27.8985106 8.35241135,27.9184397 8.29950355,27.9184397 C8.29510638,27.9184397 8.29078014,27.9184397 8.2864539,27.9184397 L1.66900709,27.5043972 C1.56049645,27.4974468 1.47546099,27.4080851 1.47546099,27.2986525 L1.47546099,23.3897163 C1.47546099,23.2812057 1.55971631,23.191773 1.66900709,23.1848227 L8.2864539,22.7707092 C8.34283688,22.766383 8.39843972,22.7871631 8.44014184,22.8253901 C8.48177305,22.8644681 8.50524823,22.9182979 8.50524823,22.9755319 L8.50524823,27.712695 L8.50609929,27.712695 L8.50609929,27.712766 Z M8.50609929,20.6074468 C8.50609929,20.7116312 8.42886525,20.7992908 8.32638298,20.8123404 L1.70723404,21.6396454 C1.69851064,21.6404965 1.69078014,21.6413475 1.68205674,21.6413475 C1.63255319,21.6413475 1.58397163,21.6231206 1.54574468,21.5883688 C1.50148936,21.5492908 1.47631206,21.4937589 1.47631206,21.4338298 L1.47631206,17.5257447 C1.47631206,17.4311348 1.54056738,17.3486525 1.63255319,17.3252482 L8.25,15.6706383 C8.31163121,15.6550355 8.37673759,15.6689362 8.4270922,15.7079433 C8.47744681,15.7469504 8.50609929,15.8069504 8.50609929,15.8711348 L8.50609929,20.6074468 Z M8.50609929,13.5039716 C8.50609929,13.5942553 8.44794326,13.6741135 8.36113475,13.7009929 L1.74283688,15.7696454 C1.72283688,15.7756738 1.70205674,15.7792199 1.68120567,15.7792199 C1.63780142,15.7792199 1.59439716,15.7653191 1.55879433,15.7392908 C1.5058156,15.7002128 1.47460993,15.6385816 1.47460993,15.5734752 L1.47460993,11.663617 C1.47460993,11.5819858 1.52326241,11.507305 1.59787234,11.4752482 L8.21609929,8.58021277 C8.27950355,8.55241135 8.35326241,8.55851064 8.41141844,8.59666667 C8.46957447,8.63489362 8.50432624,8.7 8.50432624,8.76943262 L8.50432624,13.5039716 L8.50609929,13.5039716 L8.50609929,13.5039716 Z M9.35680851,5.17992908 L2.30099291,8.70787234 L2.30099291,6.14177305 L9.35680851,1.73191489 L9.35680851,5.17992908 Z M10.5929078,1.73184397 L17.6478723,6.14170213 L17.6478723,8.70780142 L10.5929078,5.17992908 L10.5929078,1.73184397 L10.5929078,1.73184397 Z M18.4716312,33.1626241 C18.4716312,33.257234 18.4073759,33.3387943 18.3153901,33.3631206 L11.6980142,35.0168085 C11.6815603,35.0212057 11.6650355,35.0229078 11.6493617,35.0229078 C11.6034043,35.0229078 11.558227,35.007234 11.5208511,34.9795035 C11.4697163,34.9404255 11.4419149,34.8804965 11.4419149,34.8180851 L11.4419149,30.080922 C11.4419149,29.9775887 11.5192199,29.889078 11.6207092,29.8778014 L18.2398582,29.0504965 C18.297234,29.041844 18.3570213,29.060922 18.4021986,29.1 C18.4455319,29.139078 18.4707801,29.1955319 18.4707801,29.254539 L18.4707801,33.1626241 L18.4716312,33.1626241 L18.4716312,33.1626241 Z M18.4716312,27.2986525 C18.4716312,27.4080851 18.3865957,27.4975177 18.2780851,27.5043972 L11.6615603,27.9184397 C11.6571631,27.9184397 11.6519858,27.9184397 11.6493617,27.9184397 C11.595461,27.9184397 11.5451773,27.8985106 11.5060993,27.8629078 C11.4652482,27.8238298 11.4426241,27.77 11.4426241,27.712766 L11.4426241,22.9765248 C11.4426241,22.9192199 11.4651773,22.8653901 11.5060993,22.8263121 C11.5486525,22.787234 11.6041844,22.767305 11.6614894,22.7716312 L18.2780142,23.1856738 C18.3864539,23.192695 18.4715603,23.2820567 18.4715603,23.3905674 L18.4715603,27.2986525 L18.4716312,27.2986525 Z M18.4716312,21.4347518 C18.4716312,21.4937589 18.4465248,21.5502128 18.4030496,21.5892908 C18.3658156,21.6231915 18.3153901,21.6421986 18.2667376,21.6421986 C18.258156,21.6421986 18.2502837,21.6413475 18.2416312,21.6404965 L11.6224823,20.8132624 C11.5207801,20.7993617 11.4436879,20.7125532 11.4436879,20.6083688 L11.4436879,15.8729787 C11.4436879,15.8095745 11.4714184,15.7497163 11.5226241,15.7097872 C11.5720567,15.6707092 11.6380142,15.6568085 11.6987943,15.6724823 L18.3161702,17.3270922 C18.407305,17.3496454 18.4725532,17.4329787 18.4725532,17.5276596 L18.4725532,21.4348936 L18.4716312,21.4348936 L18.4716312,21.4347518 Z M18.4716312,15.5726241 C18.4716312,15.6377305 18.4412766,15.6993617 18.3883688,15.7383688 C18.352766,15.7643972 18.3092908,15.7782979 18.2658865,15.7782979 C18.2459574,15.7782979 18.2241844,15.7748227 18.2051064,15.7687234 L11.5859574,13.700922 C11.500922,13.6740426 11.442695,13.5941844 11.442695,13.5039007 L11.442695,8.76758865 C11.442695,8.69815603 11.4782979,8.63304965 11.5348227,8.5948227 C11.5928369,8.55659574 11.6666667,8.55056738 11.7301418,8.57836879 L18.3475177,11.4734043 C18.4239716,11.506383 18.4716312,11.5801418 18.4716312,11.661773 L18.4716312,15.5726241 L18.4716312,15.5726241 Z";
                    //         Icons.OP ="M12.0105455,9.87963636 C12.0105455,8.75236364 11.0970909,7.83927273 9.96981818,7.83927273 C8.84254545,7.83927273 7.92981818,8.75236364 7.92981818,9.87963636 C7.92981818,10.5345455 8.24290909,11.1090909 8.72327273,11.4829091 L5.71636364,24.3036364 L14.2287273,24.3036364 L11.2210909,11.4829091 C11.6970909,11.1090909 12.0105455,10.5345455 12.0105455,9.87963636 Z M11.2076364,18.8756364 L9.17672727,18.8756364 L10.8145455,17.1992727 L11.2076364,18.8756364 Z M9.96981818,13.6 L10.4927273,15.828 L9.44727273,15.828 L9.96981818,13.6 Z M9.248,16.6774545 L10.1858182,16.6774545 L8.95236364,17.9407273 L9.248,16.6774545 Z M7.85854545,22.6050909 L8.53345455,19.7232727 L10.7712727,19.7232727 L7.95818182,22.6050909 L7.85854545,22.6050909 Z M11.5047273,20.14 L12.0821818,22.604 L9.09781818,22.604 L11.5047273,20.14 Z M19.8509091,9.87963636 C19.8509091,12.5185455 18.8232727,14.9996364 16.9578182,16.8669091 C16.7934545,17.0327273 16.5741818,17.1170909 16.3570909,17.1170909 C16.14,17.1170909 15.9225455,17.0327273 15.7567273,16.8669091 C15.4250909,16.5349091 15.4250909,15.9989091 15.7567273,15.6672727 C17.3014545,14.1210909 18.1523636,12.0658182 18.1523636,9.88109091 C18.1523636,5.36909091 14.4829091,1.69890909 9.97054545,1.69890909 C5.45781818,1.69890909 1.78872727,5.36945455 1.78872727,9.88109091 C1.78872727,12.0654545 2.64,14.1192727 4.18545455,15.6665455 C4.51781818,15.9989091 4.51781818,16.5349091 4.18545455,16.8669091 C3.85236364,17.1992727 3.31672727,17.1992727 2.98436364,16.8669091 C1.11745455,15.0029091 0.0898181818,12.5210909 0.0898181818,9.88145455 C0.0894545455,4.43309091 4.52218182,0 9.96981818,0 C15.4174545,0 19.8509091,4.43163636 19.8509091,9.87963636 Z M12.8709091,12.7803636 C13.6458182,12.0061818 14.0730909,10.976 14.0730909,9.87927273 C14.0730909,7.61709091 12.2323636,5.77672727 9.97018182,5.77672727 C7.708,5.77672727 5.86763636,7.61745455 5.86763636,9.87927273 C5.86763636,10.976 6.29454545,12.0061818 7.06945455,12.7803636 C7.40254545,13.1123636 7.40254545,13.6490909 7.06945455,13.9818182 C6.73636364,14.3134545 6.20145455,14.3134545 5.86836364,13.9818182 C4.77272727,12.8865455 4.16872727,11.4294545 4.16872727,9.87963636 C4.16872727,6.68 6.76945455,4.07818182 9.97018182,4.07818182 C13.1701818,4.07818182 15.7716364,6.68 15.7716364,9.87963636 C15.7716364,11.4294545 15.168,12.8869091 14.072,13.9818182 C13.9061818,14.1465455 13.6887273,14.2305455 13.4716364,14.2305455 C13.2545455,14.2305455 13.0363636,14.1469091 12.8712727,13.9818182 C12.5378182,13.6498182 12.5378182,13.1109091 12.8709091,12.7803636 Z"
                    //         Icons.TM ="M18.4375,9.06625 L18.4375,8.4375 C18.4375,6.18375 17.5598437,4.06492188 15.9662109,2.47128906 C14.3725781,0.87765625 12.25375,0 10,0 C7.74625,0 5.62742188,0.87765625 4.03378906,2.47128906 C2.44015625,4.06492187 1.5625,6.18375 1.5625,8.4375 L1.5625,9.06625 C0.661835938,9.32203125 0,10.1512891 0,11.1328125 L0,14.2578125 C0,15.4424609 0.963789062,16.40625 2.1484375,16.40625 L4.4921875,16.40625 C4.81578125,16.40625 5.078125,16.1439063 5.078125,15.8203125 L5.078125,8.4375 C5.078125,5.72355469 7.28605469,3.515625 10,3.515625 C12.7139453,3.515625 14.921875,5.72355469 14.921875,8.4375 L14.921875,15.8203125 C14.921875,16.1439063 15.1842187,16.40625 15.5078125,16.40625 L16.484375,16.40625 L16.484375,17.0703125 C16.484375,17.3933984 16.2215234,17.65625 15.8984375,17.65625 L12.0476563,17.65625 C11.8057813,16.9742578 11.1544922,16.484375 10.390625,16.484375 L9.609375,16.484375 C8.64011719,16.484375 7.8515625,17.2729297 7.8515625,18.2421875 C7.8515625,19.2114453 8.64011719,20 9.609375,20 L10.390625,20 C11.1544922,20 11.8057813,19.5101172 12.0476563,18.828125 L15.8984375,18.828125 C16.8676953,18.828125 17.65625,18.0395703 17.65625,17.0703125 L17.65625,16.40625 L17.8515625,16.40625 C19.0362109,16.40625 20,15.4424609 20,14.2578125 L20,11.1328125 C20,10.1512891 19.3381641,9.32203125 18.4375,9.06625 Z M10.390625,18.828125 L9.609375,18.828125 C9.28628906,18.828125 9.0234375,18.5652734 9.0234375,18.2421875 C9.0234375,17.9191016 9.28628906,17.65625 9.609375,17.65625 L10.390625,17.65625 C10.7137109,17.65625 10.9765625,17.9191016 10.9765625,18.2421875 C10.9765625,18.5652734 10.7137109,18.828125 10.390625,18.828125 Z M3.90625,15.234375 L2.1484375,15.234375 C1.60996094,15.234375 1.171875,14.7962891 1.171875,14.2578125 L1.171875,11.1328125 C1.171875,10.5943359 1.60996094,10.15625 2.1484375,10.15625 L3.90625,10.15625 L3.90625,15.234375 Z M10,2.34375 C6.63988281,2.34375 3.90625,5.07738281 3.90625,8.4375 L3.90625,8.984375 L2.734375,8.984375 L2.734375,8.4375 C2.734375,4.43121094 5.99371094,1.171875 10,1.171875 C14.0062891,1.171875 17.265625,4.43121094 17.265625,8.4375 L17.265625,8.984375 L16.09375,8.984375 L16.09375,8.4375 C16.09375,5.07738281 13.3601172,2.34375 10,2.34375 Z M18.828125,14.2578125 C18.828125,14.7962891 18.3900391,15.234375 17.8515625,15.234375 L16.09375,15.234375 L16.09375,10.15625 L17.8515625,10.15625 C18.3900391,10.15625 18.828125,10.5943359 18.828125,11.1328125 L18.828125,14.2578125 Z";
                            
                    //         var geo = Icons[geoname];
                    //         if (typeof geo === "string") {
                    //             geo = Icons[geoname] = go.Geometry.parse(geo, true);
                    //         }
                    //         return geo;
                    //     })
                    //    ),
                    graph(go.Shape, {
                            name: "PORT",
                            width: 100,
                            height: 0,
                            margin: new go.Margin(-1, 0, 0, 0),
                            stroke: null,
                            strokeWidth: 0,
                            fill: "gray",
                            portId: "",
                            fromLinkable: true,
                            toLinkable: true
                        },
                        new go.Binding("fill", "color", function(colorname) {
                            var Colors: any = {
                                "blue": "#3bdbd8",
                                "green": "#1FF3AD",                               
                                "yellow": "#f08c00"
                            }
                            var c = Colors[colorname];
                            if (c) {
                                return c;
                            } else {
                                return "gray";
                            }
                        })
                        ),
                    graph(go.TextBlock, {
                            font: "Bold 22px Lato, sans-serif", // increase text size from here
                            textAlign: "center",
                            margin: 10,
                            maxSize: new go.Size(260, NaN),
                            alignment: go.Spot.Top,
                            alignmentFocus: go.Spot.Bottom,
                            editable: true
                        },
                        // new go.Binding("text").makeTwoWay())
                        new go.Binding("text", "", function(data) {
                                return data.text  + "\n" + data.key;
                            }))
                )
            );
        this.diagram.linkTemplate =
            graph(go.Link, {
                    layerName: "Background",
                    routing: go.Link.AvoidsNodes,
                    corner: 18,                    
                    curve: go.Link.JumpOver,
                    reshapable: true,
                    resegmentable: true,
                    fromSpot: go.Spot.RightSide,
                    toSpot: go.Spot.LeftSide,
                },
                // make sure links come in from the proper direction and go out appropriately
                  new go.Binding("fromSpot", "fromSpot", go.Spot.parse),
                   new go.Binding("toSpot", "toSpot", go.Spot.parse),
                   new go.Binding("points").makeTwoWay(),
                  
                // mark each Shape to get the link geometry with isPanelMain: true
                graph(go.Shape, {
                        isPanelMain: true,
                        stroke: "gray", // change path color here
                        strokeWidth: 20
                    },
                    // get the default stroke color from the fromNode
                    new go.Binding("stroke", "fromNode", function(n) {
                        var Colors: any = {
                            "blue": "#3bdbd8",
                            "green": "#1FF3AD",                               
                            "yellow": "#f08c00"
                        }                        
                        return go.Brush.lighten((n && Colors[n.data.color]) || "gray");
                    }).ofObject(),
                    // but use the link's data.color if it is set
                    new go.Binding("stroke", "color", function(colorname) {
                        var _self = this;
                        var c = _self.Colors[colorname];
                        if (c) {
                            return c;
                        } else {
                            return "gray";
                        }
                    })),
                graph(go.Shape, {
                    isPanelMain: true,
                    stroke: "white",
                    strokeWidth: 4,
                    name: "PIPE",
                    strokeDashArray: [25, 40]
                })
            );

        var SpotNames = ["Top", "Left", "Right", "Bottom", "TopSide", "LeftSide", "RightSide", "BottomSide"]; 
        this.diagram.model = go.Model.fromJson(this.nodeData);         
        this.loop(); // animate some flow through the pipes
    }

  
    updatePortHeight(node, link, port) {
        var sideinputs = 0;
        var sideoutputs = 0;
        node.findLinksConnected().each(function(l) {
            if (l.toNode === node && l.toSpot === go.Spot.Left) sideinputs++;
            if (l.fromNode === node && l.fromSpot === go.Spot.Right) sideoutputs++;
        });
        var tot = Math.max(sideinputs, sideoutputs);
        tot = Math.max(1, Math.min(tot, 2));
        port.height = tot * (20 + 2) + 2; // where 10 is the link path's strokeWidth
    }
  
    loop() {
        var down = true
        var opacity = 1;
        var diagram = this.diagram;
        var thiss = this
        this.clearTimeout=setTimeout(function() {
            var oldskips = diagram.skipsUndoManager;
            diagram.skipsUndoManager = true;
            diagram.links.each(function(link) {
                var shape;              
                shape = link.findObject("PIPE");
                var off = shape.strokeDashOffset - 3;                
                // animate (move) the stroke dash
                shape.strokeDashOffset = (off <= 0) ? 60 : off;
                // animte (strobe) the opacity:
                if (down) {
                    opacity = opacity - 0.01;
                } else {
                    opacity = opacity + 0.003;
                }
                if (opacity <= 0) {
                    down = !down;
                    opacity = 0;
                }
                if (opacity > 1) {
                    down = !down;
                    opacity = 1;
                }
                opacity = opacity;
            });
            diagram.skipsUndoManager = oldskips;
            thiss.loop();
        }, 60);
    }

  respa:any;
  msgDetails:any=[];
  imsgid:any
  aparty:any;
  bparty:any;
  tTime:any;
  msgStatus:any;
    viewKeys(item:any){
    
      let postData={
          "peid":this.tempData.peid,
          "email": this.tempData.email,
          "imsgid": item.imsgid
        }      
          $('#sharedModal').modal('toggle');
        this.blockUI.start('Loading...');
        this.dataService.getMessage(postData).subscribe(res=>{
        this.blockUI.stop();
        
        this.respa=res;
          if(this.respa.statusCode===200){
            this.msgDetails=this.respa.data;        
            if(this.msgDetails.length){
               this.imsgid=this.msgDetails[0].imsgid;               
               if(this.eClass==='TM'){
                 if(this.msgDetails[0].isEncrypt==1){
                     this.aparty=this.msgDetails[0].aparty;
                     this.bparty=this.msgDetails[0].bparty;  
                   }else{
                     this.aparty=hex2ascii(this.msgDetails[0].aparty);
                     this.bparty=hex2ascii(this.msgDetails[0].bparty);
                   }                
               }else if(this.eClass!='TM'){
                  // if(this.msgDetails[0].isEncrypt==1){
                     this.aparty=hex2ascii(this.msgDetails[0].aparty);
                     this.bparty=hex2ascii(this.msgDetails[0].bparty);
                   // }else{
                   //     this.aparty=this.msgDetails[0].aparty;
                   //     this.bparty=this.msgDetails[0].bparty; 
                   // }
               }

               this.imsgid=this.msgDetails[0].imsgid;
               this.tTime=this.msgDetails[0].tTime;
               this.msgStatus=this.msgDetails[0].status;
             
             }
          }
        })  
        this.getGraphByMsgId(item.imsgid); 
     }
  nodeDataLength:boolean=false
  getGraphByMsgId(imsgid:any){
      let postData={                  
                   "id": this.tempData.peid,
                   "reqType": "MsgId" ,
                   "imsgid": imsgid              
              }        
              clearTimeout(this.clearSetTimeout);
        this.blockUI.start('Loading...');
        this.pendingRequest=this.dataService.getGraphByMsgId(postData).subscribe(data=>{
         this.blockUI.stop();         
         this.resGraph={}; 
         clearTimeout(this.clearSetTimeout);   
         this.resGraph=data;        
         if(this.resGraph.statusCode===200){       
           if(this.resGraph.data.nodeDataArray.length>0&&this.resGraph.data.linkDataArray.length>0){
            this.nodeDataLength=true;
            this.nodeData2=this.resGraph.data;            
            this.shownodegraph2();                   
          }else{
            this.nodeDataLength=false;             
          }
         }else if(this.resGraph.statusCode===404){
           this.nodeDataLength=false;  
           this.nodeData2=""; 
           $("#myDiagramDiv2").html("");
           $("#mySavedModel2").html("");
           clearTimeout(this.clearTimeout2);        
         }
       },error => {               
               this.blockUI.stop();          
               this.toastr.error('Not able to connect host, please try again');      
               })
         this.clearSetTimeout = setTimeout(() => {
                    this.pendingRequest.unsubscribe();
                    this.blockUI.stop();
               },60000);
    }

 // ----------------------start Go js functionlity start here--------------------------//

    clearTimeout2:any
    shownodegraph2(){
        clearTimeout(this.clearTimeout2);
        var _self = this;
        var projectDiagramDiv1 = document.getElementById("myDiagramDiv2");   //variable name change by Ajeet
        var projectDiagram2 = go.Diagram.fromDiv(projectDiagramDiv1);
        if(projectDiagram2){
              projectDiagram2.div = null;
         }
        this.diagram2 = graph(go.Diagram, "myDiagramDiv2", // create a Diagram for the DIV HTML element
            {
                "initialAutoScale": go.Diagram.Uniform, // scale to show all of the contents               
                "initialDocumentSpot": go.Spot.Top,
                "initialViewportSpot": go.Spot.Top,
                "maxSelectionCount": 1, // don't allow users to select more than one thing at a time
                "isReadOnly": true,
                "panningTool.isEnabled": true, // dragable with this
                "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, // for zoom in zoom out
                "toolManager.hoverDelay": 100,
                "undoManager.isEnabled": true,  // use for dragable
                "hasHorizontalScrollbar": true,
                "hasVerticalScrollbar": true,
                "contentAlignment": go.Spot.Center,
                "scale": 1,                
                "ChangedSelection": function onSelectionChanged() {
                  // $('#sharedModal').modal('toggle');
                  
                    var node = _self.diagram2.selection.first();
                    if (!(node instanceof go.Node)) {
                        return;
                    }                    
                    var data = node.data;
                    var image = document.getElementById("Image") as HTMLImageElement;
                    var title = document.getElementById("Title");
                    var description = document.getElementById("Description");
                    if (data.imgsrc) {
                        image.src = data.imgsrc;
                        image.alt = data.caption;
                    } else {
                        image.src = "";
                        image.alt = "";
                    }
                    title.textContent = data.text;
                    description.textContent = data.description;
                }, // view additional information
            });
        this.diagram2.nodeTemplate =
            graph(go.Node, "Spot", {
                    locationObjectName: "PORT",
                    locationSpot: go.Spot.Top, // location point is the middle top of the PORT
                    linkConnected: _self.updatePortHeight2,
                    linkDisconnected: _self.updatePortHeight2,
                    toolTip: graph("ToolTip",
                        graph(go.TextBlock, {
                                font: "12pt Helvetica, Arial, sans-serif",
                                textAlign: "center",
                                stroke: "#000000",
                                overflow: go.TextBlock.OverflowEllipsis, 
                                margin:2,
                                alignment: go.Spot.Top,
                                alignmentFocus: go.Spot.Top,
                                wrap: go.TextBlock.WrapFit, 
                                stretch: go.GraphObject.Horizontal
                            },
                            new go.Binding("text", "", function(data) {
                                return data.tooltip?data.tooltip:'NA'
                                 // + ":\n\n" + data.description;
                            }))
                    )
                },
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                // The main element of the Spot panel is a vertical panel housing an optional icon,
                // plus a rectangle that acts as the port

                graph(go.Panel, "Vertical",
                  graph(go.Picture,
                    {
                      name: "Picture",
                      desiredSize: new go.Size(140, 200),
                      // margin: new go.Margin(6, 8, 6, 10),
                    },
                      
                    new go.Binding("source", "icon", function (icon) {                      
                          if (icon) {
                            return "assets/nodeTracing/" + icon + ".png"  
                          }
                          else{
                           // return "assets/nodeTracing/OP.jpg"
                          }
                          
                        })),
                    
                    graph(go.Shape, {
                            name: "PORT",
                            width: 140,
                            height: 24,
                            margin: new go.Margin(-1, 0, 0, 0),
                            stroke: null,
                            strokeWidth: 0,
                            fill: "gray",
                            portId: "",
                            fromLinkable: true,
                            toLinkable: true
                        },
                        new go.Binding("fill", "color", function(colorname) {
                            var Colors: any = {
                                "blue": "#3bdbd8",
                                "green": "#1FF3AD",                               
                                "yellow": "#f08c00"
                            }
                            var c = Colors[colorname];
                            if (c) {
                                return c;
                            } else {
                                return "gray";
                            }
                        })
                        ),
                    graph(go.TextBlock, {
                            font: "Bold 35px Lato, sans-serif",
                            textAlign: "center",
                            margin: 10,
                            maxSize: new go.Size(410, NaN),
                            alignment: go.Spot.Top,
                            alignmentFocus: go.Spot.Bottom,
                            editable: true
                        },
                        // new go.Binding("text").makeTwoWay())
                        new go.Binding("text", "", function(data) {
                                return data.text  + "\n" + data.key;
                            }))
                )
            );
        this.diagram2.linkTemplate =
            graph(go.Link, {
                    layerName: "Background",
                    routing: go.Link.Orthogonal,
                    corner: 18,
                    reshapable: true,
                    resegmentable: true,
                    // fromSpot: go.Spot.RightSide,
                    // toSpot: go.Spot.LeftSide,
                },
                // make sure links come in from the proper direction and go out appropriately
                 new go.Binding("fromSpot", "fromSpot", go.Spot.parse),
                 new go.Binding("toSpot", "toSpot", go.Spot.parse),
                  // new go.Binding("points").makeTwoWay(),
                // mark each Shape to get the link geometry with isPanelMain: true
                graph(go.Shape, {
                        isPanelMain: true,
                        stroke: "gray", // change path color here
                        strokeWidth: 28
                    },
                    // get the default stroke color from the fromNode
                    new go.Binding("stroke", "fromNode", function(n) {
                        var Colors: any = {
                            "blue": "#3bdbd8",
                            "green": "#1FF3AD",                               
                            "yellow": "#f08c00"
                        }                        
                        return go.Brush.lighten((n && Colors[n.data.color]) || "gray");
                    }).ofObject(),
                    // but use the link's data.color if it is set
                    new go.Binding("stroke", "color", function(colorname) {
                        var _self = this;
                        var c = _self.Colors[colorname];
                        if (c) {
                            return c;
                        } else {
                            return "gray";
                        }
                    })),
                graph(go.Shape, {
                    isPanelMain: true,
                    stroke: "white",
                    strokeWidth: 5,
                    name: "PIPE",
                    strokeDashArray: [35, 55]
                })
            );

        var SpotNames = ["Top", "Left", "Right", "Bottom", "TopSide", "LeftSide", "RightSide", "BottomSide"];
         
    
             
        this.diagram2.model = go.Model.fromJson(this.nodeData2);
         
        this.loop2(); // animate some flow through the pipes
    }

  
    updatePortHeight2(node, link, port) {
        var sideinputs = 0;
        var sideoutputs = 0;
        node.findLinksConnected().each(function(l) {
            if (l.toNode === node && l.toSpot === go.Spot.LeftSide) sideinputs++;
            if (l.fromNode === node && l.fromSpot === go.Spot.RightSide) sideoutputs++;
        });
        var tot = Math.max(sideinputs, sideoutputs);
        tot = Math.max(1, Math.min(tot, 2));
        port.height = tot * (30 + 2) + 2; // where 10 is the link path's strokeWidth
    }
  
    loop2() {
        var down = true
        var opacity = 1;
        var diagram = this.diagram2;
        var thiss = this
        this.clearTimeout2=setTimeout(function() {
            var oldskips = diagram.skipsUndoManager;
            diagram.skipsUndoManager = true;
            diagram.links.each(function(link) {
                var shape;              
                shape = link.findObject("PIPE");
                var off = shape.strokeDashOffset - 3;                
                // animate (move) the stroke dash
                shape.strokeDashOffset = (off <= 0) ? 60 : off;
                // animte (strobe) the opacity:
                if (down) {
                    opacity = opacity - 0.01;
                } else {
                    opacity = opacity + 0.003;
                }
                if (opacity <= 0) {
                    down = !down;
                    opacity = 0;
                }
                if (opacity > 1) {
                    down = !down;
                    opacity = 1;
                }
                opacity = opacity;
            });
            diagram.skipsUndoManager = oldskips;
            thiss.loop2();
        }, 60);
    }



     close(){
         $("#myDiagramDiv2").html("");
         $("#mySavedModel2").html("");
         this.nodeData2=[];     
         clearTimeout(this.clearTimeout2);        
    }


}
