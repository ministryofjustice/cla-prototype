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
        'application'
      ];

      var skippedSteps = [];

      if (!scope.hasBenefits) {
        skippedSteps.push('benefits');
      }
      if (!scope.ownProperty) {
        skippedSteps.push('property');
      }
      if (!scope.hasSavings) {
        skippedSteps.push('savings');
      }

      var currentStep = currentForm.$name.replace(/Form$/, '');
      var remainingSteps = _.difference(STEPS, skippedSteps);
      var nextStepIndex = _.indexOf(remainingSteps, currentStep) + 1;

      this.checkEligibility(scope);

      if (this.isEligible && (currentStep === 'benefits' || currentStep === 'outgoings')) {
        return $state.go('checker', { stage: 'result-eligible' });
      }
      if (currentStep === 'outgoings') {
        return $state.go('checker', { stage: 'result-ineligible' });
      }
      if (currentStep === 'application') {
        return $state.go('checker', { stage: 'result-review' });
      }

      $state.go('checker', { stage: remainingSteps[nextStepIndex] });
    }
  };
});
