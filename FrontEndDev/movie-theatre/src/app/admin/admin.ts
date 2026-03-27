import { Component, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CommonModule, NgIf } from '@angular/common';

interface MenuTables {
  name: String;
}

interface Data {
  id: String;
}

@Component({
  selector: 'app-admin',
  imports: [TableModule, FormsModule, SelectModule, ButtonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  tables?: MenuTables[];
  viewTable?: MenuTables | undefined;
  dataArr!: Data[];
  
  ngOnInit() {

    this.tables = [
      { name: 'Movies'}, 
      { name: 'Users'},
      { name: 'Promotions'},
      { name: 'Showtimes'}
    ];

    this.dataArr = [
      {id: ''}
    ]

    console.log(this.viewTable?.name);
  } 

}
