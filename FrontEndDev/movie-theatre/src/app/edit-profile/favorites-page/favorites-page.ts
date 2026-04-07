import { Component } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
interface Favorites {
  id: number;
  movie: string;
}

@Component({
  selector: 'app-favorites-page',
  imports: [ButtonModule, TableModule, TabsModule],
  templateUrl: './favorites-page.html',
  styleUrl: './favorites-page.scss',
})

export class FavoritesPage {
  favoritesArr: Favorites[] = [
    { id: 1, movie: 'The Matrix' },
    { id: 2, movie: 'Avatar' }
  ]
}