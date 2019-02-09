import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.css']
})
export class InventoryFormComponent implements OnInit {
  itemBarcode: string;
  itemName: string;
  location: string;
  locationBarcode: string;
  expiryDate: Date;
  vendor: string;
  quantity: string;
  qntType: string;
  cost: string;
  quality: string; //set to good initially but as current is greater than or equal to expiry date then it turns to bad

  validForm: boolean;

  constructor(public auth: AuthService, private router: Router) { }

  addItemInventory(){
    if(this.itemBarcode && this.itemName){
      console.log('valid')
      console.log('added to inventory')
      this.validForm = true;
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
