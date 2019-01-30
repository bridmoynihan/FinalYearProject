import {Component, EventEmitter, Input, Output} from '@angular/core';

import {Item} from './item.model';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html'
})

export class InventoryListComponent {
  @Input() inventoryList: Item[];

  @Output() onItemSelected: EventEmitter<Item>;

  private currentItem: Item;

  constructor(){
    this.onItemSelected = new EventEmitter();
  }

  clicked(item: Item): void {
    this.currentItem = item;
    this.onItemSelected.emit(item);
  }

  isSelected(item: Item): boolean {
    if(!item || !this.currentItem){
      return false;
    }
    return item.barcode === this.currentItem.barcode;
  }
}
