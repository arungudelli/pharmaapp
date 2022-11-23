import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Distributor } from 'src/app/models/distributor';
import { DistributorService } from 'src/app/services/distributor.service';
import { EditDistributorComponent } from '../edit-distributor/edit-distributor.component';

@Component({
  selector: 'app-distributor-list',
  templateUrl: './distributor-list.component.html',
  styleUrls: ['./distributor-list.component.css']
})

export class DistributorListComponent {
  distributor: Distributor[] = [];

  selectedDistributor: Distributor;

  distributorColumns: string[] = ['Distributor', 'Amount'];

  distributorDatasource = new MatTableDataSource<Distributor>();

  constructor(public dialog: MatDialog, public distributorService: DistributorService) { 
    this.selectedDistributor = {} as Distributor;
  }

  ngOnInit(): void {
    this.getAllDistributors();
  }

  openDistributorDialog() {
    this.dialog.open(EditDistributorComponent);
  }

  getAllDistributors() {
    this.distributorService.getDistributors().subscribe(
      res => {
        this.distributor = res;
        this.distributorDatasource.data = res;
      },
      err => console.log(err),
      () => console.log("completed")
    )
  }

  editSelectedDistributor(distributor: Distributor[]) {
    this.dialog.open(EditDistributorComponent, {data: {distributor}});
  }
}