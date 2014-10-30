window.app = angular.module('CLA', ['ngResource', 'ui.router', 'angularLocalStorage', 'btford.markdown']);
app.config(function($locationProvider, $stateProvider, $urlRouterProvider, $uiViewScrollProvider) {
  // $locationProvider.html5Mode(true);
  $uiViewScrollProvider.useAnchorScroll();

  var scrollToTop = function() {
    window.scrollTo(0, 0);
  };

  $stateProvider
    .state('start', {
      url: '',
      templateUrl: './partials/start-page.html',
      controller: function($rootScope) {
        $rootScope.sidebar = 'sidebar-resources';
      }
    })
    .state('checker', {
      url: '/checker/:stage',
      templateUrl: function($stateParams) {
        return './partials/checker/' + $stateParams.stage + '.html';
      },
      controller: 'CheckerCtrl',
      onEnter: scrollToTop
    });
});
app.controller('CheckerCtrl', function($scope, $state, $resource, storage, decision) {
  storage.bind($scope, 'categories', { defaultValue: FORM_DATA.categories });
  storage.bind($scope, 'about', { defaultValue: FORM_DATA.about });
  storage.bind($scope, 'benefits', { defaultValue: FORM_DATA.benefits });
  storage.bind($scope, 'properties', { defaultValue: FORM_DATA.properties });
  storage.bind($scope, 'savings', { defaultValue: FORM_DATA.savings });
  storage.bind($scope, 'income', { defaultValue: FORM_DATA.income });
  storage.bind($scope, 'outgoings', { defaultValue: FORM_DATA.outgoings });
  storage.bind($scope, 'application', { defaultValue: FORM_DATA.application });
  storage.bind($scope, 'beingReviewed', { defaultValue: false });
  storage.bind($scope, 'submittedForms', { defaultValue: [] });

  // Update rootScope with global values
  $scope.$watch('about', function(value) {
    $scope.hasPartner  = _.some(value, { name: 'has_partner',  value: '1' });
    $scope.isSeparatedPartner = _.some(value, { name: 'has_partner', value: '1', with_yes: { value: '1' } });
    $scope.hasBenefits = _.some(value, { name: 'has_benefits', value: '1' });
    $scope.hasBenefits = _.some(value, { name: 'has_benefits', value: '1' });
    $scope.hasChildren = _.some(value, { name: 'has_children', value: '1' });
    $scope.isCaring    = _.some(value, { name: 'caring_responsibilities', value: '1' });
    $scope.hasSavings  = _.some(value, { name: 'has_savings',  value: '1' });
    $scope.ownProperty = _.some(value, { name: 'own_property', value: '1' });
    $scope.isWorking   = _.some(value, { name: 'is_working',   value: '1' });
  }, true);

  var FACE_TO_FACE_CATEGORIES = [
    'clinneg',
    'commcare',
    'immigration',
    'mentalhealth',
    'pi',
    'publiclaw',
    'aap'
  ];

  $scope.$watch('categories', function(value) {
    $scope.isFaceToFace = !!~FACE_TO_FACE_CATEGORIES.indexOf(value.selected);
  }, true);

  $scope.$watch('benefits', function(value) {
    $scope.hasOtherBenefits = _.some(value, { name: 'none_of_above', value: true });
  });


  $scope.$root.sidebar = null;

  if(!$state.params.stage.match(/^result/)) {
    $scope.$root.sidebar = 'sidebar-reminder';
  }

  $scope.submit = function(form) {
    $scope.submittedForms.push(form.$name.replace(/Form$/, ''));
    $scope.submittedForms = _.uniq($scope.submittedForms);
    form.submitted = true;

    if (form.$name === 'applicationForm') {
      storage.set('beingReviewed', true);
    }
    decision.nextStep(form, $scope);
  };

  $scope.isFormSubmitted = function(formName) {
    return !!~_.indexOf($scope.submittedForms, formName);
  };

  $scope.anySelected = function(options) {
    return _.any(options, { value: true });
  };

  $scope.addProperty = function(set) {
    set.push(angular.copy(FORM_DATA.properties[0]));
  };

  $scope.removeProperty = function(property, set) {
    if(property.length === 1) {
      return;
    }
    _.remove(set, property);
  };
});


app.controller('IncomeCtrl', function($scope) {
  $scope.$watch('income', function(value) {
    if(!value.length && value[0].benefits_tax_credit) {
      return;
    }

    $scope.hasAdditionalBenefits = _.some(value[0].benefits_tax_credit, { name: 'has_other_benefits', value: '1' });
  }, true);
});


app.controller('ReviewCtrl', function($scope) {
  $scope.getSumFor = function(obj, key) {
    key = key || 'value';

    return _.reduce(obj, function(result, item) {
      item[key] = item[key] || 0;
      return result + item[key];
    }, 0);
  };

  $scope.$watch('beingReviewed', function(value) {
    $scope.reviewData = value ? FORM_DATA.review : {};

    var children = _.find($scope.about, { name: 'has_children' });
    var dependants = _.find($scope.about, { name: 'caring_responsibilities' });

    if ($scope.hasChildren) {
      $scope.numberOfChildrenLine = $scope.reviewData.about.has_children['1'].replace('{num}', children.sub_value);
      if (children.sub_value < 2) {
        $scope.numberOfChildrenLine = $scope.numberOfChildrenLine.replace('children', 'child');
      }
    }

    if ($scope.isCaring) {
      $scope.numberOfDependantsLine = $scope.reviewData.about.caring_responsibilities['1'].replace('{num}', dependants.sub_value);
      if (dependants.sub_value < 2) {
        $scope.numberOfDependantsLine = $scope.numberOfDependantsLine.replace('dependants', 'dependant');
      }
    }
  });
});
app.directive('scrollTo', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, elem, attr) {
      $timeout(function() {
        window.scrollTo(0, elem[0].offsetTop - 20);
      });
    }
  };
});

app.directive('resetStorage', function($state, storage) {
  return {
    restrict: 'E',
    replace: true,
    template: '<button class="reset">Reset</button>',
    link: function(scope, elem, attr) {
      elem.on('click', function() {
        storage.clearAll();
        $state.go('start', {}, { reload: true });
      });
    }
  };
});

app.directive('resultPicker', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: './partials/-result-picker.html',
    scope: true,
    link: function(scope, elem, attr) {
      angular.element(document.body).on('click', function(e) {
        if (e.target.className === 'toggle') {
          return;
        }
        scope.$apply(function() {
          scope.expanded = false;
        });
      });
    }
  };
});

app.directive('helpText', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: './partials/-help-text.html',
    scope: {
      field: '=',
      hasPartner: '='
    },
    link: function(scope, elem, attr) {
      if(scope.field.inline_help || scope.field.more_info) {
        return;
      }
      elem.remove();
    }
  };
});

app.directive('goBackLink', function($window) {
  return {
    restrict: 'E',
    replace: true,
    template: '<a href="#" class="go-back-link">Back</a>',
    link: function(scope, elem, attr) {
      elem.on('click', function(e) {
        e.preventDefault();
        $window.history.back();
      });
    }
  };
});

app.directive('delimitedNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      ctrl.$parsers.push(function(value) {
        if(!value) {
          return;
        }
        return parseFloat(value.replace(',', ''));
      });
    }
  };
});
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
        'benefitsTaxCredits',
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
      if (!scope.hasOtherBenefits && !scope.hasChildren && !scope.isCaring) {
        skippedSteps.push('benefitsTaxCredits');
      }

      var currentStep = currentForm.$name.replace(/Form$/, '');
      var remainingSteps = _.difference(STEPS, skippedSteps);
      var nextStepIndex = _.indexOf(remainingSteps, currentStep) + 1;

      this.checkEligibility(scope);

      if(scope.isFaceToFace) {
        return $state.go('checker', { stage: 'result-face-to-face' });
      }

      if (this.isEligible && (currentStep === 'benefits' || currentStep === 'outgoings')) {
        return $state.go('checker', { stage: 'result-eligible' });
      }
      if (currentStep === 'outgoings') {
        return $state.go('checker', { stage: 'result-ineligible' });
      }
      if (currentStep === 'application') {
        return $state.go('checker', { stage: 'result-confirmation' });
        // return $state.go('checker', { stage: 'result-review' });
      }

      $state.go('checker', { stage: remainingSteps[nextStepIndex] });
    }
  };
});
app.filter('replaceTextOnCondition', function() {
  return function(input, condition, textToReplaceFrom, textToReplaceWith) {
    var re = new RegExp(textToReplaceFrom, 'g');
    return condition ? input.replace(re, textToReplaceWith) : input;
  };
});






