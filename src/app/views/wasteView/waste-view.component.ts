import { map } from 'rxjs/operators';
import { WasteService } from './../../services/waste.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-waste-view',
    templateUrl: './waste-view.component.html'
  })

  export class WasteViewComponent {
    wasteItems: Observable<any[]>
    constructor(public wasteServ: WasteService){
      this.wasteItems = this.wasteServ.getWasteItem()
      this.wasteItems.subscribe(results => {
        console.log("waste items " + results)
      })
    }
}