import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-password-change',
  imports: [InputTextModule, ButtonModule, FormsModule],
  templateUrl: './password-change.html',
  styleUrl: './password-change.scss',
})
export class PasswordChange {
  email!: string;
  oldPassword!: string;
  newPassword!: string;
  newPassword2!: string;
  showError: boolean = false;

  submitPass() {
    if (this.newPassword != this.newPassword2) {
      //in this case, do NOT send to backend
      this.showError = true;
    } else {
      //good to go
      this.showError = false;
      console.log("yippe");
    }
  }

}


