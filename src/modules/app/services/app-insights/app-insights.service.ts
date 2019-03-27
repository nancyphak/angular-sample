import { Injectable } from '@angular/core';
import { AppInsights } from 'applicationinsights-js';

import { environment as env } from '@app/env';

@Injectable()
export class AppInsightsService {

  constructor() {
    AppInsightsService.downloadAndSetupAppInsights();
  }

  static downloadAndSetupAppInsights() {
    const config: Microsoft.ApplicationInsights.IConfig = {
      instrumentationKey: env.appInsights.instrumentationKey
    };

    if (!AppInsights.config) {
      AppInsights.downloadAndSetup(config);
    }
  }
}
