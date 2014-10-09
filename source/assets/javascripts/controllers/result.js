app.controller('ResultCtrl', function($scope, $state, storage) {
  storage.bind($scope, 'application', { defaultValue: FORM_DATA.application });

  $scope.submit = function() {
    $scope.submitted = true;
    $state.go('result', { id: 'confirmation' });
  };
});
