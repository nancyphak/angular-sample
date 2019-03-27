import { Get, Post } from '../helper';
import * as fixtures from '../../fixtures/facts.json';

export class EvidencesRoute {

  @Get('api/qry/FindEvidenceByDispute/*')
  public static findEvidenceByDispute() {
    return {response: <Array<any>>fixtures};
  }

  @Get('api/qry/FindEvidenceByDispute/*')
  public static findEvidencesByDisputeAndReturnEmpty() {
    return {response: []};
  }

  @Post('api/cmd/UpdateEvidence')
  public static updateEvidence() {
    return {response: {}};
  }

  @Post('api/cmd/DeleteEvidence')
  public static deleteEvidence() {
    return {response: {}};
  }

  @Post('api/cmd/CreateEvidence')
  public static createEvidence() {
    return {response: {}};
  }
}
