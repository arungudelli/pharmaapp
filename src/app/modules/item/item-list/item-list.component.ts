import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Invoice } from 'src/app/models/invoice';
import { Item } from 'src/app/models/item';
import { InvoiceService } from 'src/app/services/invoice.service';
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
  
  invoiceColumns: string[] = ['invoiceNumber', 'invoiceDate', 'name', 'pack', 'batchNo', 'mfgDate', 'expDate', 'qty'];

  invoice: Invoice[] = [];

  itemDataSource = new MatTableDataSource<Item>();
  
  invoiceDataSource = new MatTableDataSource<Invoice>();

  totalQty:number = 0;

  constructor(public dialog: MatDialog, public itemService: ItemService, public invoiceService: InvoiceService) {
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
    )
  }

  getInvoicesBySelectedItem(itemId: any) {
    // console.log(itemId);
    this.invoiceService.getInvoiceByItemId(itemId).subscribe(
      res => {
        // console.log(res);
        this.invoice = res as Invoice[];
        this.totalQty = this.invoice.map(x=>x.invoiceItems.map(y=>y.qty).at(0)).reduce((a,b)=>a!+b!,0) as number;
        this.invoiceDataSource.data = res as Invoice[];
      }
    )
  }

  editItemDialog(item: Item) {
    this.dialog.open(EditItemComponent, {data: {item}});
  }

}