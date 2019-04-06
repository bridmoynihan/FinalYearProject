import { map } from 'rxjs/operators';
import { WasteService } from './../../services/waste.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-waste-view',
  templateUrl: './waste-view.component.html',
  styleUrls: ['./waste-view.component.css']
})

// Implements Pie chart graph and order adjustments
// Using waste service functions to check for document existence & retrieve data 

export class WasteViewComponent implements OnInit {
  public graph
  public wasteTrue: boolean;
  wasteItems: Observable<any[]>
  kgAmount: number
  gramsAmount: number
  lbsAmount: number
  ltrsAmount: number
  dataList: Observable<any[]>
  keyValue = 0
  public dict = []
  public wasteData;
  constructor(public wasteServ: WasteService) {
    this.setGraph(this.kgAmount, this.gramsAmount, this.lbsAmount, this.ltrsAmount)
    this.getTitles();

  }
  // Creates and configures pie chart
  setGraph(kgAmount, gramsAmount, lbsAmount, ltrsAmount) {
    this.graph = {
      data: [{ values: [this.kgAmount, this.gramsAmount, this.lbsAmount, this.ltrsAmount], labels: ["Kilogram Wasted", "Grams Wasted", "Pounds Wasted", "Liters Wasted"], type: 'pie' }],
      layout: { width: 1020, height: 720, title: "Waste Graph: Amounted Wasted Per Month", margin: 'auto' }
    }
  }

  // Calculate total units wasted
  getAmounts(list) {
    this.kgAmount = 0
    this.gramsAmount = 0
    this.lbsAmount = 0
    this.ltrsAmount = 0
    for (let i = 0; i < list.length; i++) {
      if (list[i][1] == "kgs") {
        this.kgAmount = this.kgAmount + +list[i][0]
      }
      else if (list[i][1] == "grams") {
        this.gramsAmount = this.gramsAmount + +list[i][0]
      }
      else if (list[i][1] == "lbs") {
        this.lbsAmount = this.lbsAmount + +list[i][0]
      }
      else if (list[i][1] == "ltrs") {
        this.ltrsAmount = this.ltrsAmount + +list[i][0]
      }
    }
    this.setGraph(this.kgAmount, this.gramsAmount, this.lbsAmount, this.ltrsAmount)
  }

  // Arrays used in order ajustments. Uses item title, quanity wasted and original quanity recorded to adjust next order
  getTitles() {
    let titles = []
    let amount = []
    let orig = []
    this.wasteServ.getData().then(result => {
      for (let x = 0; x < result.titleQntOrig.length; x++) {
        titles.push(result.titleQntOrig[x][0])
        amount.push(result.titleQntOrig[x][1])
        orig.push(result.titleQntOrig[x][2])
      }
      var uniqueItems = Array.from(new Set(titles))
      for (let i = 0; i < uniqueItems.length; i++) {
        this.dict.push({
          key: uniqueItems[i],
          value: [0, 0, 0]
        })
        for (let y = 0; y < result.titleQntOrig.length; y++) {
          if (uniqueItems[i] == result.titleQntOrig[y][0]) {
            this.dict[i].value[0] += +result.titleQntOrig[y][1]
            this.dict[i].value[1] = +result.titleQntOrig[y][2]
            this.dict[i].value[2] = result.titleQntOrig[y][3]
          }
        }
      }
    })
  }

  // Checks if waste collection exists for user
  wasteExists() {
    if (this.wasteItems != undefined) {
      this.wasteTrue = true;
    }
  }

  ngOnInit() {
    this.wasteItems = this.wasteServ.getWasteItem()
    this.wasteItems.subscribe(data => {
      this.wasteData = data;
      return this.wasteData
    })
    this.wasteServ.getData().then(docs => {
      let today = new Date().toLocaleString()
      this.getAmounts(docs.qntList)
    })
    this.wasteExists();
  }
}