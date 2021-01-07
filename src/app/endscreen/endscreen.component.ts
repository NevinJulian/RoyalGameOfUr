import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-endscreen',
  templateUrl: './endscreen.component.html',
  styleUrls: ['./endscreen.component.scss']
})
export class EndscreenComponent implements OnInit {
  message: string;

  constructor(public activatedRoute: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {
    this.message = window.history.state.message;
  }

  navigateToGame(): void {
    this.router.navigateByUrl("");
  }

}
