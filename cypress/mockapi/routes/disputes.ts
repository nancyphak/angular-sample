import { Get, Post } from '../helper';
import * as disputeFixtures from '../../fixtures/disputes.json';

export class DisputeRoute {

  @Get('api/qry/FindDisputesByUser')
  public static findDisputesByUser() {
    return {response: <Array<any>>disputeFixtures};
  }

  @Get('api/qry/FindDisputesByUser')
  public static findDisputesByUserAndReturnEmpty() {
    return {response: []};
  }

  @Post('api/cmd/CreateDispute')
  public static createDispute() {
    return {response: {}};
  }

  @Post('api/cmd/RenameDispute')
  public static renameDispute() {
    return {response: {}};
  }

  @Post('api/cmd/DeleteDispute')
  public static deleteDispute() {
    return {response: {}};
  }
}
