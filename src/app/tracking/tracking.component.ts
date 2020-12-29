import { Component,EventEmitter,OnInit,Input,Output,ViewEncapsulation } from '@angular/core';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstant } from '../globalconstant';
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router,ActivatedRoute} from  '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CustomValidators } from '../validators';
declare var $;
import { MessageService } from '../messageservice.service';
import * as Chartist from 'chartist';
import { hex2ascii } from 'hex2ascii';
import * as d3 from "d3";
import { HierarchyPointNode } from "d3";
export const margin = { top: 20, right: 120, bottom: 20, left: 205 };
export const width = 960 - margin.right - margin.left;
export const height = 800 - margin.top - margin.bottom;


// ---------------------------Start Go js Start Here-----------------------//
import * as go from 'gojs';
const graph = go.GraphObject.make;
declare var $;

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TrackingComponent implements OnInit {
 @BlockUI() blockUI: NgBlockUI; 
  temperDetails:any;
  clearSetTimeout:any;
  pendingRequest:any;
  res:any;
  messageData:any=[];
  emailId:any;
  itemsPerPage: any = 25;
  dataLength: boolean = true;
  page: number = 1;
  messagecount:any;
  searchKey:any;
  resp:any;
  tempData:any;
  shoInfo:boolean=false;
  public status:any="all";
  resGraph:any;
  nodeLength:boolean=false;
  treeData:any;
  private svg;
  private treeLayout;
  private root;
  private tooltip;
  eClass:any;


  // ---------------------------Start Go js Start Here-----------------------//
    public diagram: go.Diagram = null;
    public model: go.Model;
    public geo: any;
    public opacity: any = 1;

   constructor( 
     private data:ApiIntegrationService,
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
                
      }

// get total count
  getcount(status){
      let postData={
        "peid":this.tempData.peid,
        "email": this.tempData.email,
        "status": status
      } 
      if(status === "all"){
        delete postData["status"];
      } 
      clearTimeout(this.clearSetTimeout);
     this.blockUI.start('Loading...');
     this.pendingRequest=this.data.getAllMessagesCountByStatus(postData).subscribe(data=>{
     clearTimeout(this.clearSetTimeout);    
     this.blockUI.stop();  
     this.messagecount=0;
       
      this.resp=data;   
       if(this.resp.statusCode===200){       
         this.messagecount=this.resp.data;          
         this.getAllMessagesByStatus();     
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

  
  isSearch:any;
  searchresult(serachKey,item){
    if(item==="msisdn" && serachKey==''){
      this.getAllMessagesByStatus();
       this.shoInfo = false;
    }else if(item==="senderId" && serachKey==''){
      this.getAllMessagesByStatus();
       this.shoInfo = false;
    }        
  }

msisdn:any;
date:any;
senderId:any;
selectedDate:any;


newmsisdn:any;
newsenderId:any;
searchMessage(){
  
   if(!this.msisdn&&!this.date&&!this.senderId){
     this.getAllMessagesByStatus();
   }else{
       this.selectedDate=Date.parse(this.date)/1000;
       var curentData =(((new Date()).getTime()) /1000).toFixed(0);
       var dateNew=parseInt(curentData);
       if(this.selectedDate>dateNew){
          this.toastr.error('selected date should not be greater then current date.'); 
          return false;
        }          
         if(this.msisdn &&!this.senderId){
           this.newmsisdn=this.ascii2hexMsisdn(this.msisdn);
         }else if(!this.msisdn&&this.senderId){
            this.newsenderId=this.ascii2hexSnederId(this.senderId);
          }else if(this.msisdn && this.senderId){
           this.newmsisdn=this.ascii2hexMsisdn(this.msisdn);
           this.newsenderId=this.ascii2hexSnederId(this.senderId);
          }
       
       
        this.page=1;
        this.itemsPerPage=25;

        this.shoInfo=true;
        this.getAllMessagesByStatus();
   }
}
ascii2hexMsisdn(str)
  {
  var arr1 = [];
  for (var n = 0, l = str.length; n < l; n ++) 
     {
    var hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex);
   }
  return arr1.join('');
   }

  ascii2hexSnederId(stri)
  {
  var arr2 = [];
  for (var n = 0, l = stri.length; n < l; n ++) 
     {
    var hex2 = Number(stri.charCodeAt(n)).toString(16);
    arr2.push(hex2);
   }
  return arr2.join('');
   }
respData:any=[];
getAllMessagesByStatus(){ 

   let postData = {
      "peid":this.tempData.peid,
      "email": this.tempData.email,
      "reqType":this.eClass,
      "status": this.status,
      "page":   this.page,
      "count": this.itemsPerPage,
      "msisdn": this.newmsisdn,   
      "aparty": this.newsenderId,
      "date":  this.selectedDate
     } 
     if(this.eClass=="TM"){
           postData["msgtype"] = this.statusBy
          }  
     if(this.status==="all"){
       delete postData["status"];
     }  if(!this.msisdn){
        delete postData["msisdn"];
     } if(!this.date){
       delete postData["date"];
     } if(!this.senderId){
        delete postData["aparty"];
     }    
    clearTimeout(this.clearSetTimeout);
    this.blockUI.start('Loading...');
    this.pendingRequest=this.data.getAllMessagesByStatus(postData).subscribe(res=>{
    clearTimeout(this.clearSetTimeout);      
    this.blockUI.stop();    
    this.messageData=[];
    this.respData=[];
    this.messagecount=0;    
    this.res=res;    
    if(this.res.statusCode==200){    
       this.respData=this.res.data; 
        for(var i=0;i<this.respData.length;i++){
           if(this.eClass=='TM'){
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
       this.messagecount=this.res.count; 
       if(this.messageData.length){
          this.dataLength = false;
        }else{
          this.dataLength = true;
        }
     } else{
       this.dataLength = true;
       // this.toastr.error(this.res.message); 
     }
    },error => {               
              this.blockUI.stop();  
              this.shoInfo=false;       
              this.toastr.error('Not able to connect host, please try again');      
              })        
              this.clearSetTimeout = setTimeout(() => {
                this.shoInfo=false;
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
    this.getAllMessagesByStatus();  

  }

  changeStatus2(status){
    this.page = 1;
    this.itemsPerPage = 25;
    this.statusBy = status;
    this.getcount(status);
  }
statusBy:any="sent";
selectStatus:any;
getBySentReceivesStatus(item){
  
  this.selectStatus=item;
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
      this.blockUI.start('Loading...');
      
      $('#sharedModal').modal('toggle');
      this.data.getMessage(postData).subscribe(res=>{
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


  ngOnInit(){
     this.getcount(this.status);
          $(document).ready(function(){
           $('[data-toggle="tooltip"]').tooltip();   
        });
  }




nodeDataLength:boolean=false;
getGraphByMsgId(imsgid:any){
      let postData={                  
                   "id": this.tempData.peid,
                   "reqType": "MsgId" ,
                   "imsgid": imsgid              
              }        
              clearTimeout(this.clearSetTimeout);
        this.blockUI.start('Loading...');
        this.pendingRequest=this.data.getGraphByMsgId(postData).subscribe(data=>{
         this.blockUI.stop();         
         this.resGraph={}; 
         clearTimeout(this.clearSetTimeout);   
         this.resGraph=data;        
         if(this.resGraph.statusCode===200){       
           if(this.resGraph.data.nodeDataArray.length>0&&this.resGraph.data.linkDataArray.length>0){
            this.nodeDataLength=true;
            this.nodeData=this.resGraph.data;            
            this.shownodegraph();                   
          }else{
            this.nodeDataLength=false;             
          }
         }else if(this.resGraph.statusCode===404){
           this.nodeDataLength=true;   
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


    close(){
      $("#myDiagramDiv").html("");
      $("#mySavedModel").html("");
          clearTimeout(this.clearTimeout);
     // this.svg.selectAll("*").remove();    
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
                    locationSpot: go.Spot.Top, // location point is the middle top of the PORT
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
                      desiredSize: new go.Size(140, 200),
                      // margin: new go.Margin(6, 8, 6, 10),
                    },
                      
                    new go.Binding("source", "icon", function (icon) {                      
                          if (icon) {
                            return "assets/nodeTracing/" + icon + ".png"  
                          }
                          else{
                         //   return "assets/nodeTracing/OP.jpg"
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
        this.diagram.linkTemplate =
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
         
    
             
        this.diagram.model = go.Model.fromJson(this.nodeData);
         
        this.loop(); // animate some flow through the pipes
    }

  
    updatePortHeight(node, link, port) {
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





public nodeData:any=   {
    "nodeDataArray": [
      {
        "key": "13014390409590",
        "tooltip": "SENT:9\nDELIVERED:3\nFAILED:4\nUNTRUSTED:0",
        "level": 1,
        "eclass": "PE",
        "pos": "-300 100",
        "icon": "PE",
        "color": "blue",
        "imgsrc": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/BarnettShaleDrilling-9323.jpg/256px-BarnettShaleDrilling-9323.jpg",
        "text": "Entity",
        "x": -300,
        "y": 100
      },
      {
        "key": "13028493489589",
        "eclass": "TM",
        "level": 2,
        "tooltip": "SENT:9\n RECEIVED:9 \n DELIVERED:3 \n FAILED:5\nUNTRUSTED:0",
        "pos": "-100 100",
        "icon": "TM",
        "color": "orange",
        "imgsrc": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/BarnettShaleDrilling-9323.jpg/256px-BarnettShaleDrilling-9323.jpg",
        "text": "Telemarketer",
        "x": -100,
        "y": 100
      },
      {
        "key": "QTL1234567",
        "eclass": "OP",
        "level": 3,
        "tooltip": "RECEIVED:9 \nDELIVERED:3 \n FAILED:5 \n UNTRUSTED:0",
        "pos": "100 100",
        "icon": "OP",
        "color": "green",
        "imgsrc": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/BarnettShaleDrilling-9323.jpg/256px-BarnettShaleDrilling-9323.jpg",
        "text": "Operator",
        "x": 100,
        "y": 100
      }
    ],
    "linkDataArray": [
      {
        "from": "13014390409590",
        "to": "13028493489589",
        "points": [
          -300,
          100,
          -200,
          100,
          -200,
          100,
          -100,
          100
        ]
      },
      {
        "from": "13028493489589",
        "to": "QTL1234567",
        "points": [
          -100,
          100,
          0,
          100,
          0,
          100,
          100,
          100
        ]
      }
    ]
  }
}
