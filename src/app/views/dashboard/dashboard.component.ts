import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {InventoryService} from '../../services/inventory.service';
import {Router} from '@angular/router';
import { AngularFirestore} from '@angular/fire/firestore';
import {NavbarComponent} from '../navbar/navbar.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  inventoryTrue: boolean;

  constructor(private db: AngularFirestore, public auth: AuthService, public inventory: InventoryService, private router: Router) {
    this.inventoryTrue = this.inventory.inventoryExists().then(val => {
      this.inventoryTrue = val;
      return this.inventoryTrue;
    });
  }

  ngOnInit() {
  }

  inventoryButtonClick(){
    this.router.navigateByUrl('/welcome');
  }

  createInventory(){
    this.inventory.createInventoryList();
  }




}
