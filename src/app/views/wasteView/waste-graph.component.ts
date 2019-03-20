import { WasteService } from './../../services/waste.service';
import { Component } from '@angular/core';
import { PlotlyModule } from 'angular-plotly.js';
import { Observable, Subscription } from 'rxjs';
import { exists } from 'fs';

@Component({
    selector: 'app-waste-graph',
    templateUrl: './waste-graph.component.html',
    styleUrls: ['./waste-graph.component.css']
  })
export class WasteGraphComponent {
    public graph 
    constructor(public wasteServ: WasteService){
        let yList = []
        let xList = []
        this.setGraph(xList, yList)
         this.getMonthDocs().then(data => {
             for(let i=0; i< data.monthList.length; i++){
                xList.push(data.monthList[i])
                yList.push(+data.totalList[i])   
             }
            this.setGraph(xList, yList)
         });
        }

    setGraph(xList, yList){
        this.graph = {
            data: [{ x: xList, y: yList, type: 'bar', marker: {color: '#ff8c00'}}],
            layout: {width:1020, height:720, title:"Waste Graph:€ Wasted Per Month", margin: 'auto'}
        }
    }

    getMonthDocs(){
        return this.wasteServ.getMonths().then( data => {
           let monthList = []
           let totalList = []
           for(let x = 0; x < data.monthDocs.length; x++){
               monthList.push(data.monthDocs[x])
               totalList.push(data.totalDocs[x])
           }
           return {monthList, totalList} 
        })
    }
}