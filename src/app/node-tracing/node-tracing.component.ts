import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router,ActivatedRoute} from  '@angular/router';
import { ApiIntegrationService } from '../api-integration.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstant } from '../globalconstant';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CustomValidators } from '../validators';
import { MessageService } from '../messageservice.service';

import { HierarchyPointNode } from "d3";
import * as d3 from "d3";
export const margin = { top: 20, right: 120, bottom: 20, left: 205 };
export const width = 1080;
export const height = 800 - margin.top - margin.bottom;

declare var $;
@Component({
  selector: 'app-node-tracing',
  templateUrl: './node-tracing.component.html',
  styleUrls: ['./node-tracing.component.scss'],  
  encapsulation: ViewEncapsulation.None,
})
export class NodeTracingComponent implements OnInit{
 @BlockUI() blockUI: NgBlockUI; 
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
entityData:any;
entRes:any
idEntity:any;
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

 treeData:any;
 ngOnInit() {
       var date = new Date();
        var dateFrom=date.setDate(date.getDate() - 7);         
        this.selectFromDate=dateFrom/1000
        var dateNew =(((new Date()).getTime()) /1000).toFixed(0);
        this.curentData=parseInt(dateNew);        
        var dateNew =(((new Date()).getTime()) /1000).toFixed(0);
        this.curentData=parseInt(dateNew);
        let postData={
                  "id":this.tempData.peid,
                  "reqType":this.eClass  
                  // from:this.selectFromDate,
                  // to:this.curentData
          }     
        this.blockUI.start('Loading...'); 
        this.dataService.getNodeGraph(postData).subscribe(data=>{
          this.blockUI.stop();
         this.resGraph=data;        
         if(this.resGraph.statusCode===200){       
           if(this.resGraph.data.length>0){
            this.nodeLength=true;
            this.treeData=this.resGraph.data[0];
            this.root = d3.hierarchy(this.treeData, (d) => d.children);
            this.root.x0 = height / 2;
            this.root.y0 = 0;
            let collapse = function (d) {
                if (d.children) {
                    d._children = d.children;
                    d._children.forEach(collapse);
                    d.children = null;
                }
            }   
            this.root.children.forEach(collapse);
            this.update(this.root);          
          }else{
            this.nodeLength=false;             
          }
         }else if(this.resGraph.statusCode===404){
           this.nodeLength=true;
         }
       })
        this.svg = d3.select("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.tooltip= d3.select("body")
            .append("div")
            .attr("class", "my-tooltip") //add the tooltip class          
            .style("visibility", "visible");  
            this.treeLayout = d3.tree().size([height, width]);


}

update(source) {
    let i = 0;
    let duration = 750;

    let treeData = this.treeLayout(this.root);
    let nodes = treeData.descendants();
    let links = treeData.descendants().slice(1);

    nodes.forEach(d => d.y = d.depth * 180);

    let node = this.svg.selectAll("g.node")
        .data(nodes, d =>  d.id || (d.id = ++i) );

    let nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", d => "translate(" + source.y0 + "," + source.x0 + ")")
        .on("click", this.click);

    nodeEnter.append("circle")
        .attr("class", "node")
        .attr("r", 1e-6)
        .style("fill", d => d._children ? "#76ba1b" : "#1cf4aa")
        .on('mouseover', d=> {
              console.log(d.data.name);
              this.tooltip.style("visibility", "visible")
              .html( d.data.tooltip ? d.data.tooltip :"SENT:0 <br/> RECEIVED:0 <br/> DELIVERED:0 <br/> FAILED:0")
                //.html('SENT : ' + "3" +  '<br>' +'  DELIVERED : ' + "4"+  '<br>' +'  FAILED : ' + "6")
            })
        .on("mousemove",d => {
           return this.tooltip.style("top", (d3.event.pageY - 40) + "px").style("left", (d3.event.pageX - 130) + "px");
        })
        .on("mouseout", d=> {
           return this.tooltip.style("visibility", "hidden");
        });
    

      // Add labels for the nodes
  nodeEnter.append('text')
      .attr("dy", "2.5em")
      .attr("x", function(d) {
          return d.children || d._children ? 40 : -40;
      })
      .attr("text-anchor", function(d) {
          return d.children || d._children ? "end" : "start";
      })
      .text(function(d) { return d.data.name; });


    let nodeUpdate = nodeEnter.merge(node);    
    nodeUpdate.transition()
        .duration(duration)
        .attr("transform", d => "translate(" + d.y + "," + d.x + ")");

    nodeUpdate.select("circle.node")
        .attr("r", 10)
        .style("fill", d => d._children ? "#1cf4aa" : "#1cf4aa")
        .attr("cursor", "pointer");

    let nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", d => "translate(" + source.y + "," + source.x + ")")
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    let link = this.svg.selectAll("path.link")
        .data(links, d => d.id);

    let linkEnter = link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", d => {
            let o = { x: source.x0, y: source.y0 };
            return this.diagonal(o, o);
        });

    let linkUpdate = linkEnter.merge(link);

    linkUpdate.transition()
        .duration(duration)
        .attr("d", d => {
            return this.diagonal(d, d.parent)
        });

    let linkExit = link.exit().transition()
        .duration(duration)
        .attr("d", d => {
            let o = { x: source.x, y: source.y };
            return this.diagonal(o, o);
        })
        .remove();

    nodes.forEach(d => {
        d.x0 = d.x;
        d.y0 = d.y;
    });

}

  click = (d) => {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }

            this.update(d);
        };

diagonal(s, d) {
    let path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

    return path;
}

fromDate:any;
toDate:any;
selectFromDate:any;
selectToDate:any;
curentData:any;
   getnodeGraph(){
      if(!this.fromDate){
        this.toastr.error('please select from date'); 
        return false
      }else if(!this.toDate){
         this.toastr.error('please select from date'); 
        return false
      }else{
            this.selectFromDate=Date.parse(this.fromDate)/1000
            this.selectToDate=Date.parse(this.toDate)/1000
            var dateNew =(((new Date()).getTime()) /1000).toFixed(0);
            this.curentData=parseInt(dateNew);
            if(this.selectFromDate>this.toDate){
               this.toastr.error('From date should not be greater then to date'); 
               return false
            }else if(this.selectFromDate>this.curentData){
              this.toastr.error('From date should not be greater then current date'); 
               return false
            }else if(this.selectToDate>this.curentData){
              this.toastr.error('To date should not be greater then current date'); 
               return false
            }else{
              let postData={
                  id:this.tempData.peid,
                  reqType:this.eClass,
                  from:this.selectFromDate,
                  to:this.selectToDate
              }        
         this.blockUI.start('Loading...');
         this.dataService.getNodeGraph(postData).subscribe(data=>{
         this.blockUI.stop();
         
         this.resGraph={};
         this.resGraph=data;        
         if(this.resGraph.statusCode===200){       
           if(this.resGraph.data.length>0){
            this.nodeLength=true;
            this.treeData=this.resGraph.data[0];
            this.root = d3.hierarchy(this.treeData, (d) => d.children);
            this.root.x0 = height / 2;
            this.root.y0 = 0;
            let collapse = function (d) {
                if (d.children) {
                    d._children = d.children;
                    d._children.forEach(collapse);
                    d.children = null;
                }
            }   
            this.root.children.forEach(collapse);
            this.update(this.root);          
          }else{
            this.nodeLength=false;             
          }
         }else if(this.resGraph.statusCode===404){
           this.nodeLength=true;
         }
        })
         this.svg.selectAll("*").remove();
         this.svg = d3.select("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.tooltip= d3.select("body")
            .append("div")
            .attr("class", "my-tooltip") //add the tooltip class          
            .style("visibility", "visible");  
            this.treeLayout = d3.tree().size([height, width]);
            }
      }
    }
}
