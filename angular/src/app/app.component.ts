import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'eggShell';

  constructor(
    private metaService: Meta
  ) { }

  ngOnInit(): void {
    this.metaService.updateTag({
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, user-scalable=no'
    }, 'name=viewport');

  }
}
