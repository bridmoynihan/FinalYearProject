import { Item } from './item.model';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { WasteService } from './../../services/waste.service';
import {InventoryService} from '../../services/inventory.service';

@Component({
    selector: 'app-delete-modal',
    templateUrl: 'delete-modal.component.html',
    styleUrls: ['./delete-modal.component.css']
  })
  export class DeleteModalComponent {
    @Input() Item: Item;
    @Input() ItemID: string;
    closeResult: string;
    uid: string;
    wasteQuant: number;
    needsReorder: boolean = false

    @Output() notify: EventEmitter<any> = new EventEmitter<any>();

    constructor(private modalService: NgbModal, public inventoryServ: InventoryService, public db: AngularFirestore, public waste: WasteService) {
      this.inventoryServ.getUID().then(result => {
        this.uid = String(result)
        return this.uid
      })
    }

    open(content){
        this.modalService.open(content, { 
            windowClass: 'dark-modal', 
            ariaLabelledBy: 'modal-basic-title' 
    });
}
    getItem(itemID){

    }

    deleteItem(docID){
      this.inventoryServ.deleteItem(docID);
    }
    addToWaste(item, ItemID, wasteQuant, type, cost){
      if(+item.quantity <= wasteQuant || + item.quantity == 0){
        this.deleteItem(ItemID);
        let newAmount = wasteQuant - +item.quantity;
        this.waste.createWasteDoc(item, newAmount, type, cost);
        return;
      }
      let newAmount = +item.quantity - wasteQuant;
      if(newAmount <= +item.reorder){
        item.needsReorder = true;
        let data = {item, ItemID}
        this.notify.emit(data);
      }
      this.waste.createWasteDoc(item, wasteQuant, type, cost);
      let doc = this.db.collection('inventory' + this.uid).doc(ItemID).update({
        "quantity": newAmount,
        "needsReorder": item.needsReorder,
        "originalQuant":item.originalQuant
      });
    }
    removeQuant(item, itemID, quant){
      if(+item.quantity <= quant || +item.quantity == 0){
        this.deleteItem(itemID);
        return
      }
      let newAmount = +item.quantity - quant;
      if(newAmount <= +item.reorder){
        item.needsReorder = true;
        let data = {item, itemID}
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