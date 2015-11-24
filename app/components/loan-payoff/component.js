import Ember from 'ember';
import _math from 'lodash/math';

export default Ember.Component.extend({

  loanAmount: '1000',
  loanTerm: '12',
  interestRate: '1',
  extraPrinciple: '0',
  compoundingRate: Ember.computed('interestRate', function() {
    return (this.get('interestRate') / 100) / 12; // compounding monthly
  }),

  payment: Ember.computed('loanAmount', 'loanTerm', 'compoundingRate', function() {
    let loanAmount = +(this.get('loanAmount')),
        loanTerm = +(this.get('loanTerm')),
        compoundingRate = this.get('compoundingRate');

    if(+compoundingRate === 0) {
      return _math.round(loanAmount / loanTerm, 2);
    }

    let payment = ( compoundingRate * loanAmount ) / ( 1 - Math.pow((1 + compoundingRate), -(loanTerm)));
    return _math.round(payment, 2);
  }),

  payments: Ember.computed('payment', 'extraPrinciple', function() {
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
  }),

  totalPayment: Ember.computed('payment', 'extraPrinciple', function() {
    let payment = this.get('payment'),
        extra = +(this.get('extraPrinciple'));

    return _math.round(payment + extra, 2);
  }),

  totalInterest: Ember.computed('loanAmount', 'loanTerm', 'compoundingRate', function() {
    let principle = +(this.get('loanAmount')),
        compoundingRate = this.get('compoundingRate'),
        payment = this.get('payment'),
        total = 0,
        interest;
    while (principle > 0) {
      interest = _math.round(principle * compoundingRate, 2);

      if(principle + interest < payment) {
        payment = principle + interest;
      }

      principle = _math.round(principle + interest - payment, 2);
      total = total + interest;
    }
    return _math.round(total, 2);
  }),

  totalInterestPaid: Ember.computed('payments.[]', function() {
    let payments = this.get('payments');
    return _math.round(_math.sum(payments, 'interest'), 2);
  }),

  savedInterest: Ember.computed('totalInterest', 'totalInterestPaid', function () {
    let totalInterest = this.get('totalInterest'),
        totalInterestPaid = this.get('totalInterestPaid');
    return totalInterest - totalInterestPaid;
  })
});
