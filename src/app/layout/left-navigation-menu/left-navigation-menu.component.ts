import { Component } from '@angular/core';

@Component({
  selector: 'app-left-navigation-menu',
  templateUrl: './left-navigation-menu.component.html',
  styleUrls: ['./left-navigation-menu.component.css']
})
export class LeftNavigationMenuComponent {

  links : link[] = [
    {
      label : 'Add Item',
      route: '/item-list'
    },
    {
      label: 'Add Distributor',
      route: '/distributor-list'
    },
    {
      label: 'HSN List',
      route: '/hsn-list'
    }
  ];
}

export interface link {
  label:string;
  route:string;
}
