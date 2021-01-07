import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-endscreen',
  templateUrl: './endscreen.component.html',
  styleUrls: ['./endscreen.component.scss']
})
export class EndscreenComponent implements OnInit {
  message: String;

  constructor(public activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.message = window.history.state.message;
  }

}
