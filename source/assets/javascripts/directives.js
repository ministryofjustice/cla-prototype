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
