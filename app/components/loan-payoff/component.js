import Ember from 'ember';
import _math from 'lodash/math';

export default Ember.Component.extend({

  loanAmount: 1000,
  loanTerm: '12',
  interestRate: 1,
  extraPrinciple: 0,
  compoundingRate: Ember.computed('interestRate', function() {
    return (this.get('interestRate') / 100) / 12; // compounding monthly
  }),

  payment: Ember.computed('loanAmount', 'loanTerm', 'interestRate', function() {
    let loanAmount = this.get('loanAmount'),
        loanTerm = this.get('loanTerm'),
        compoundingRate = this.get('compoundingRate');

    if(+compoundingRate === 0) {
      return _math.round(loanAmount / loanTerm, 2);
    }

    let payment = ( compoundingRate * loanAmount ) / ( 1 - Math.pow((1 + compoundingRate), -(loanTerm)));
    return _math.round(payment, 2);
  }),

  payments: Ember.computed('loanAmount', 'loanTerm', 'interestRate', 'extraPrinciple', function() {
    let principle = +(this.get('loanAmount')),
        compoundingRate = this.get('compoundingRate'),
        payment   = this.get('payment'),
        extra     = +(this.get('extraPrinciple')),
        interest,
        startingPrinciple,
        i = 1,
        payments = [];
    while (principle > 0) {
      interest = _math.round(principle * compoundingRate, 2);

      if(principle + interest < payment) {
        payment = principle + interest;
        extra = 0;
      }
      if(principle + interest - payment < extra) {
        extra = principle + interest - payment;
      }
      startingPrinciple = principle;
      principle = _math.round(principle + interest - payment - extra, 2);
      payments.push({id: i++, principle, interest, payment, extra, startingPrinciple});
    }
    return payments;
  }),

  totalPaid: Ember.computed('payments.[]', function() {
    let payments = this.get('payments');
    return _math.sum(payments, 'payment') + _math.sum(payments, 'extra');
  })
});
