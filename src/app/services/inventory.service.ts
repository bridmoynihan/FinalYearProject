import { Router } from '@angular/router';
import {Injectable, OnInit} from '@angular/core';
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
export class InventoryService implements OnInit {
  inventory: AngularFirestoreCollection<Inventory> = null;
  uid: string;
  item_barcode: '101011'; // retrieve value from form

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) {
    this.item_barcode = '101011';

    this.afAuth.authState.subscribe(
      user => {
        if (user) {
          this.uid = user.uid;
          return this.uid;
        }
      }
    );
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

  inventoryExists(): any {
    this.item_barcode = '101011'; // read in barcode value from form on inventory creation page

    const docRef = this.db.collection('inventory').doc('veWj2VNOz5RFoX1lGl4TWEQaXGq1').collection('items').doc(this.item_barcode)

    return docRef.ref.get().then(doc => {
        if (doc.exists) {
          return true;
        } else {
          return false;
        }
      }
    ).catch(function(error) {
      console.log('Error getting document: ', error);
    });
  }
  ngOnInit(): any {

  }
}
