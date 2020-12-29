import { Component,EventEmitter,OnInit,Input,Output,ViewEncapsulation } from '@angular/core';
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router,ActivatedRoute} from  '@angular/router';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstant } from '../globalconstant';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CustomValidators } from '../validators';
import { MessageService } from '../messageservice.service';
import { HierarchyPointNode } from "d3";
import * as moment from 'moment';
// ---------------------------Start Go js Start Here-----------------------//
import * as go from 'gojs';
const graph = go.GraphObject.make;
declare var $;

@Component({
  selector: 'app-tracing',
  templateUrl: './tracing.component.html',
  styleUrls: ['./tracing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TracingComponent implements OnInit {
 @BlockUI() blockUI: NgBlockUI; 
 clearSetTimeout:any;
  pendingRequest:any;
private svg;
private treeLayout;
private root;
private tooltip;
nodeLength:boolean=false;
date:any;  
link:any=[];
node:any=[];
resGraph:any;
temperDetails:any;
tempData:any;
eClass:any;
ENData:any;
entRes:any
idEntity:any;

// ---------------------------Start Go js Start Here-----------------------//
 public diagram: go.Diagram = null;
    public model: go.Model;
    public geo: any;
    public opacity: any = 1;
    
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
          
      }
getEntity(){
      let postData={
               "reqid":this.tempData.id,             
               "reqType":this.eClass
      }
      this.dataService.getEntity(postData).subscribe(res=>{
        this.entRes=res;
        if(this.entRes.statusCode===200){
          this.ENData=this.entRes.data;
        }
      });
    }

 treeData:any;
 nodeData:any;
 ngOnInit() {
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
                      
            this.dataService.getNodeGraph(postData).subscribe(data=>{
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


}
