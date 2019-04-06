import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service'


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
  quality?: string;
  reorder?: number;
  public editMode: boolean = true;
  itemToEdit: any = {};

  needsReorder: boolean = false;
  validForm: boolean;
  entryDate: number = Date.now();

  constructor(public router: Router, public inventoryService: InventoryService) {

  }

  saveItem() {
    if (this.itemName && this.itemBarcode && this.expiryDate && this.cost && this.reorder && this.quantity !== null) {
      let costOfOne = +this.cost / +this.quantity

      let item = {
        itemBarcode: this.itemBarcode,
        itemName: this.itemName,
        expiryDate: this.expiryDate,
        location: String(this.location),
        locationBarcode: String(this.locationBarcode),
        vendor: String(this.vendor),
        quantity: String(this.quantity),
        qntType: String(this.qntType),
        cost: String(this.cost),
        quality: String(this.quality),
        reorder: this.reorder,
        needsReorder: false,
        originalQuant: String(this.quantity),
        costOfOne: costOfOne
      };
      this.inventoryService.addItem(item)
      this.validForm = true;
    }
    this.itemBarcode = ""
    this.itemName = ""
    this.expiryDate = null
    this.location = ""
    this.locationBarcode = ""
    this.vendor = ""
    this.quantity = ""
    this.qntType = ""
    this.cost = ""
    this.quality = ""
    this.reorder = null
  }

  closeItem() {
    this.router.navigateByUrl('/inventory-list')
  }

  ngOnInit() {
  }

}
