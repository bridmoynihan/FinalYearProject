import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { auth } from 'firebase';

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
  signInWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }
  private oAuthLogin(provider) {
    return this._firebaseAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserDetails(credential.user)
      })
  }
  logout() {
    this._firebaseAuth.auth.signOut().then((res) => this.router.navigate(['/welcome']));
  }

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
