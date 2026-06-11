import { Component, signal } from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('company');
  protected readonly isMobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(open => !open);
  }
}
