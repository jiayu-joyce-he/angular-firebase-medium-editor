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
  editor: MediumEditor.MediumEditor;

  constructor(
    private afAuth: AngularFireAuth,
    private authService: AuthService
  ) {}

  ngOnChanges(): void {
    // this.editor.setContent(this.latestContent);
  }

  ngOnInit(): void {
    this.editor = new MediumEditor('.editable');

    const handleContentChange = () => {
      this.content = this.editor.getContent();

      this.authService.addContent(this.content);
    };

    this.getLatestContent();
    console.log('undefined???', this.latestContent);

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.name = user.displayName.split(' ')[0];
      }
    });

    this.editor.subscribe('editableInput', handleContentChange.bind(this));
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
