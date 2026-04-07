import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ChangeDetectorRef } from '@angular/core';

import { ProfileService, UpdateProfileRequest, UserProfile } from '../services/profile.service';
import { AuthService } from '../services/auth.services';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TabsModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.scss']
})
export class EditProfile implements OnInit {

  userId!: number;

  // User Info
  userName = '';
  firstName = '';
  lastName = '';
  email = '';
  phoneNum = '';
  dateOfBirth = '';

  password = '';

  // ADDRESS
  usrAddress = '';
  usrCity = '';
  usrState = '';
  usrZipCode = '';

  // UI
  loading = false;
  saveMessage = '';
  errorMessage = '';

  // FAVORITES (placeholder)
  favoriteMovies: any[] = [];

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId()!;
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;

    this.profileService.getProfile(this.userId).subscribe({
      next: (profile) => {
        this.userName = profile.username;
        this.firstName = profile.firstName;
        this.lastName = profile.lastName;
        this.email = profile.email;
        this.phoneNum = profile.phone;
        this.dateOfBirth = profile.dateOfBirth;

        this.usrAddress = profile.address?.homeAddress || '';
        this.usrCity = profile.address?.city || '';
        this.usrState = profile.address?.state || '';
        this.usrZipCode = profile.address?.zipCode || '';

        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load profile';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateProfile() {

    const payload: UpdateProfileRequest = {
      username: this.userName,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      dateOfBirth: this.dateOfBirth,
      phone: this.phoneNum,
      password: this.password?.trim() ? this.password : undefined,

      address: {
        homeAddress: this.usrAddress,
        city: this.usrCity,
        state: this.usrState,
        zipCode: this.usrZipCode
      }
    };

    this.profileService.updateProfile(this.userId, payload).subscribe({
      next: () => {
        this.saveMessage = 'Profile updated successfully';
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Update failed';
        this.saveMessage = '';
      }
    });
  }
}