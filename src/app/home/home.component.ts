import { Component, OnInit } from '@angular/core';
import * as MediumEditor from 'medium-editor';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  userId: string;
  name: string;
  content: string;

  constructor(
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private firestore: AngularFirestore // private realTimeDb: AngularFireDatabase,
  ) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.name = user.displayName.split(' ')[0];
      }
    });

    const editor = new MediumEditor('.editable');

    const handleContentChange = () => {
      console.log('get content:', editor.getContent());
      this.content = editor.getContent();

      this.firestore
        .collection('editor-content')
        .add({ userId: this.userId, content: this.content })
        .then(function (res) {
          console.log(res);
        });
    };

    editor.subscribe('editableInput', handleContentChange.bind(this));
  }

  handleLogout() {
    this.authService.logoutUser();
  }
}
