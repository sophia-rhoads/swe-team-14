import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DialogModule } from 'primeng/dialog';

interface PaymentCard {
  id: number;
  cardName: string;
  cardNum: string;
  expDate: string;
  billingAdd: string;
  cardCounty: string;
  state: string;
  zipCode: string;   
 }

@Component({
  selector: 'app-edit-profile',
  imports: [CommonModule, ButtonModule, RouterLink, InputTextModule, FormsModule, CheckboxModule, FloatLabelModule, DialogModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.scss',
  standalone: true
})

export class EditProfile {
  showModal: boolean = false;
  cardLimit: boolean = false;
  cardShow: boolean = false;
  clickCard: boolean = false;
  numCards: number = 0;
  cardArr: PaymentCard[] = [];
  //promotions
  promotions: any = null;

  public disableUsrInfo: boolean = true; 

  usrName = 'User Name';
  password = 'pswd123';
  email = 'username@mail.com';
  phoneNum = '123-456-7890';

  public disableHomeAdd: boolean = true; 

  usrAddress = '123 Sample Street Road';
  usrCounty = 'County';
  usrState = 'Georgia';
  usrZip = '12345';

  //this could be better.
  editUsrInfo() {
    this.disableUsrInfo = false;
  }

  saveUsrInfo() {
    this.disableUsrInfo = true;
  }

  editAddInfo() {
    this.disableHomeAdd = false;
  }

  saveAddInfo() {
    this.disableHomeAdd = true;
  }

  clickNewCard() {
    if (this.numCards < 3) {
      this.clickCard = true;
      this.cardLimit = false;
    } else {
      this.cardLimit = true;
    }
  }

  // editPaymentCard(index: number) {
  //   console.log(this.cardArr[index]);
  //   this.showModal = true;
  // }

  showEditModal() {
    this.showModal = true;
    console.log("Help??", this.showModal);
  }

  editCard() {
    console.log("yeah");
  }

  addPaymentCard() {
    if (this.cardArr.length < 3) {
      const newCard: PaymentCard = {id: this.numCards, cardName: "", cardNum: "", expDate: "", billingAdd: "", cardCounty: "", state: "", zipCode: ""};
      console.log(this.numCards);
      this.cardArr.push(newCard);
      console.log('added card: ', this.cardArr[this.numCards].id);
      this.numCards++;
      this.clickCard = false;
    }
  }

  removePaymentCard(index: number) {
      console.log('removed card: ', this.cardArr[index].id);
      this.cardArr.splice(index, 1);
      for (let i = 0; i < this.cardArr.length; i++) {
        this.cardArr[i].id = i;
      }
      this.numCards--;
    
  }

}
