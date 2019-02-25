import { Item } from './item.model';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {InventoryService} from '../../services/inventory.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs'
import { AngularFireAuth } from 'angularfire2/auth';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { AngularFirestore} from '@angular/fire/firestore';
import { InventoryEditComponent } from './inventory-edit/inventory-edit.component';


@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html'
})

export class InventoryListComponent extends InventoryEditComponent implements OnInit{
  public inventoryTrue: boolean;
  public barCode: string;
  uid: string;
  docRef: Observable<any[]>;
  items: Observable<any[]>;
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
  public wasteAmount: number;
  // public quality?: string;

  editMode: boolean = false;
  itemToEdit: any = {};

  constructor(public inventoryServ: InventoryService, public router: Router, public db: AngularFirestore){
    super(inventoryServ, router, db)
    this.inventoryServ.getUID().then(result => {
      this.uid = String(result)
      return this.uid
    })
    console.log(this.item)  
    
    this.inventoryTrue = false;
    this.items = db.collection('inventory' + this.uid).valueChanges();
    
  }

  ngOnInit(): any {
    this.items = this.db.collection('inventory' + this.uid).snapshotChanges().pipe(
    map(actions => {
       return actions.map(a => {
         const data = a.payload.doc.data() as Item;
         const id = a.payload.doc.id;
         return { id, data };
       });
    }));
    
  }

  inventoryExists(){}

  gotoForm(){
    this.router.navigateByUrl('inventory-form')
  }

  edit(item) {
    // console.log(item.id)
    // let food = {
    // itemBarcode: item.data.itemBarcode,
    // itemName: item.data.itemName,
    // expiryDate: item.data.expiryDate,
    // location: item.data.location,
    // locationBarcode: item.data.locationBarcode,
    // vendor: item.data.vendor,
    // quantity: item.data.quantity,
    // qntType: item.data.qntType,
    // cost: item.data.cost
    // }
    // super.fetchDocData(food)
    this.router.navigateByUrl('/inventory-edit')

  }

  saveItem(){
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
      if(!this.editMode){
        console.log(item)
        this.inventoryServ.addItem(item)
      }
    }
  }

  deleteItem(docID){
    this.inventoryServ.deleteItem(docID);
  }
  addToWaste(item, amount, cost){
    //waste service create waste document pass item new amount and cost
    let newAmount = +item.data.quantity - amount;
    console.log(newAmount)
    let doc = this.db.collection('inventory' + this.uid).doc(item.id).update({
      "quantity": newAmount,
    })
  }

  getBarcode(){
    return this.inventoryServ.getBarcode().then(result => {
      this.barCode = String(result);
      this.inventoryServ.inventoryExists(this.barCode).then(ans => {
        this.inventoryTrue = ans;
      });
    })
    
    }

  displayInventoryList(){
    var doclist
    this.inventoryServ.getBarcode().then(result => {
      this.barCode = String(result);
      doclist = this.inventoryServ.displayInventoryList(this.barCode)
    })
    console.log(doclist[0]);
  }
  inventoryButtonClick(){
    this.router.navigateByUrl('/inventory-form');
  }
}
