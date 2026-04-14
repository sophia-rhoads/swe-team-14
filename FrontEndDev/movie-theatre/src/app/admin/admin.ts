import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

interface MenuTable { name: string; }
interface Data { id: string; }

@Component({
  selector: 'app-admin',
  imports: [TableModule, FormsModule, SelectModule, ButtonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  tables: MenuTable[] = [];
  viewTable: MenuTable | undefined;
  dataArr: Data[] = [];

  ngOnInit() {
    this.tables = [
      { name: 'Movies' },
      { name: 'Users' },
      { name: 'Promotions' },
      { name: 'Showtimes' }
    ];
    this.dataArr = [{ id: '' }];
  }
}