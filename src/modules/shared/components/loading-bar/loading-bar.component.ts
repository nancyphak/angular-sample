import { Component, Input } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss']
})

export class LoadingBarComponent {
  @Input() show: boolean;

  constructor(private router: Router) {

    router.events.subscribe(
      (event) => {
        if (event instanceof NavigationStart) {
          this.show = true;
        }
        if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
          this.show = false;
        }
      });

  }

}
