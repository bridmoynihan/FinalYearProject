import { Item } from './item.model';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { WasteService } from './../../services/waste.service';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: 'delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})

// Delete modal class opens deletion modal and provides functionality surrounding generating waste and updating item quantity
export class DeleteModalComponent {
  // Gets item and item id input passed from parent component 
  @Input() Item: Item;
  @Input() ItemID: string;
  closeResult: string;
  uid: string;
  wasteQuant: number;
  needsReorder: boolean = false

  // Outputs notification to parent component when item reorder is true
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();

  constructor(private modalService: NgbModal, public inventoryServ: InventoryService, public db: AngularFirestore, public waste: WasteService) {
    this.inventoryServ.getUID().then(result => {
      this.uid = String(result)
      return this.uid
    })
  }

  // Opens deletion modal
  open(content) {
    this.modalService.open(content, {
      windowClass: 'dark-modal',
      ariaLabelledBy: 'modal-basic-title'
    });
  }
  getItem(itemID) {

  }

  // Deletes item with no waste associated
  deleteItem(docID) {
    this.inventoryServ.deleteItem(docID);
  }
  // Adds item to waste. Checks if current quantity is less than the amount trying to be wasted or if current quantity is zero
  // If true item is deleted from inventory and appropriate amount wasted is added to waste document
  // If new item quantity is equal to or less than the reorder level of that item a notification is sent to 
  // the parent component
  addToWaste(item, ItemID, wasteQuant, type, cost) {
    if (+item.quantity <= wasteQuant || + item.quantity == 0) {
      this.deleteItem(ItemID);
      let newAmount = wasteQuant - +item.quantity;
      this.waste.createWasteDoc(item, newAmount, type, cost);
      return;
    }
    let newAmount = +item.quantity - wasteQuant;
    if (newAmount <= +item.reorder) {
      item.needsReorder = true;
      let data = { item, ItemID }
      this.notify.emit(data);
    }
    this.waste.createWasteDoc(item, wasteQuant, type, cost);
    let doc = this.db.collection('inventory' + this.uid).doc(ItemID).update({
      "quantity": newAmount,
      "needsReorder": item.needsReorder,
      "originalQuant": item.originalQuant
    });
  }

  // Removes quanity from item without waste and checks if reorder level has been reached.
  removeQuant(item, itemID, quant) {
    if (+item.quantity <= quant || +item.quantity == 0) {
      this.deleteItem(itemID);
      return
    }
    let newAmount = +item.quantity - quant;
    if (newAmount <= +item.reorder) {
      item.needsReorder = true;
      let data = { item, itemID }
      this.notify.emit(data);
    }
    let newDoc = {
      itemBarcode: item.itemBarcode,
      itemName: item.itemName,
      expiryDate: item.expiryDate,
      location: item.location,
      locationBarcode: item.locationBarcode,
      reorder: item.reorder,
      needsReorder: item.needsReorder,
      originalQuant: item.originalQuant,
      quality: item.quality,
      cost: item.cost,
      quantity: newAmount,
      qntType: item.type,

    }
    this.inventoryServ.updateItem(newDoc, itemID)

  }
}