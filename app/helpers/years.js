import Ember from 'ember';

export function years(params) {
  let numMonths = +(params[0]),
      output = '';

  if(numMonths > 11) {
    let numYears = Math.floor(numMonths / 12);
    numMonths = numMonths - (numYears * 12);
    output = output + `${numYears} year`;
    if(numYears !== 1) {
      output = output + 's';
    }
    if(numMonths > 0) {
      output = output + ', ';
    }
  }
  if(numMonths > 0) {
    output = output + `${numMonths} month`;
    if(numMonths !== 1) {
      output = output + 's';
    }
  }
  return output;
}

export default Ember.Helper.helper(years);
