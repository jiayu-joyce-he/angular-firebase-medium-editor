import { Component, OnInit } from '@angular/core';
import * as MediumEditor from 'medium-editor';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user: Observable<any>;
  name: string;
  content: string;

  constructor(
    private afAuth: AngularFireAuth,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const editor = new MediumEditor('.editable');

    const handleContentChange = () => {
      console.log('get content:', editor.getContent());
      this.content = editor.getContent();
    };

    editor.subscribe('editableInput', handleContentChange.bind(this));

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.name = user.displayName.split(' ')[0];
      }
    });
  }

  handleLogout() {
    this.authService.logoutUser();
  }
}
