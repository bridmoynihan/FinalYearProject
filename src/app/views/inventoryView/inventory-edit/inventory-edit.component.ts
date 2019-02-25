import { InventoryService } from '../../../services/inventory.service';
import { Router } from '@angular/router';
import { InventoryListComponent } from '../inventory-list.component';
import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore'
import { Item } from '../item.model';
import { map } from 'rxjs/operators';
import {Observable} from 'rxjs'

@Component({
  selector: 'app-inventory-edit',
  templateUrl: 'inventory-edit.component.html'
})
export class InventoryEditComponent implements OnInit {
  uid: string;
  docID: string;
  items: Observable<any[]>;
  item: Item[];
  public itemBarcode: string;
  public itemName: string;
  public expiryDate: Date;
  public location?: string;
  public locationBarcode?: string;
  public vendor?: string;
  public quantity?: string;
  public qntType?: string;
  public cost?: string;
  public quality?: string;
  
  constructor(public inventoryServ: InventoryService, public router: Router, public db: AngularFirestore) {

    this.inventoryServ.getUID().then(result => {
      this.uid = String(result)
      return this.uid
    })
  }
  editItem(){
    if(this.itemName && this.itemBarcode && this.expiryDate !== null){
      let item = {
       itemBarcode: this.itemBarcode,
       itemName: this.itemName,
       expiryDate: this.expiryDate,
       location: this.location,
       locationBarcode: this.locationBarcode,
       vendor: this.vendor,
       quantity: this.quantity,
       qntType: this.qntType,
       cost: this.cost,
       quality: this.quality
      };
        this.inventoryServ.updateItem(item, this.docID)
    }
    this.router.navigateByUrl('/inventory-list')
  }
  cancel(){
    this.router.navigateByUrl('/inventory-list')
  }

  ngOnInit(){
    this.items = this.db.collection('inventory' + this.uid).snapshotChanges().pipe(
      map(actions => {
         return actions.map(a => {
           const data = a.payload.doc.data() as Item;
           const id = a.payload.doc.id;
           return {id, data};
         });
      }
      ))
      this.items.subscribe(docs => {
        this.docID = docs[0].id;
        console.log(this.docID)
        this.item = docs[0].data;
        this.itemBarcode = this.item["itemBarcode"]
        this.itemName = this.item["itemName"]
        this.expiryDate = this.item["expiryDate"]
        this.location = this.item["location"]
        this.locationBarcode = this.item["locationBarcode"]
        this.vendor = this.item["vendor"]
        this.quantity = this.item["quantity"]
        this.qntType = this.item["qntType"]
        this.cost = this.item["cost"]
        
        return this.docID;
      })
    
  }

}
