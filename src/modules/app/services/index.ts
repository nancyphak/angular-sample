import { AppInsightsService } from './app-insights/app-insights.service';
import { AppInsightsErrorHandler } from './app-insights/error-handler';
import { RouterService } from './router-event.service';

export const services = [
  AppInsightsService,
  AppInsightsErrorHandler,
  RouterService
];

export {
  AppInsightsService,
  AppInsightsErrorHandler,
  RouterService
};
