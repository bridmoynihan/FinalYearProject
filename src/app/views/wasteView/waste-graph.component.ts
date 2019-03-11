import { WasteService } from './../../services/waste.service';
import { Component } from '@angular/core';
import { PlotlyModule } from 'angular-plotly.js';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-waste-graph',
    templateUrl: './waste-graph.component.html'
  })
export class WasteGraphComponent {
    public graph 
    constructor(public wasteServ: WasteService){
        let yList = []
        let xList = []
        this.setGraph(xList, yList)
         this.getAmount().then(data => {
             for(let i=0; i<= data.amountList.length; i++){
                yList.push(+data.amountList[i])   
             }
             for(let x = 0; x <= data.uniqueList.length; x ++){
                xList.push(data.uniqueList[x])
             }
            this.setGraph(xList, yList)
         });
        }

    setGraph(xList, yList){
        this.graph = {
            data: [{ x: xList, y: yList, type: 'bar' }
            ],
            layout: {width:1020, height:720, title:"Waste Graph: Amount wasted per Date"}
        }
    }
    getAmount() {
        let amountList = []
        let dateList = []
        return this.wasteServ.getData().then((dataList) => {
            for (let date = 0; date<= dataList.dateList.length; date ++){
                
                dateList.push(dataList.dateList[date])
            }
            for(let i = 0; i<= dateList.length; i ++){
                if(dateList[i] == dateList[i+1]){
                  let newAmount = dataList.amountList[i] + dataList.amountList[i+1]
                  amountList.push(newAmount)
                }else {
                    amountList.push(dataList.amountList[i])
                }
              }
              let uniqueList = dateList.filter(function(elem, index, self){
                  return index == self.indexOf(elem)
              })
            return {amountList, uniqueList}
        })
    }
    getTotalCost(){
        let totalCost: number
        return this.wasteServ.getData().then((dataList) => {
            for(let x = 0; x <= dataList.costList.length; x ++){
                totalCost += dataList.costList[x];
            }
            return totalCost;
        })
    }
}