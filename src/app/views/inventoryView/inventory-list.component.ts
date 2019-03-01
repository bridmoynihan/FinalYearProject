import { WasteService } from './../../services/waste.service';
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

export class InventoryListComponent implements OnInit{
  public inventoryTrue: boolean;
  public barCode: string;
  uid: string;
  docRef: Observable<any[]>;
  items: Observable<any[]>;
  public itemBarcode: string;
  public itemName: string;
  public expiryDate: Date;
  public isEditable?: false;
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

  constructor(public inventoryServ: InventoryService, public router: Router, public db: AngularFirestore, public waste: WasteService){
    
    this.inventoryServ.getUID().then(result => {
      this.uid = String(result)
      return this.uid
    })
     
    
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
    }).switchMap((usersId: string[]) => {
      return Observable.combineLatest( usersId.map((u)=>{
        return this.onGetUserDocuments(u);
      }))
    }));
    this.inventoryExists();

    // let docList: Item[]
    // this.db.collection('inventory' + this.uid).ref.get().then(function(querySnapshot){
    //   querySnapshot.forEach(function(doc){
    //     this.docList.push(doc.data())
    //   })
    // }) 
    // for(let i = 0; i<= docList.length-1; i++){
    //   console.log("length of list " + docList.length)
    //   this.qualityCheck(docList[i]);
    // }
    
    
  }

  inventoryExists(){
    
    if(this.items != undefined){
      this.inventoryTrue = true;
    }
    console.log("inventory exists" + this.inventoryTrue)
  }

  gotoForm(){
    this.router.navigateByUrl('inventory-form')
  }

  setEdit(item, bool) {
    item.data.isEditable = bool;
    console.log(item.data.itemName)

  }

  saveItem(){
    if(this.itemName && this.itemBarcode && this.expiryDate !== null){
      let item = {
       itemBarcode: this.itemBarcode,
       itemName: this.itemName,
       expiryDate: this.expiryDate,
       isEditable: false,
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
  updateItem(item, id){
    item.data.isEditable = false;
    // console.log("updated " + item.itemName + " " + id)
    if(item.itemBarcode == undefined){
      item.itemBarcode = item.data.itemBarcode
    }
    if(item.itemName == undefined){
      item.itemName = item.data.itemName
    }
    if(item.expiryDate == undefined){
      item.expiryDate = item.data.expiryDate
    }
    if(item.location == undefined){
      item.location = item.data.location
    }
    let update = {
      itemBarcode: item.itemBarcode,
      itemName: item.itemName,
      expiryDate: item.expiryDate,
      location: item.location
    }
    console.log("updated " + item.location + " " + id)
    
    this.inventoryServ.updateItem(update, id);
  }

  deleteItem(docID){
    this.inventoryServ.deleteItem(docID);
  }
  addToWaste(item, amount, type, cost){
    let newAmount = +item.data.quantity - amount;
    console.log(newAmount)
    this.waste.createWasteDoc(item, amount, type, cost)
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
  qualityCheck(item){
    let exp = item.expiryDate
    let exptime = new Date(exp).getTime();
    let currentDate = new Date().getTime();
    let diff = exptime - currentDate
    let days = Math.round(Math.abs(diff/(1000*60*60*24)))
    console.log("days left: " + days)
    if (days > 29){console.log("status great ")}
    else if (days >= 15){
      console.log("status is ok")
    }
    else if (days <= 5){console.log("status bad")}
  }
}
