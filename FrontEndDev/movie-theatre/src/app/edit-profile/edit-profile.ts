import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DialogModule } from 'primeng/dialog';
import { HttpClientModule } from '@angular/common/http';
import { ProfileService, UpdateProfileRequest, UserProfile } from '../services/profile.service';
import { AuthService } from '../services/auth.service';

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
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RouterLink,
    InputTextModule,
    FormsModule,
    CheckboxModule,
    FloatLabelModule,
    DialogModule,
    HttpClientModule
  ],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.scss'
})
export class EditProfile implements OnInit {
  showModal: boolean = false;
  cardLimit: boolean = false;
  cardShow: boolean = false;
  clickCard: boolean = false;
  numCards: number = 0;
  cardArr: PaymentCard[] = [];
  promotions: any = null;

  public disableUsrInfo: boolean = true;
  public disableHomeAdd: boolean = true;

  userId: number = 1; // for now hardcode; later replace with logged-in user id

  usrName = '';
  password = '';
  email = '';
  phoneNum = '';

  usrAddress = '';
  usrCounty = '';
  usrState = '';
  usrZip = '';

  loading = false;
  saveMessage = '';
  errorMessage = '';

  constructor(private profileService: ProfileService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId()!;
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';

    this.profileService.getProfile(this.userId).subscribe({
      next: (profile: UserProfile) => {
        this.usrName = profile.username;
        this.email = profile.email;
        this.phoneNum = profile.phoneNumber ?? '';
        this.usrAddress = profile.homeAddress ?? '';
        this.usrCounty = profile.county ?? '';
        this.usrState = profile.state ?? '';
        this.usrZip = profile.zipCode ?? '';
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile', error);
        this.errorMessage = 'Failed to load profile.';
        this.loading = false;
      }
    });
  }

  editUsrInfo() {
    this.disableUsrInfo = false;
    this.saveMessage = '';
  }

  saveUsrInfo() {
    this.updateProfile(false);
  }

  editAddInfo() {
    this.disableHomeAdd = false;
    this.saveMessage = '';
  }

  saveAddInfo() {
    this.updateProfile(true);
  }

  updateProfile(fromAddressSection: boolean): void {
    this.errorMessage = '';
    this.saveMessage = '';

    const payload: UpdateProfileRequest = {
      username: this.usrName,
      phoneNumber: this.phoneNum,
      password: this.password?.trim() ? this.password : undefined,
      homeAddress: this.usrAddress,
      county: this.usrCounty,
      state: this.usrState,
      zipCode: this.usrZip
    };

    this.profileService.updateProfile(this.userId, payload).subscribe({
      next: (updatedProfile) => {
        this.usrName = updatedProfile.username;
        this.email = updatedProfile.email;
        this.phoneNum = updatedProfile.phoneNumber ?? '';
        this.usrAddress = updatedProfile.homeAddress ?? '';
        this.usrCounty = updatedProfile.county ?? '';
        this.usrState = updatedProfile.state ?? '';
        this.usrZip = updatedProfile.zipCode ?? '';

        this.disableUsrInfo = true;
        this.disableHomeAdd = true;
        this.saveMessage = fromAddressSection
          ? 'Home address updated successfully.'
          : 'User details updated successfully.';
      },
      error: (error) => {
        console.error('Error updating profile', error);
        this.errorMessage = 'Failed to update profile.';
      }
    });
  }

  clickNewCard() {
    if (this.numCards < 3) {
      this.clickCard = true;
      this.cardLimit = false;
    } else {
      this.cardLimit = true;
    }
  }

  showEditModal() {
    this.showModal = true;
  }

  editCard() {
    console.log('Update card');
  }

  addPaymentCard() {
    if (this.cardArr.length < 3) {
      const newCard: PaymentCard = {
        id: this.numCards,
        cardName: '',
        cardNum: '',
        expDate: '',
        billingAdd: '',
        cardCounty: '',
        state: '',
        zipCode: ''
      };
      this.cardArr.push(newCard);
      this.numCards++;
      this.clickCard = false;
    }
  }

  removePaymentCard(index: number) {
    this.cardArr.splice(index, 1);
    for (let i = 0; i < this.cardArr.length; i++) {
      this.cardArr[i].id = i;
    }
    this.numCards--;
  }
}