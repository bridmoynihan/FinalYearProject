import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {InventoryService} from '../../services/inventory.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public auth: AuthService, public inventory: InventoryService, private router: Router) { }

  ngOnInit() {
  }

  inventoryButtonClick(){
    this.router.navigateByUrl('/welcome');
  }

}
