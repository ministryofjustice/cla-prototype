app.controller('CheckerCtrl', function($scope, $state, $resource, storage, decision) {
  storage.bind($scope, 'categories', { defaultValue: FORM_DATA.categories });
  storage.bind($scope, 'about', { defaultValue: FORM_DATA.about });
  storage.bind($scope, 'benefits', { defaultValue: FORM_DATA.benefits });
  storage.bind($scope, 'properties', { defaultValue: FORM_DATA.properties });
  storage.bind($scope, 'savings', { defaultValue: FORM_DATA.savings });
  storage.bind($scope, 'income', { defaultValue: FORM_DATA.money.income });
  storage.bind($scope, 'outgoings', { defaultValue: FORM_DATA.money.outgoings });

  // Update rootScope with global values
  $scope.$watch('about', function(value) {
    $scope.has_partner  = _.some(value, { name: 'has_partner',  value: '1' });
    $scope.has_benefits = _.some(value, { name: 'has_benefits', value: '1' });
    $scope.has_children = _.some(value, { name: 'has_children', value: '1' });
    $scope.is_caring    = _.some(value, { name: 'caring_responsibilities', value: '1' });
    $scope.has_savings  = _.some(value, { name: 'has_savings',  value: '1' });
    $scope.own_property = _.some(value, { name: 'own_property', value: '1' });
    $scope.is_working   = _.some(value, { name: 'is_working',   value: '1' });
  }, true);

  $scope.submit = function(form) {
    $scope.submitted = true;
    decision.nextStep(form, $scope);
  };

  $scope.anySelected = function(options) {
    return _.any(options, { value: true });
  };
});
