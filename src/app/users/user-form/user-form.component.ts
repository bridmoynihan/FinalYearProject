import { Component, OnInit } from '@angular/core';
import {User} from '../user';
//use data service to get and save real data

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  model = new User(10, 'Brid', 'Moynihan', 'moynihanbrid@gmail.com', '1234abcd');
  submitted = false;
  onSubmit(){this.submitted = true;}
  get diagnostic() {return JSON.stringify(this.model);}
  constructor() { }

  ngOnInit() {
  }

}
