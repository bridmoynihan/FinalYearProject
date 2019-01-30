import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from '@angular/fire/firestore';
import { AngularFireObject, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import {Observable} from 'rxjs';
import {first} from 'rxjs/operators';

interface Inventory {
  name: string;
  uid: string;
}

@Injectable()
export class InventoryService {
  inventoryTrue = false;
  inventory: AngularFirestoreCollection<Inventory> = null;
  uid: string;
  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth){
    this.afAuth.authState.subscribe(
      user => {
        if(user) { this.uid = user.uid }
      }
    )
    setTimeout(() => {
      this.inventoryExists();
    }, 5000);
  }

  // createInventoryList(): AngularFirestoreCollection<Inventory> {
  //   const inventory = this.db.collection('inventory')
  //   if (!this.uid) {
  //     return;
  //   }
  //   inventory.doc(this.uid).set({
  //     name: 'inventory name',
  //     uid: this.uid
  //   })
  // }

  // displayInventoryList(): AngularFirestoreCollection<Inventory[]> {
  //   if(!this.uid){
  //     return;
  //   }
  //   this.inventory = this.db.collection('inventory');
  //   this.inventoryData = thi
  //
  // }

  inventoryExists() {
    if(this.db.doc('inventory/' + this.uid ).valueChanges().pipe(first()).toPromise()) {
      console.log('true');
      this.inventoryTrue = true;
      return;
    }

  // const ref: AngularFirestoreDocument<any> = this.db.doc('inventory/' + uid);
  // ref.get().subscribe(snap => {
  //   if(snap.exists){
  //     console.log('exists');
  //     return true;
  //   }
  //   else {
  //     console.log('doesnt exist');
  //     return false;
  //   }
  // })
  }



}
