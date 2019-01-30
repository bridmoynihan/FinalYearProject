import {Component, Input
} from '@angular/core';

@Component({
  selector: 'cost-display',
  template: './cost-display.component.html'
})

export class CostDisplayComponent{
  @Input() price: number;
}
