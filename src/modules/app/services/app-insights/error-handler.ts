import { Injectable, ErrorHandler } from '@angular/core';
import { AppInsights } from 'applicationinsights-js';

@Injectable()
export class AppInsightsErrorHandler extends ErrorHandler {
  constructor() {
    super();
  }

  handleError(error: any): void {
    AppInsights.trackException(error);
  }
}
