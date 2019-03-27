import { Get, Post } from '../helper';
import * as fixtures from '../../fixtures/people.json';

export class PeopleRoute {

  @Get('api/qry/FindPeopleByDispute/*')
  public static findPeopleByDispute() {
    return { response: <Array<any>>fixtures };
  }

  @Get('api/qry/FindPeopleByDispute/*')
  public static findPeopleByDisputeAndReturnEmpty() {
    return { response: [] };
  }
  
  @Post('api/cmd/CreatePerson')
  public static createPerson() {
    return {response: {}};
  }
  
  @Post('api/cmd/RenamePerson')
  public static renamePerson() {
    return {response: {}};
  }
  
  @Post('api/cmd/DeletePerson')
  public static deletePerson() {
    return {response: {}};
  }
}
