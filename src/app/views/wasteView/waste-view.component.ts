import { map } from 'rxjs/operators';
import { WasteService } from './../../services/waste.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-waste-view',
    templateUrl: './waste-view.component.html'
    //add stylesheet here
  })

  export class WasteViewComponent implements OnInit {
    wasteItems: Observable<any[]>
    kgAmount: number
    gramsAmount: number
    lbsAmount: number
    ltrsAmount: number
    dataList: Observable<any[]>
    constructor(public wasteServ: WasteService){
      
    }

    getAmounts(list){
      this.kgAmount = 0
      this.gramsAmount = 0
      this.lbsAmount = 0
      this.ltrsAmount = 0
      for(let i =0; i< list.length; i++){
        // console.log("types are " + list[i][1])
        if(list[i][1] == "kgs"){
          this.kgAmount = this.kgAmount + +list[i][0]
          // console.log("type " + list[i][1])
        }
        else if (list[i][1] == "grams"){
          // console.log("grams true")
          this.gramsAmount = this.gramsAmount + +list[i][0]
        }
        else if (list[i][1] == "lbs"){
          // console.log("lbs true")
          this.lbsAmount = this.lbsAmount + +list[i][0]
        }
        else if (list[i][1] == "ltrs"){
          // console.log("ltrs true")
          this.ltrsAmount = this.ltrsAmount + +list[i][0]
        }  
      }
    }

    ngOnInit(){
      this.wasteItems = this.wasteServ.getWasteItem()
      this.wasteServ.getData().then(docs =>{
        let today = new Date().toLocaleString()
        console.log("today's date " + today[0])
        console.log("entry ", docs.qntList[2][2][0])
      this.getAmounts(docs.qntList)
    })
    }
}