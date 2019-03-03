import { WasteService } from './../../services/waste.service';
import { Component } from '@angular/core';
import { PlotlyModule } from 'angular-plotly.js';

@Component({
    selector: 'app-waste-graph',
    templateUrl: './waste-graph.component.html'
  })
export class WasteGraphComponent {
    public graph 
    constructor(public wasteServ: WasteService){
        this.getAmount();
         this.setGraph();
        }

    setGraph(){
        this.graph = {
            data: [{ x: [1, 2, 3], y: [2, 5, 3], type: 'bar' }
            ],
            layout: {width:1020, height:720, title:"Waste Graph"}
        }
    }
    getAmount(){
        let amountList = []
        let dateList = []
        this.wasteServ.getData().then(res => {
            // amountList = res
            // dateList = res[1]
            console.log("amount list item: " + amountList[0])
            return {amountList, dateList}
        })
        // console.log("amount list item: " + amountList[0])
    }
}