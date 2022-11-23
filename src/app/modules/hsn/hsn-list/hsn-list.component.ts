import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Hsn } from 'src/app/models/hsn';
import { HsnService } from 'src/app/services/hsn.service';

@Component({
  selector: 'app-hsn-list',
  templateUrl: './hsn-list.component.html',
  styleUrls: ['./hsn-list.component.css']
})

export class HsnListComponent {

  hsn: Hsn[] = [];
 
  hsnColumns: string[] = ['hsnCode', 'description', 'gstRate'];

  hsnDataSource = new MatTableDataSource<Hsn>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public hsnService: HsnService) { }

  ngOnInit(): void {
    this.getAllHsnList();
  }

  ngAfterViewInit(): void {
    this.hsnDataSource.paginator = this.paginator;
    this.hsnDataSource.sort = this.sort;
  }

  getAllHsnList() {
    this.hsnService.getHsnList().subscribe(
      res => {
        this.hsn = res;
        this.hsnDataSource.data = res;
      },
      err => console.log(err),
      () => console.log("completed")
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.hsnDataSource.filter = filterValue.trim().toLowerCase();
    
    if (this.hsnDataSource.paginator) {
      this.hsnDataSource.paginator.firstPage();
    }
  }

}