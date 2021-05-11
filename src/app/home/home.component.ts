import { Component, OnInit } from '@angular/core';
import * as MediumEditor from 'medium-editor';
import { AngularFireAuth } from '@angular/fire/auth';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  latestContent: string;
  name: string;
  content: string;

  constructor(
    private afAuth: AngularFireAuth,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const editor = new MediumEditor('.editable');

    const handleContentChange = () => {
      this.content = editor.getContent();

      this.authService.addContent(this.content);
    };

    this.getLatestContent();
    // editor.setContent(this.authService.latestContent);

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        // this.authService.getLatestContent(user.uid);
        this.name = user.displayName.split(' ')[0];
      }
    });

    editor.subscribe('editableInput', handleContentChange.bind(this));
  }

  handleLogout() {
    this.authService.logoutUser();
  }

  getLatestContent() {
    this.authService.getLatestContent().subscribe((value) => {
      this.latestContent = JSON.stringify(value[0]['content']);
      console.log('this.latestContent', this.latestContent);
    });
  }
}
