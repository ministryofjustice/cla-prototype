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
    template: '<button class="reset">Reset storage</button>',
    link: function(scope, elem, attr) {
      elem.on('click', function() {
        storage.clearAll();
        $state.go($state.current, {}, { reload: true });
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
      field: '='
    },
    link: function(scope, elem, attr) {
      if(scope.field.inline_help || scope.field.more_info) {
        return;
      }
      elem.remove();
    }
  };
});
