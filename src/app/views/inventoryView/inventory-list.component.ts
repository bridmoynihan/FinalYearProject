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
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent } from './delete-modal.component';


@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css'],
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

  editMode: boolean = false;
  itemToEdit: any = {};
  public selectedItem: any;

  constructor(public modal: NgbModal, public inventoryServ: InventoryService, public router: Router, public db: AngularFirestore, public waste: WasteService){
    
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
    }));
    
    this.inventoryExists();

    let docList: any[]
    let idList: any[]
    docList = []
    idList = []
    let i = this.db.collection('inventory' + this.uid).ref.get().then(function(querySnapshot){
      querySnapshot.forEach(function(doc){
        docList.push(doc.data())
        idList.push(doc.id)
        return {docList, idList}
      })
    })
    i.then(res => {
      for(let i = 0; i<= docList.length-1; i++){
        this.qualityCheck(docList[i], idList[i]);
      }
    })  
  }

  inventoryExists(){
    
    if(this.items != undefined){
      this.inventoryTrue = true;
    }
  }

  gotoForm(){
    this.router.navigateByUrl('inventory-form')
  }

  setEdit(item, bool) {
    item.data.isEditable = bool;
    console.log(item.data.itemName)

  }

  saveItem(){
    //make cost required
    if(this.itemName && this.itemBarcode && this.expiryDate !== null){
      let costOfOne = +this.cost/+this.quantity
      console.log("cost of one " + costOfOne)
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
       quality: this.quality,
       costOfOne: costOfOne
      };
      if(!this.editMode){
        console.log(item)
        this.inventoryServ.addItem(item)
      }
    }
  }
  updateItem(item, id){
    item.data.isEditable = false;
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
    if(item.quality == undefined){
      item.quality = item.data.quality
    }
    let update = {
      itemBarcode: item.itemBarcode,
      itemName: item.itemName,
      expiryDate: item.expiryDate,
      location: item.location,
      quality: item.quality
    }
    this.qualityCheck(update, id);
    this.inventoryServ.updateItem(update, id);
  }

  deleteItem(docID){
    this.inventoryServ.deleteItem(docID);
  }
  addToWaste(item, amount, type, cost){
    if(+item.data.quantity <= amount || + item.data.quantity == 0){
      this.deleteItem(item.id);
      let newAmount = amount - +item.data.quantity;
      this.waste.createWasteDoc(item, newAmount, type, cost);
      return;
    }
    let newAmount = +item.data.quantity - amount;
    this.waste.createWasteDoc(item, amount, type, cost);
    let doc = this.db.collection('inventory' + this.uid).doc(item.id).update({
      "quantity": newAmount,
    });
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
  qualityCheck(item, id){
    let exp = item.expiryDate
    let exptime = new Date(exp).getTime();
    let currentDate = new Date().getTime();
    let diff = exptime - currentDate
    let days = Math.round(Math.abs(diff/(1000*60*60*24)))
    console.log("item quality " + days)
    if (days > 29){
      item.quality = "Great"
      this.inventoryServ.updateItem(item, id)
    }
    else if (days >= 15){
      item.quality = "Ok"
      this.inventoryServ.updateItem(item, id)

    }
    else if (days >= 10){
      item.quality = "Average"
      this.inventoryServ.updateItem(item, id)

    }
    else if (days < 10){
      item.quality = "Bad"
      this.inventoryServ.updateItem(item, id)
    }
  }
}
