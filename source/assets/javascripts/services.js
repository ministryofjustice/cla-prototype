app.factory('decision', function($state, storage) {
  var checkBenefits = function(benefits) {
    if(!_.isArray(benefits)) {
      return;
    }

    // Any valid benefit selected
    return !_.any(benefits, {
      name: 'none_of_above', value: true
    }) && _.any(benefits, { value: true });
  };

  return {
    isEligible: false,

    checkEligibility: function(scope) {
      this.isEligible = checkBenefits(scope.benefits);
    },

    nextStep: function(currentForm, scope) {
      if(currentForm.$invalid) {
        return;
      }

      var STEPS = [
        'problem',
        'about',
        'benefits',
        'property',
        'savings',
        'income',
        'outgoings',
        'result'
      ];

      var skippedSteps = [];

      if (!scope.has_benefits) {
        skippedSteps.push('benefits');
      }
      if (!scope.own_property) {
        skippedSteps.push('property');
      }
      if (!scope.has_savings) {
        skippedSteps.push('savings');
      }

      var currentStep = currentForm.$name.replace(/Form$/, '');
      var remainingSteps = _.difference(STEPS, skippedSteps);
      var nextStepIndex = _.indexOf(remainingSteps, currentStep) + 1;

      this.checkEligibility(scope);

      if (this.isEligible && (currentStep === 'benefits' || currentStep === 'outgoings')) {
        return $state.go('result', { id: 'eligible' });
      }
      if (currentStep === 'outgoings') {
        return $state.go('result', { id: 'ineligible' });
      }

      $state.go('checker', { stage: remainingSteps[nextStepIndex] });
    }
  };
});
