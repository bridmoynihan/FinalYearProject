import { Waste } from './../views/inventoryView/waste.model';
import {Injectable, OnInit} from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs'

@Injectable()
export class WasteService implements OnInit {

  itemDoc: AngularFirestoreDocument<Waste>;
  uid: string;
  cost: number;
  amount: string;
  wastes: AngularFirestoreCollection<Waste>;
 
  private CollectRef: AngularFirestoreCollection<Waste>;
  barCode: string;

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(
      user => {
        if (user) {
          this.uid = user.uid;
          this.wastes = this.db.collection<Waste>('waste' + this.uid)
          console.log("creating waste " + this.uid);
          return user.uid;
        }
      }
    );
    this.wastes = this.db.collection<Waste>('waste' + this.uid)
    

  }
  createWasteDoc(item, amount, type, cost){
      let dateStr = new Date().toLocaleString()
      let index = dateStr.indexOf(", ")
      let date = dateStr.substr(0, index)
      console.log("date" + date)
      console.log("making waste...")
    let waste = {
        itemBarcode: item.data.itemBarcode,
        itemName: item.data.itemName,
        cost: cost,
        amount: amount,
        qntType: type,
        entryDate: String(date)
    } 
    this.wastes.add(waste)
    console.log("waste created added to database")
  }
  ngOnInit(): any {

}
}