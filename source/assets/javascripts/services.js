app.factory('decision', function($state, storage) {
  return {
    _checkBenefits: function() {
      var money = storage.get('money');

      if(!money || !money.benefits) {
        return;
      }

      var validBenefits = _.pick(money.benefits, function(v, k) {
        return k !== 'none_of_above' && v === true;
      });

      // Any valid benefit selected
      this.isEligible = !money.benefits.none_of_above && _.any(validBenefits);
    },

    isEligible: false,

    checkEligibility: function() {
      return this._checkBenefits();
    },

    nextStep: function(currentForm, rootScope) {
      if(currentForm.$invalid) {
        return;
      }

      this.checkEligibility();

      if(this.isEligible) {
        $state.go('result', { id: 'eligible' });
        return;
      }

      switch(currentForm.$name) {
        case 'aboutForm':
          var stateId = 'savings'; // fall back on non-skippable

          if (rootScope.has_benefits) {
            stateId = 'benefits';
          } else if (rootScope.own_property) {
            stateId = 'property';
          }

          $state.go('money.section', { id: stateId });
          break;

        case 'benefitsForm':
          $state.go('money.section', {
            id: rootScope.own_property ? 'property' : 'savings'
          });
          break;

        case 'propertyForm':
          $state.go('money.section', { id: 'savings' });
          break;

        case 'savingsForm':
          $state.go('money.section', { id: 'coming-in' });
          break;

        case 'moneyInForm':
          $state.go('money.section', { id: 'going-out' });
          break;

        case 'moneyOutForm':
          $state.go('result', { id: 'ineligible' });
          break;
      }
    }
  };
});
