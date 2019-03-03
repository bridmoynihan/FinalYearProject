import { Waste } from './../views/inventoryView/waste.model';
import {Injectable, OnInit} from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {InventoryService} from '../services/inventory.service';

@Injectable()
export class WasteService implements OnInit {

  itemDoc: AngularFirestoreDocument<Waste>;
  uid: string;
  cost: number;
  amount: string;
  wastes: AngularFirestoreCollection<Waste>;
 
  private CollectRef: AngularFirestoreCollection<Waste>;
  barCode: string;
  // public amountList: String[]

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, public inventoryServ: InventoryService,) {
    this.inventoryServ.getUID().then(result => {
      this.uid = String(result)
      return this.uid
    });
  }
  createWasteDoc(item, amount, type, cost){
      let dateStr = new Date().toLocaleString()
      let index = dateStr.indexOf(", ")
      let date = dateStr.substr(0, index)
    this.wastes = this.db.collection<Waste>('waste' + this.uid)
    let waste = {
        itemBarcode: item.itemBarcode,
        itemName: item.itemName,
        cost: cost,
        amount: amount,
        qntType: type,
        entryDate: String(date)
    } 
    this.wastes.add(waste)
    console.log("waste created added to database")
  }

  getData(){
    let amountList = []
    let dateList = []
    console.log("uid for waste " + this.uid)
    this.wastes = this.db.collection<Waste>('waste' + this.uid)
    let i = this.wastes.ref.get().then(
      snapshot => {
        snapshot.forEach(doc => {
          amountList.push(doc.data().amount)
          dateList.push(doc.data().entryDate)
          console.log("list size: " + amountList[0])
          return {amountList, dateList}
        })
      }
    )
    return i
  }

  ngOnInit(): any {

}
}