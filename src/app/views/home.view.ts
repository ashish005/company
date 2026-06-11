import {Component, OnInit, TemplateRef} from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
  templateUrl: './templates/home.html',
  standalone: true,
  imports: [RouterModule]
})
export class HomeView implements OnInit {
  typingOptions = {
    period: 800,
    info: [ 'IT Consulting Services', 'Digital Solution Provider' ]
  };
  constructor(){}
  ngOnInit() {}
  onActivate() { }
}
