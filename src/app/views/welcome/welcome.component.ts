import {Component, ElementRef, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome-component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnInit{
  user = null;
  constructor(private router: Router, private authService: AuthService) {
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle()
      .then((resolve) => this.router.navigate(['dashboard']))
      .catch((error) => console.log(error));
  }

  ngOnInit() {
  }
}




