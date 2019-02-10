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
          return user.uid;
        }
      }
    );
  }

  displayInventoryList(): AngularFirestoreCollection<Inventory[]> {
   const docRef = this.db.collection('inventory').doc(this.uid)
   docRef.ref.get().then(doc => {
     console.log(Object.keys(doc.data()))
   })
   return;
  }

  createInventory(barcode, entryDate){
    const docRef = this.db.collection('inventory' + this.uid).doc(barcode)
    docRef.set({creationDate: entryDate}, { merge: true }).then(function() {
      console.log("Inventory Successfully created");
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });;;
  }

  inventoryExists(barcode): any {
    return this.getUID().then(result => {
      this.uid = String(result)
      console.log(this.uid);
      const docRef = this.db.collection('inventory' + this.uid).doc(barcode)

      return docRef.ref.get().then(doc => {
          if (doc.exists) {
            return true;
          } else {
            console.log('doc doesnt exist')
            return false;
          }
        }
      ).catch(function(error) {
        console.log('Error getting document: ', error);
      });
    });
  }

  addInventoryItem(barcode, name, expiry, entryDate, quality, location?, locationbarcode?, vendor?, quantity?, qntType?, cost?): any {
    var isExists: boolean;
    this.inventoryExists(barcode).then(result => {
      isExists = result;
      console.log('is exists: ' + isExists)
    });
    if(!isExists){
      this.createInventory(barcode, entryDate);
      console.log('created inventory')
    }
    const subDocRef = this.db.collection('inventory' + this.uid).doc(barcode)
    subDocRef.set({
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
