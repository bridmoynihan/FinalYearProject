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
  }

  // createInventoryList(): AngularFirestoreCollection<Inventory> {
  //   this.item_barcode = '101011';
  //   const inventoryRef = this.db.collection('inventory').doc(this.uid).collection(this.item_barcode).doc('details' + this.item_barcode).set({
  //       item_name: '',
  //       location_barcode: '',
  //       location: '',
  //       quantity: '',
  //       quality: '',
  //       expiry_date: firestore.Timestamp.fromDate(new Date('08/02/19')),
  //       status: true
  //     })
  //   ;
  //   return;
  // }

  // displayInventoryList(): AngularFirestoreCollection<Inventory[]> {
  // }

  inventoryExists(): any {
    return this.getUID().then(result => {
      this.uid = String(result)
      console.log(this.uid);
      const docRef = this.db.collection('inventory').doc(this.uid)

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
    });
  }

  addInventoryItem(barcode, name, expiry, entryDate, quality, location?, locationbarcode?, vendor?, quantity?, qntType?, cost?): any {
    console.log(this.uid);
    console.log(barcode);
    console.log(name);
    const docRef = this.db.collection('inventory').doc(this.uid).collection(barcode).doc('details' + barcode)
    docRef.set({
      itemName: name,
      expiryDate: expiry,
      entryDate: entryDate,
      quality: quality,
      location: location,
      locationBarcode: locationbarcode,
      vendor: vendor,
      quantity: quantity,
      qntType: qntType,
      cost: cost

    }, { merge: true })
    .then(function() {
      console.log("Document successfully written!");
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });;
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
