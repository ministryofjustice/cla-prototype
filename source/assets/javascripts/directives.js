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
