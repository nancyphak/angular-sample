import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ComponentCanDeactivate } from 'modules/shared';

@Injectable()
export class UnSavedGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
