import { Item } from './../inventoryView/item.model';
import { Observable } from 'rxjs';
import { HttpModule } from '@angular/http';
import { InventoryService } from './../../services/inventory.service';
import { Component, OnInit } from '@angular/core';
import {Http} from '@angular/http'
import { ValueTransformer } from '@angular/compiler/src/util';
import * as _ from 'lodash';

@Component({
    selector: 'app-recipe-view',
    templateUrl: './recipe-view.component.html',
    styleUrls: ['./recipe-view.component.css']
  })
  export class RecipeViewComponent implements OnInit {
    public recipeList = [];
    public items;
    private requestString = "https://thingproxy.freeboard.io/fetch/http://www.recipepuppy.com/api/?i=" 
    public ingredientList = []
    constructor(public inventServ: InventoryService, public http: Http){}

  getRecipeList(ingredientList){
    let ingredientString = ingredientList.map(ingredient => 
      String(ingredient)
    )
    console.log("ingredient string " + ingredientString)
    this.requestString = this.requestString + ingredientString;
    return this.http.get(this.requestString).map(data => data.json().results)
  }


  ngOnInit() {
    let ingredList = []
    this.inventServ.getBadItemsRef().subscribe(
      data => {
        data.forEach(doc => {
          ingredList.push(doc.itemName)
        })
        this.items = this.getRecipeList(ingredList)
      })
  }
     
}
