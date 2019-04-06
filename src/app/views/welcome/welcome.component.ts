import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome-component.html',
  styleUrls: ['./welcome.component.css'],
})

// Initiates sign in process when user presses Log in With Google button
export class WelcomeComponent implements OnInit {
  user = null;
  constructor(private router: Router, private authService: AuthService) {
  }
// Uses authentication service to perform sign in with google.
// Routes to dashboard if authenticated, else stay on welcome view and display error
  signInWithGoogle() {
    this.authService.signInWithGoogle()
      .then((resolve) => this.router.navigate(['dashboard']))
      .catch((error) => console.log(error));
  }

  ngOnInit() {
  }
}




