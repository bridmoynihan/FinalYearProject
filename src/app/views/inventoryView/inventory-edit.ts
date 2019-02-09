import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore'

@Component({
  selector: 'app-inventory-edit',
  templateUrl: 'inventory-edit.component.html',
  styleUrls: ['inventory-edit.component.css']
})
export class CompanyEditComponent implements OnInit {
  constructor(private db: AngularFirestore) {
  }
  ngOnInit(){}

}
