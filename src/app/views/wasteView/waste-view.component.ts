import { map } from 'rxjs/operators';
import { WasteService } from './../../services/waste.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-waste-view',
    templateUrl: './waste-view.component.html',
    styleUrls: ['./waste-view.component.css']
  })

  export class WasteViewComponent implements OnInit {
    public graph 
    wasteItems: Observable<any[]>
    kgAmount: number
    gramsAmount: number
    lbsAmount: number
    ltrsAmount: number
    dataList: Observable<any[]>
    constructor(public wasteServ: WasteService){
        this.setGraph(this.kgAmount, this.gramsAmount, this.lbsAmount, this.ltrsAmount)
      
    }
    setGraph(kgAmount, gramsAmount, lbsAmount, ltrsAmount){
      this.graph = {
          data: [{ values: [this.kgAmount, this.gramsAmount, this.lbsAmount, this.ltrsAmount], labels: ["Kilogram Wasted", "Grams Wasted", "Pounds Wasted", "Liters Wasted"], type: 'pie'}],
          layout: {width:1020, height:720, title:"Waste Graph: Amounted Wasted Per Month", margin: 'auto'}
      }
  }

    getAmounts(list){
      this.kgAmount = 0
      this.gramsAmount = 0
      this.lbsAmount = 0
      this.ltrsAmount = 0
      for(let i =0; i< list.length; i++){
        if(list[i][1] == "kgs"){
          this.kgAmount = this.kgAmount + +list[i][0]
        }
        else if (list[i][1] == "grams"){
          this.gramsAmount = this.gramsAmount + +list[i][0]
        }
        else if (list[i][1] == "lbs"){
          this.lbsAmount = this.lbsAmount + +list[i][0]
        }
        else if (list[i][1] == "ltrs"){
          this.ltrsAmount = this.ltrsAmount + +list[i][0]
        }  
      }
      this.setGraph(this.kgAmount, this.gramsAmount, this.lbsAmount, this.ltrsAmount)
    }

    ngOnInit(){
      this.wasteItems = this.wasteServ.getWasteItem()
      this.wasteServ.getData().then(docs =>{
        let today = new Date().toLocaleString()
      this.getAmounts(docs.qntList)
    })
    }
}