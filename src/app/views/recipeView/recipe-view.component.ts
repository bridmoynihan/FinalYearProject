import { Item } from './../inventoryView/item.model';
import { Observable } from 'rxjs';
import { HttpModule } from '@angular/http';
import { InventoryService } from './../../services/inventory.service';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http'
import { ValueTransformer } from '@angular/compiler/src/util';
import * as _ from 'lodash';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.css']
})

// Fetches items in Firebase inventory collection which are marked with 'Bad' quality
// Runs http get to retrieve list of potential recipes matching 'Bad' ingredients
export class RecipeViewComponent implements OnInit {
  public recipeList = [];
  public items;
  public itemsTrue: boolean;
  // CORS proxy used prefixing recipe generator API used
  private requestString = "https://cors-anywhere.herokuapp.com/http://www.recipepuppy.com/api/?i="
  public ingredientList = []
  constructor(public inventServ: InventoryService, public http: Http) { }

  // Adds ingredients fetched to the end of the request string as parameters for the api
  // Performs get request and maps results to JSON format.
  getRecipeList(ingredientList) {
    let ingredientString = ingredientList.map(ingredient =>
      String(ingredient)
    )
    this.requestString = this.requestString + ingredientString;
    return this.http.get(this.requestString).map(data => data.json().results)
  }

  // Check if any 'Bad' items exist
  itemsExist() {
    if (this.items != undefined) {
      this.itemsTrue = true;
    }
  }

// Uses Inventory Service to get bad items in inventory collection 
  ngOnInit() {
    let ingredList = []
    this.inventServ.getBadItemsRef().subscribe(
      data => {
        data.forEach(doc => {
          ingredList.push(doc.itemName)
        })
        this.items = this.getRecipeList(ingredList)
        this.itemsExist();
      })
  }

}
