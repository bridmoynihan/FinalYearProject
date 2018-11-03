import { Component, ElementRef } from '@angular/core';



@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent {

  loginClick = function(){
    this.router.navigateByUrl('login');
  };
}


