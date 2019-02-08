import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from '@angular/fire/firestore';
import { AngularFireObject, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import {Observable} from 'rxjs';
import {first} from 'rxjs/operators';
import {firestore} from 'firebase';
import {map} from 'rxjs/operators';

interface Inventory {
  uid: string;
}

@Injectable()
export class InventoryService {
  inventoryTrue = false;
  inventory: AngularFirestoreCollection<Inventory> = null;
  uid: string;
  item_barcode: '101011';

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(
      user => {
        if (user) {
          this.uid = user.uid
        }
      }
    )
    setTimeout(() => {
      this.inventoryExists();
    }, 5000);
  }

  createInventoryList(): AngularFirestoreCollection<Inventory> {
    this.item_barcode = '101011';
    const inventoryRef = this.db.collection('inventory').doc(this.uid).collection('items').doc(this.item_barcode).set({
        item_name: '',
        location_barcode: '',
        location: '',
        quantity: '',
        quality: '',
        expiry_date: firestore.Timestamp.fromDate(new Date('08/02/19')),
        status: true
      })
    ;
    return;
  }

  // displayInventoryList(): AngularFirestoreCollection<Inventory[]> {
  // }

  inventoryExists() {
    const ref: AngularFirestoreDocument = this.db.doc('/inventory/' + this.uid);
    ref.valueChanges().subscribe(action => {
      if(action){
        this.inventoryTrue = true;
        console.log('false');
        return;
      } else{
        this.inventoryTrue = false;
        console.log('true');
        return;
      }
    });
    console.log(this.inventoryTrue)

  }
}
