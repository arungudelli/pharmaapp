import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Item } from 'src/app/models/item';
import { ItemService } from 'src/app/services/item.service';
import { EditItemComponent } from '../edit-item/edit-item.component';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})

export class ItemListComponent {
  item: Item[] = [];

  selectedItem : Item;

  itemColumns: string[] = ['Item Name', 'Item Description'];

  itemDataSource = new MatTableDataSource<Item>();

  constructor(public dialog: MatDialog, public itemService: ItemService) {
    this.selectedItem = {} as Item;
  }

  ngOnInit(): void {
    this.getAllItems();
  }

  openItemDialog() {
    this.dialog.open(EditItemComponent);
  }

  getAllItems() {
    this.itemService.getItems().subscribe(
      res => {
        this.item = res;
        this.itemDataSource.data = res;
      },
      err => console.log(err),
      () => console.log("completed")
    )
  }

  editItemDialog(item: Item) {
    this.dialog.open(EditItemComponent, {data: {item}});
  }

}