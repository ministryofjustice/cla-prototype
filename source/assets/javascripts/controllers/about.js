app.controller('AboutCtrl', function($scope, $state, $http, storage, decision) {
  storage.bind($scope, 'me', { defaultValue: {}});

  $http.get('./data/about.json').success(function(data) {
    $scope.meData = data;
  });

  // Update rootScope with global values
  $scope.$watch('me', function(value) {
    $scope.$root.has_benefits = value.has_benefits === '1';
    $scope.$root.has_partner = value.has_partner === '1';
    $scope.$root.has_children = value.has_children === '1';
    $scope.$root.own_property = value.own_property === '1';
  }, true);

  $scope.submit = function(form) {
    $scope.submitted = true;
    decision.nextStep(form, $scope.$root);
  };
});
