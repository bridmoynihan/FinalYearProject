import { Waste } from './../views/inventoryView/waste.model';
import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { InventoryService } from '../services/inventory.service';

@Injectable()
export class WasteService implements OnInit {

  itemDoc: AngularFirestoreDocument<Waste>;
  uid: string;
  cost: number;
  amount: string;
  wastes: AngularFirestoreCollection<Waste>;

  private CollectRef: AngularFirestoreCollection<Waste>;
  barCode: string;

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, public inventoryServ: InventoryService, ) {
    this.inventoryServ.getUID().then(result => {
      this.uid = String(result)
      return this.uid
    });
  }
  createWasteDoc(item, amount, type, cost) {
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

  getData() {
    let amountList = []
    let dateList = []
    let costList = []
    this.wastes = this.db.collection<Waste>('wasteveWj2VNOz5RFoX1lGl4TWEQaXGq1')
    console.log("is uid defined " + this.uid)
    return this.wastes.ref.get().then(
      snap => {
        snap.docs.forEach(doc => {
          amountList.push(doc.data().amount)
          dateList.push(doc.data().entryDate)
          costList.push(doc.data().cost)
        });
        return {amountList, dateList, costList} ;  
      });
    }

  ngOnInit(): any {

    this.inventoryServ.getUID().then(result => {
      this.uid = String(result)
      return this.uid
    });

  }
}