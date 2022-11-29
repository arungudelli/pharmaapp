import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: Element[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-selection-table',
  templateUrl: './selection-table.component.html',
  styleUrls: ['./selection-table.component.css']
})

export class SelectionTableComponent {
  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
  data = Object.assign( ELEMENT_DATA);
  dataSource = new MatTableDataSource<Element>(this.data);
  selection = new SelectionModel<Element>(true, []);

  /* Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  removeSelectedRows() {
    this.selection.selected.forEach(item => {
      let index: number = this.data.findIndex((d: Element) => d === item);
      console.log(index);
      this.data.splice(index,1)
      // console.log(this.data.splice(index,1));
      this.dataSource = new MatTableDataSource<Element>(this.data);
      console.log(this.dataSource.data);
    });
    this.selection = new SelectionModel<Element>(true, []);
  }

  /* Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /* The label for the checkbox on the passed row */
  checkboxLabel(row?: Element): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    } else {
      // console.log(row, typeof(row));
      // console.log(row);
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }
  }
  
}