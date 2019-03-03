import { Item } from './item.model';
import { Component, Input } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { WasteService } from './../../services/waste.service';
import {InventoryService} from '../../services/inventory.service';

@Component({
    selector: 'app-delete-modal',
    templateUrl: 'delete-modal.component.html'
  })
  export class DeleteModalComponent {
    @Input() Item: Item;
    @Input() ItemID: string;
    closeResult: string;
    uid: string;
    wasteQuant: number;

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
      this.waste.createWasteDoc(item, wasteQuant, type, cost);
      let doc = this.db.collection('inventory' + this.uid).doc(ItemID).update({
        "quantity": newAmount,
      });
    }
  }