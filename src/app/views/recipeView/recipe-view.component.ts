import { Item } from './../inventoryView/item.model';
import { Observable } from 'rxjs';
import { HttpModule } from '@angular/http';
import { InventoryService } from './../../services/inventory.service';
import { Component, OnInit } from '@angular/core';
import {Http} from '@angular/http'
import { ValueTransformer } from '@angular/compiler/src/util';
import * as _ from 'lodash';

interface Recipe {
  title: string;
  thumbnail:string;
}


@Component({
    selector: 'app-recipe-view',
    templateUrl: './recipe-view.component.html',
    styleUrls: ['./recipe-view.component.css']
  })
  export class RecipeViewComponent implements OnInit {
    recipeList: Observable<Recipe>;
    private requestString = "https://cors-anywhere.herokuapp.com/http://www.recipepuppy.com/api/?i=" 
    public ingredientList = []
    constructor(public inventServ: InventoryService, public http: Http){}

  getIngredientList(){
    return this.inventServ.getBadItems().then(ingredient => {
      for(let x=0; x<ingredient.length; x++){
          this.ingredientList.push(String(ingredient[x]))
      }
      return this.ingredientList
  })
  
}
  getRecipeList(ingredientList){
    let ingredientString = this.ingredientList.map(ingredient => 
      String(ingredient)
    )
    this.requestString = this.requestString + ingredientString;
    return this.http.get(this.requestString).map(data => data.json())
  }


  ngOnInit() {
    this.getIngredientList().then(list => {
      this.getRecipeList(list).subscribe(
        recipe => {
          //use recipe information here!!
          console.log("recipies are ", recipe.results)
        },
        error => console.log("error is " + error),
        () => console.log("Complete!")
      )
    })
  }
     
}
