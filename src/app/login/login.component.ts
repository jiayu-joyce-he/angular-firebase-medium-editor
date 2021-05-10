import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isLoggedIn: boolean = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.userLoggedIn) {
      this.isLoggedIn = true;
      this.router.navigate(['/dashboard']);
    }
  }

  loginUser() {
    this.authService.loginWithGoogle().then((result) => {
      if (result == null) {
        this.router.navigate(['/home']);
      } else if (result.isValid == false) {
        console.log('login error', result);
      }
    });
  }
}
