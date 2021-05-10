import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userLoggedIn: boolean;
  latestContent: string;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.userLoggedIn = false;
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.userLoggedIn = true;
      } else {
        this.userLoggedIn = false;
      }
    });
  }

  loginWithGoogle(): Promise<any> {
    return this.afAuth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(() => {
        this.userLoggedIn = true;
        console.log('Successfully logged with with Google');
      })
      .catch((error) => {
        console.log('error:', error);
        if (error.code) return error;
      });
  }

  logoutUser(): Promise<void> {
    return this.afAuth
      .signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.log('error', error);
        if (error.code) return error;
      });
  }

  addContent(userId: string, content: string) {
    this.afs
      .collection('editor-content')
      .add({
        userId: userId,
        content: content,
        created: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function (res) {
        // console.log(res);
      });
  }

  async getLatestContent(userId: string) {
    await this.afs
      .collection('editor-content', (ref) =>
        ref.where('userId', '==', userId).orderBy('created', 'desc').limit(1)
      )
      .valueChanges()
      .subscribe((value) => {
        this.latestContent = JSON.stringify(value[0]['content']);
        console.log('this.latestContent', this.latestContent);
      });

    // return this.latestContent;
  }
}
