
import * as Actions from './actions';
import * as Health from './health';
import * as HealthComponent from './component';
import * as Events from './events';

export default {
  ...Health,
  Actions,
  Events,
  HealthComponent
};
