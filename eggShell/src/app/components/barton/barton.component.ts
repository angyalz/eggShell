import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { environment } from 'src/environments/environment';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-barton',
  templateUrl: './barton.component.html',
  styleUrls: ['./barton.component.scss']
})
export class BartonComponent implements OnInit {

  isOpen: boolean = false;

  URL = environment.apiUrl;

  barton: Array<any> = [];
  poultry: Array<any> = [
    {
      species: 'tyúk',
      image: `${this.URL}images/poultries/hen.png`,
      qty: 6,
    },
    {
      species: 'kakas',
      image: `${this.URL}images/poultries/rooster2.png`,
      qty: 1,
    },
    {
      species: 'kacsa',
      image: `${this.URL}images/poultries/duck2.png`,
      qty: 2,
    },
    {
      species: 'gácsér',
      image: `${this.URL}images/poultries/duck1.png`,
      qty: 1,
    }
  ];
  poultryToMove = [...this.poultry, this.isOpen];

  constructor() { }

  ngOnInit(): void {
  }


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.poultryToMove = [...this.poultry];
    console.log('event: ', event);
    console.log('barton: ', this.barton);
    console.log('poultry: ', this.poultry);
  }

  openMenu() {

  }

}
