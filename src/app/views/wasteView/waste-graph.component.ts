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
            layout: {width:1020, height:720, title:"Waste Graph: Cost of waste per Month", margin: 'auto'}
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
    // getAmount() {
    //     let costList = []
    //     let dateList = []
    //     let newAmount = 0
    //     let newAmountList = []
    //     return this.wasteServ.getData().then((dataList) => {
    //         // for (let date = 0; date<= dataList.costList.length; date ++){
                
    //         //     dateList.push(dataList.costList[date][1])
    //         // }
    //         let sort = dataList.costList.sort(this.sortDate);
    //         for(let i = 0; i< dataList.costList.length; i ++){
    //             //let sort = dateList.sort()
    //             dateList.push(sort[i][1])
    //             if(sort[i][1] == sort[i+1][1]){
    //                 // console.log("true")
    //                 // console.log("sort dates" + sort[i][1] + " " + sort[i+1][1])
    //                 if(newAmount == 0){
    //                     newAmount = +sort[i][0]
    //                 }
    //                 newAmount = newAmount + (+sort[i+1][0])
    //                 console.log("new amount is " + newAmount)
    //             //console.log("new mount is " + newAmount)
                
    //             }
    //             else if(i+1 < sort.length && sort[i][1] != sort[i+1][1]) {
    //                 console.log(false)
    //                 console.log("no sort dates" + sort[i][1] + " " + sort[i+1][1])
    //                 newAmountList.push(newAmount)
    //                 // console.log("new amoutn list " + newAmountList[1])
    //                 newAmount = 0
    //                 //TODO fix this area amounts being added when they shouldn't to newAmountList when next date doesn't equal current. Want only sigleton dates to be added
    //                 if(i > 0 && sort[i][1] != sort[i-1][1] && (sort[i][1] != sort[i+1][1] || sort[i+1] >= sort.length)){
    //                     dateList.push(sort[i+1][1])
    //                     dateList =dateList.sort(this.sortDate)
    //                     newAmountList.push(sort[i][0])
    //                     console.log("cost list " + newAmountList[1])
    //                 }
                   
    //             }
    //             }
              
    //           let uniqueList = dateList.filter(function(elem, index, self){
    //               return index == self.indexOf(elem)
    //           })
    //           console.log("unique size " + uniqueList[2])
    //         return {newAmountList, uniqueList}
    //     })
    // }
    // sortDate(a, b){
    //     return (a[1] > b[1]) ? 1: -1
    // }
    // getTotalCost(){
    //     let totalCost: number
    //     return this.wasteServ.getData().then((dataList) => {
    //         for(let x = 0; x <= dataList.costList.length; x ++){
    //             totalCost += dataList.costList[x];
    //         }
    //         return totalCost;
    //     })
    // }
}