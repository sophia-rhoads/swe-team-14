import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-logout-page',
  imports: [ButtonModule, RouterLink],
  templateUrl: './logout-page.html',
  styleUrl: './logout-page.scss',
})
export class LogoutPage {


}
