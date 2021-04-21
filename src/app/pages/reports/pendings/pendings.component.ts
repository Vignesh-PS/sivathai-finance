import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pendings',
  templateUrl: './pendings.component.html',
  styleUrls: ['./pendings.component.scss']
})
export class PendingsComponent implements OnInit {

  loading:boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
