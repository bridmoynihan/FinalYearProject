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
  // public amountList: String[]

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
    this.getUID().then(res => {
      this.uid = String(res)
      return this.uid
    })
    this.wastes = this.db.collection<Waste>('waste' + 'veWj2VNOz5RFoX1lGl4TWEQaXGq1')
    console.log("uid " + this.uid)

    

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

  getAmountData(){
    let amountList = []
    let dateList = []
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

  getUID(){
    var promise = new Promise(resolve => {
      this.afAuth.authState.subscribe(
          user => {
            if (user) {
              this.uid = user.uid;
              resolve(this.uid);
            }
          }
        );
    });
    return promise;
  }

  ngOnInit(): any {

}
}