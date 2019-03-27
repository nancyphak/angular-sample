import { MinValidatorDirective } from './min/min-validator.directive';
import { MaxValidatorDirective } from './max/max-validator.directive';

export { MinValidatorDirective } from './min/min-validator.directive';
export { MaxValidatorDirective } from './max/max-validator.directive';

export const customValidatorsDirectives = [
  MinValidatorDirective,
  MaxValidatorDirective
];

