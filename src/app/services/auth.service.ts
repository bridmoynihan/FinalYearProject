import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { auth } from 'firebase';


// Auth Service provides sign in functionality using Google and log out.

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
}

@Injectable({ providedIn: 'root' })

export class AuthService {
  user: Observable<User>;


  constructor(
    private _firebaseAuth: AngularFireAuth,
    private _angularFirestore: AngularFirestore,
    private router: Router
  ) {

    this.user = this._firebaseAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this._angularFirestore.doc<User>('users/' + user.uid).valueChanges()
        } else {
          return of(null)
        }
      })
    )
  }
  // Starts sign in and passes Google provider to oAuth Login
  signInWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }
  //Opens modal pop up to signin with Google, passes access token to update
  private oAuthLogin(provider) {
    return this._firebaseAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserDetails(credential.user)
      })
  }
  logout() {
    this._firebaseAuth.auth.signOut().then((res) => this.router.navigate(['/welcome']));
  }
// Updates Firestore Document with uid (User Identification)
  private updateUserDetails(user) {
    const userRef: AngularFirestoreDocument<any> = this._angularFirestore.doc('users/' + user.uid);

    const details: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }
    return userRef.set(details, { merge: true })
  }
}
