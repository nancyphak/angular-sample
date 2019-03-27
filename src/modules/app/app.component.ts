import { Component } from '@angular/core';
import { AuthService } from '@app/auth';
import { NetworkService, SplashScreenService } from '@app/shared';
import { AppInsightsService, RouterService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isOnline = true;

  private splashScreen: SplashScreenService;
  private appInsightsService: AppInsightsService;

  constructor(public auth: AuthService,
              private networkService: NetworkService,
              splashScreen: SplashScreenService,
              private routerService: RouterService,
              appInsightsService: AppInsightsService) {
    this.splashScreen = splashScreen;
    this.appInsightsService = appInsightsService;

    this.auth.scheduleRenewal();

    this.networkService.isOnline.subscribe((isOnline) => {
      this.isOnline = isOnline;
    });
  }

}
