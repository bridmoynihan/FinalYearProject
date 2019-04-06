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
  kgAmount: number
  gramsAmount: number
  lbsAmount: number
  ltrsAmount: number
  totalCost: number
  uid: string;
  cost: number;
  amount: string;
  wastes: AngularFirestoreCollection<Waste>;
  wasteItems: Observable<any[]>;
  public monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  public today = new Date().toLocaleString()

  private CollectRef: AngularFirestoreCollection<Waste>;
  barCode: string;
  public prefix = 3;

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, public inventoryServ: InventoryService, ) {
    this.inventoryServ.getUID().then(result => {
      this.uid = String(result)
      return this.uid
    });
    this.getData().then(docs => {
      this.generateTotals(docs)
    })
  }
  createWasteDoc(item, amount, type, cost) {
    let dateStr = new Date().toLocaleString()
    let index = dateStr.indexOf(", ")
    let date = dateStr.substr(0, index)
    let costOfWaste = +cost * +amount
    let month = this.monthList[+this.today[0] - 1]
    let waste = {
      itemBarcode: item.itemBarcode,
      itemName: item.itemName,
      cost: costOfWaste,
      amount: amount,
      qntType: type,
      entryDate: String(date),
      Month: month,
      originalQuant: item.originalQuant
    }
    let docRef = this.db.collection<Waste>('waste' + this.uid).add(waste)
  }

  createTotalDoc(total) {

    let totalDoc = this.db.collection("totalWaste" + this.uid).doc(+this.today[0] + this.monthList[+this.today[0] - 1]).ref.get().then(snap => {
      if (snap.exists) {
        this.db.collection("totalWaste" + this.uid).doc(+this.today[0] + this.monthList[+this.today[0] - 1]).update(total)
      }
      else {
        this.db.collection("totalWaste" + this.uid).doc(+this.today[0] + this.monthList[+this.today[0] - 1]).set(total)
      }
    })
  }

  generateTotals(docs) {
    this.kgAmount = 0
    this.gramsAmount = 0
    this.lbsAmount = 0
    this.ltrsAmount = 0
    this.totalCost = 0
    for (let i = 0; i < docs.qntList.length; i++) {
      if (docs.qntList[i][2][0] == this.today[0]) {
        if (docs.qntList[i][1] == "kgs") {
          this.kgAmount = this.kgAmount + +docs.qntList[i][0]
        }
        else if (docs.qntList[i][1] == "grams") {
          this.gramsAmount = this.gramsAmount + +docs.qntList[i][0]
        }
        else if (docs.qntList[i][1] == "lbs") {
          this.lbsAmount = this.lbsAmount + +docs.qntList[i][0]
        }
        else if (docs.qntList[i][1] == "ltrs") {
          this.ltrsAmount = this.ltrsAmount + +docs.qntList[i][0]
        }

      }
    }
    for (let x = 0; x < docs.costList.length; x++) {
      this.totalCost = this.totalCost + +docs.costList[x][0]
    }
    let total = {
      totalCost: this.totalCost,
      kgAmount: this.kgAmount,
      gramsAmount: this.gramsAmount,
      lbsAmount: this.lbsAmount,
      ltrsAmount: this.ltrsAmount
    }

    this.createTotalDoc(total)

  }

  getMonths() {
    let monthDocs = []
    let totalDocs = []

    let months = this.db.collection('totalWaste' + this.uid)
    return months.ref.get().then(snap => {
      snap.docs.forEach(doc => {
        let substr = doc.id.substr(1)
        monthDocs.push(substr)
        totalDocs.push(doc.data().totalCost)
      })
      return { monthDocs, totalDocs }
    })
  }


  getData() {
    let amountList = []
    let qntList = []
    let costList = []
    let titleQntOrig = []
    return this.inventoryServ.getUID().then(result => {
      this.uid = String(result)
      this.wastes = this.db.collection<Waste>('waste' + this.uid)
      return this.wastes.ref.get().then(
        snap => {
          snap.docs.forEach(doc => {
            amountList.push(doc.data().amount)
            costList.push([doc.data().cost, doc.data().entryDate])
            qntList.push([doc.data().amount, doc.data().qntType, doc.data().entryDate])
            titleQntOrig.push([doc.data().itemName, doc.data().amount, doc.data().originalQuant, doc.data().qntType])

          });
          return { amountList, costList, qntList, titleQntOrig };
        });
    })
  }

  getWasteItem() {
    return this.wasteItems = this.db.collection('waste' + this.uid).snapshotChanges().pipe(
      map(actions => {
        return actions.map(doc => {
          const data = doc.payload.doc.data() as Waste;
          const id = doc.payload.doc.id;
          return { id, data };
        })
      })
    )
  }

  ngOnInit(): any {
    this.inventoryServ.getUID().then(result => {
      this.uid = String(result)
      return this.uid
    });
    this.getData().then(docs => {
      this.generateTotals(docs)
    })
  }
}