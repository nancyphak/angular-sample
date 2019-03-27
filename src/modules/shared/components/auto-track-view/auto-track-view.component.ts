import { ActivatedRoute, UrlSegment } from '@angular/router';
import { AppInsights } from 'applicationinsights-js';

export class AutoTrackViewComponent {
  constructor(public route: ActivatedRoute) {
    this.trackPageView();
  }

  private trackPageView() {
    const name = this.route.component['name'];
    const url = this.getPageUrl();
    const properties = {};
    AppInsights.trackPageView(name, url, properties);
  }

  private getPageUrl() {
    const urlSegments: Array<UrlSegment> = this.route.url['_value'];
    const segments = urlSegments.map(segment => segment.path);
    const url = segments.join('/');

    if (url.indexOf('disputes') < 0) {
      return this.route.snapshot['_routerState'].url;
    }
    return url;
  }
}
