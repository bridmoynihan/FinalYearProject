import { map } from 'rxjs/operators';
import { WasteService } from './../../services/waste.service';
import { Component } from '@angular/core';

@Component({
    selector: 'app-waste-view',
    templateUrl: './waste-view.component.html'
  })

  export class WasteViewComponent {
    constructor(public wasteServ: WasteService){
      //this.getCost();
    }
    //TODO connect to firebase and total the amount of waste in terms of cost and quantity display on waste-view
  //   getCost(){
      
  //     let costList = []
  //     this.wasteServ.getData().then(result => {
  //       console.log("TEST");
  //       costList = result[2]
  //       console.log("COST LIST " + costList.length)
  //     })
  // }
}