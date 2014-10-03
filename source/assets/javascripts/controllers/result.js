app.controller('ResultCtrl', function($scope, $state, storage) {
  storage.bind($scope, 'applicant', { defaultValue: {}});

  $scope.titles = ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'];
  $scope.applicant.title = $scope.titles[0];

  $scope.submit = function() {
    $scope.submitted = true;
    $state.go('result', { id: 'confirmation' });
  };
});
