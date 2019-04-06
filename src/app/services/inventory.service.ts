import { Item } from './../views/inventoryView/item.model';
import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'

@Injectable()

// Implements Firebase functionality for the creation, updating, reading and deletion of Inventory items
export class InventoryService implements OnInit {
  items: AngularFirestoreCollection<Item>;
  itemDoc: AngularFirestoreDocument<Item>;
  uid: string;
  ingredList = []

  private CollectRef: AngularFirestoreCollection<Item>;
  barCode: string;

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(
      user => {
        if (user) {
          this.uid = user.uid;
          this.items = this.db.collection<Item>('inventory' + this.uid)
          return user.uid;
        }
      }
    );


  }

  // Fetches and returns inventory items from user's inventory
  displayInventoryList(barcode): any {
    const docs = []
    const docRef = this.db.collection('inventory' + this.uid).ref.get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          docs.push(doc.data());
        })
      })

    return docs;
  }
  // Creates inventory collection in Firebase
  createInventory(barcode, entryDate) {
    const docRef = this.db.collection('inventory' + this.uid).doc(barcode)
    docRef.set({ creationDate: entryDate }, { merge: true }).then(function () {
      console.log("Inventory Successfully created");
    })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  }
// Checks if inventory document exists based on boolean returned 
  inventoryExists(barcode): any {
    return this.getUID().then(result => {
      this.uid = String(result)
      const docRef = this.db.collection('inventory' + this.uid).doc(barcode)

      return docRef.ref.get().then(doc => {
        if (doc.exists) {
          return true;
        } else {
          return false;
        }
      }
      ).catch(function (error) {
        console.log('Error getting document: ', error);
      });
    });
  }
// Add items to Firebase document
  addItem(item) {
    this.items.add(item);
  }
// Update items in Firebase inventory collection.
  updateItem(update, docID) {
    this.itemDoc = this.db.doc<Item>('inventory' + this.uid + `/${docID}`)
    this.itemDoc.update({
      itemName: update.itemName,
      itemBarcode: update.itemBarcode,
      expiryDate: update.expiryDate,
      location: update.location,
      quality: update.quality,
      quantity: update.quantity,
      needsReorder: update.needsReorder
    });

  }
  // Delete documents in Firebase inventory collection
  deleteItem(barcode) {
    this.itemDoc = this.items.doc(barcode)
    this.itemDoc.delete().then(function () {
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });;
  }

  // Returns all documents that have a quality field value of 'Bad'
  getBadItemsRef() {
    return this.db.collection<Item>('inventory' + this.uid, reference => reference.where('quality', '==', 'Bad')).valueChanges()
  }

  getUID() {
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
  getBarcode() {
    var promise = new Promise(resolve => {
      const CollectRef = this.db.collection('inventory' + this.uid).ref
        .get().then(snapShot => {
          snapShot.docs.forEach(doc => {
            this.barCode = doc.id
            resolve(this.barCode)
          })
        });
    })
    return promise;


  }

  ngOnInit(): any {

  }
}