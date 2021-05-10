import { Component, OnInit } from '@angular/core';
import * as MediumEditor from 'medium-editor';
import { AngularFireAuth } from '@angular/fire/auth';

import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  latestContent: string;
  userId: string;
  name: string;
  content: string;

  constructor(
    private afAuth: AngularFireAuth,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        console.log('get user info:', user);
        this.userId = user.uid;
        this.name = user.displayName.split(' ')[0];
      }
    });

    const editor = new MediumEditor('.editable');

    const handleContentChange = () => {
      this.content = editor.getContent();

      this.authService.addContent(this.userId, this.content);
    };

    editor.subscribe('editableInput', handleContentChange.bind(this));
  }

  handleLogout() {
    this.authService.logoutUser();
  }

  getLatestContent() {
    this.latestContent = this.authService.getLatestContent(this.userId);
  }
}
