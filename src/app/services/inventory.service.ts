import { Item } from './../views/inventoryView/item.model';
import {Injectable, OnInit} from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs'

// export interface Item {
//   id: string;
// }

@Injectable()
export class InventoryService implements OnInit {
  items: AngularFirestoreCollection<Item>;
  itemDoc: AngularFirestoreDocument<Item>;
  uid: string;
 
  private CollectRef: AngularFirestoreCollection<Item>;
  barCode: string;

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(
      user => {
        if (user) {
          this.uid = user.uid;
          this.items = this.db.collection<Item>('inventory' + this.uid)
          console.log("creating inventory2 " + this.uid);
          return user.uid;
        }
      }
    );
    

  }

  displayInventoryList(barcode): any {
    const docs = []
   const docRef = this.db.collection('inventory'+ this.uid).ref.get()
   .then(function(querySnapshot){
     querySnapshot.forEach(function(doc){
       docs.push(doc.data());
     })
   })
  
   return docs;
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

  addItem(item){
    this.items.add(item);
  }

  updateItem(item, docID){
    console.log(docID)
    this.itemDoc = this.db.doc<Item>('inventory' + this.uid + `/${docID}`)
    this.itemDoc.update(item);
  }
  deleteItem(barcode){
    this.itemDoc = this.items.doc(barcode)
    this.itemDoc.delete().then(function() {
  }).catch(function(error) {
      console.error("Error removing document: ", error);
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
  getBarcode(){
    var promise = new Promise(resolve => {
    const CollectRef = this.db.collection('inventory' + this.uid).ref
    .get().then(snapShot => {
      snapShot.docs.forEach(doc => {
        this.barCode = doc.id
        console.log("id" + this.barCode)
        resolve(this.barCode)
      })
    });
  })
  return promise;
      

    }

  ngOnInit(): any {

  }
}