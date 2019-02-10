import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {InventoryService} from '../../../services/inventory.service'


@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.css', '../../navbar/navbar.component.css']
})
export class InventoryFormComponent implements OnInit {
  itemBarcode: string;
  itemName: string;
  location?: string;
  locationBarcode?: string;
  expiryDate: Date;
  vendor?: string;
  quantity?: string;
  qntType?: string;
  cost?: string;
  quality?: string; //set to good initially but as current is greater than or equal to expiry date then it turns to bad

  validForm: boolean;
  entryDate: number= Date.now();

  constructor(public auth: AuthService, private router: Router, public inventoryService: InventoryService) {
    
   }

  addItemInventory(){
    if(this.itemBarcode && this.itemName && this.expiryDate){
      this.validForm = true;
      this.quality = 'Good'
      // add promise here to check if success or fail to handle error alert for user
      this.inventoryService.addInventoryItem(this.itemBarcode, this.itemName, this.expiryDate, this.entryDate, this.quality, String(this.location), String(this.locationBarcode), String(this.vendor), String(this.quantity), String(this.qntType), String(this.cost));
      return this.validForm;
    } else{
      console.log('invalid')
    }
    this.validForm = false;
    return
  }

  ngOnInit() {
  }

}
