app.factory('decision', function($state, storage) {
  return {
    checkBenefits: function(benefits) {
      if(!benefits) {
        return;
      }

      // Any valid benefit selected
      this.isEligible = !_.any(benefits, {
        name: 'none_of_above', value: true
      }) && _.any(benefits, { value: true });
    },

    isEligible: false,

    nextStep: function(currentForm, scope) {
      if(currentForm.$invalid) {
        return;
      }

      var stage = 'income'; // fall back on non-skippable

      switch(currentForm.$name) {
        case 'problemForm':
          $state.go('checker', { stage: 'about' });
          break;

        case 'aboutForm':
          if (scope.has_benefits) {
            stage = 'benefits';
          } else if (scope.own_property) {
            stage = 'property';
          } else if (scope.has_savings) {
            stage = 'savings';
          }

          $state.go('checker', { stage: stage });
          break;

        case 'benefitsForm':
          this.checkBenefits(scope.benefits);

          if(this.isEligible) {
            $state.go('result', { id: 'eligible' });
            return;
          }

          if (scope.own_property) {
            stage = 'property';
          } else if (scope.has_savings) {
            stage = 'savings';
          }

          $state.go('checker', { stage: stage });
          break;

        case 'propertyForm':
          if (scope.has_savings) {
            stage = 'savings';
          }

          $state.go('checker', { stage: stage });
          break;

        case 'savingsForm':
          $state.go('checker', { stage: 'income' });
          break;

        case 'moneyInForm':
          $state.go('checker', { stage: 'outgoings' });
          break;

        case 'moneyOutForm':
          $state.go('result', { id: 'ineligible' });
          break;
      }
    }
  };
});
