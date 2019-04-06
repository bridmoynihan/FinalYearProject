import { WasteService } from './../../services/waste.service';
import { Item } from './item.model';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs'
import { AngularFireAuth } from 'angularfire2/auth';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { AngularFirestore } from '@angular/fire/firestore';
import { InventoryEditComponent } from './inventory-edit/inventory-edit.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent } from './delete-modal.component';


@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css'],
})

export class InventoryListComponent implements OnInit {
  public inventoryTrue: boolean;
  public barCode: string;
  public days: number;
  uid: string;
  docRef: Observable<any[]>;
  items: Observable<any[]>;
  public itemBarcode: string;
  public itemName: string;
  public expiryDate: Date;
  public isEditable?: false;
  public location?: string;
  public locationBarcode?: string;
  public vendor?: string;
  public quantity?: string;
  public qntType?: string;
  public cost?: string;
  public quality?: string;
  public reorder?: number
  public wasteAmount: number;

  needsReorder = false;
  reorderText: String = "Reorder"
  editMode: boolean = false;
  itemToEdit: any = {};
  public selectedItem: any;
  public data

  onNotify(data: any): void {
    data.item.needsReorder = true;
    this.updateItem(data.item, data.ItemID)
  }

  constructor(public modal: NgbModal, public inventoryServ: InventoryService, public router: Router, public db: AngularFirestore, public waste: WasteService) {

    this.inventoryServ.getUID().then(result => {
      this.uid = String(result)
      return this.uid
    })


    this.inventoryTrue = false;
    this.items = db.collection('inventory' + this.uid).valueChanges();

  }

  ngOnInit(): any {

    this.items = this.db.collection('inventory' + this.uid).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Item;
          const id = a.payload.doc.id;
          return { id, data };
        });

      }));
    this.items.subscribe(
      data => {
        this.data = data
        return this.data
      }

    )
    this.inventoryExists();

    let docList: any[]
    let idList: any[]
    docList = []
    idList = []
    let i = this.db.collection('inventory' + this.uid).ref.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        docList.push(doc.data())
        idList.push(doc.id)
        return { docList, idList }
      })
    })
    i.then(res => {
      for (let i = 0; i <= docList.length - 1; i++) {
        this.qualityCheck(docList[i], idList[i]);
      }
    })
  }

  inventoryExists() {

    if (this.items != undefined) {
      this.inventoryTrue = true;
    }
  }

  setReorder(item) {
    item.item.reorder = true;
    this.updateItem(item.item, item.ItemID)
    return;
  }

  gotoForm() {
    this.router.navigateByUrl('inventory-form')
  }

  setEdit(item, bool) {
    item.data.isEditable = bool;

  }

  saveItem() {
    if (this.itemName && this.itemBarcode && this.expiryDate !== null) {
      let costOfOne = +this.cost / +this.quantity
      let item = {
        itemBarcode: this.itemBarcode,
        itemName: this.itemName,
        expiryDate: this.expiryDate,
        isEditable: false,
        location: this.location,
        locationBarcode: this.locationBarcode,
        vendor: this.vendor,
        quantity: this.quantity,
        qntType: this.qntType,
        cost: this.cost,
        quality: this.quality,
        reorder: this.reorder,
        originalQuant: this.quantity,
        needsReorder: this.needsReorder,
        costOfOne: costOfOne
      };
      if (!this.editMode) {
        this.inventoryServ.addItem(item)
      }
    }
  }
  updateItem(item, id) {
    if (item.isEditable) {
      item.isEditable = false;
    }
    if (item.itemBarcode == undefined) {
      item.itemBarcode = item.data.itemBarcode
    }
    if (item.itemName == undefined) {
      item.itemName = item.data.itemName
    }
    if (item.expiryDate == undefined) {
      item.expiryDate = item.data.expiryDate
    }
    if (item.location == undefined) {
      item.location = item.data.location
    }
    if (item.quality == undefined) {
      item.quality = item.data.quality
    }
    if (item.quantity == undefined) {
      item.quantity = item.data.quantity
    }
    if (item.needsReorder == undefined) {
      item.needsReorder = item.data.needsReorder
    }
    if (item.originalQuant == undefined) {
      item.originalQuant = item.data.originalQuant
    }
    let update = {
      itemBarcode: item.itemBarcode,
      itemName: item.itemName,
      expiryDate: item.expiryDate,
      location: item.location,
      quantity: item.quantity,
      quality: item.quality,
      originalQuant: item.originalQuant,
      needsReorder: item.needsReorder
    }
    this.qualityCheck(update, id);
    this.inventoryServ.updateItem(update, id);
  }

  deleteItem(docID) {
    this.inventoryServ.deleteItem(docID);
  }
  addToWaste(item, amount, type, cost) {
    if (+item.data.quantity <= amount || +item.data.quantity == 0) {
      this.deleteItem(item.id);
      let newAmount = amount - +item.data.quantity;
      this.waste.createWasteDoc(item, newAmount, type, cost);
      return;
    }
    let newAmount = +item.data.quantity - amount;
    this.waste.createWasteDoc(item, amount, type, cost);
    let doc = this.db.collection('inventory' + this.uid).doc(item.id).update({
      "quantity": newAmount,
    });
  }

  checkReorder() { }

  getBarcode() {
    return this.inventoryServ.getBarcode().then(result => {
      this.barCode = String(result);
      this.inventoryServ.inventoryExists(this.barCode).then(ans => {
        this.inventoryTrue = ans;
      });
    })

  }

  displayInventoryList() {
    var doclist
    this.inventoryServ.getBarcode().then(result => {
      this.barCode = String(result);
      doclist = this.inventoryServ.displayInventoryList(this.barCode)
    })
  }
  inventoryButtonClick() {
    this.router.navigateByUrl('/inventory-form');
  }
  qualityCheck(item, id) {
    let exp = item.expiryDate
    let exptime = new Date(exp).getTime();
    let currentDate = new Date().getTime();
    let diff = exptime - currentDate
    this.days = Math.round((diff / (1000 * 60 * 60 * 24)))
    if (this.days >= 29) {
      item.quality = "Great"
      this.inventoryServ.updateItem(item, id)
    }
    else if (this.days >= 14) {
      item.quality = "Ok"
      this.inventoryServ.updateItem(item, id)

    }
    else if (this.days >= 3) {
      item.quality = "Average"
      this.inventoryServ.updateItem(item, id)

    }
    else if (this.days < 3 && this.days > 0) {
      item.quality = "Bad"
      this.inventoryServ.updateItem(item, id)
    }
    else if (this.days <= 0) {
      item.quality = "Expired"
      this.inventoryServ.updateItem(item, id)
    }
  }
}
