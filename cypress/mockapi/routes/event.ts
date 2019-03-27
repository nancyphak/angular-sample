import { Get } from '../helper';
import * as fixtures from '../../fixtures/events.json';

export class EventsRoute {

  @Get('api/qry/FindChronologyEventsByDispute/*')
  public static findChronologyEventsByDispute() {
    return { response: <Array<any>>fixtures };
  }
}
