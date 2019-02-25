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
    // TODO add this inventory exist check to a new component within inventory management replace with a button that directs
    // this.inventoryTrue = this.inventory.inventoryExists().then(val => {
    //   this.inventoryTrue = val
    //   console.log("result: " + val)
    this.inventoryTrue = false;
    //  });
  }

  ngOnInit() {
  }

  inventoryButtonClick(){
    this.router.navigateByUrl('/inventory-list');
  }
  // displayInventoryList(){
  //   this.inventory.displayInventoryList();
  // }




}
