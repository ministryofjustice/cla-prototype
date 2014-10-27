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

  $scope.$watch('benefits', function(value) {
    $scope.hasOtherBenefits = _.some(value, { name: 'none_of_above', value: true });
  });

  $scope.$root.hasSidebar = false;

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
    if(!value.length && value[0].joint) {
      return;
    }
    $scope.hasAdditionalBenefits = _.some(value[0].joint, { name: 'has_other_benefits', value: '1' });
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
