import { Component } from '@angular/core';

@Component({
  selector: 'app-left-navigation-menu',
  templateUrl: './left-navigation-menu.component.html',
  styleUrls: ['./left-navigation-menu.component.css']
})
export class LeftNavigationMenuComponent {

  links : link[] = [
    {
      label : 'Items List',
      route: '/item-list'
    },
    {
      label: 'Distributors List',
      route: '/distributor-list'
    },
    {
      label: 'HSN List',
      route: '/hsn-list'
    },
    {
      label: 'Invoice List',
      route: '/invoice-list'
    }
  ];
}

export interface link {
  label:string;
  route:string;
}