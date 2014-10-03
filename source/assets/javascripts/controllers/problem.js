app.controller('ProblemCtrl', function($scope, $state, $http, storage) {
  storage.bind($scope, 'category', { defaultValue: {} });

  $http.get('./data/categories.json').success(function(data) {
    $scope.categoriesData = data;
  });

  $scope.submit = function(form) {
    $scope.submitted = true;
    $state.go('about');
  };
});
