app.controller('MoneyCtrl', function($scope, $state, $http, $stateParams, storage, decision) {
  storage.bind($scope, 'money', { defaultValue: {
    coming_in: {
      me: {},
      partner: {}
    },
    going_out: {
      me: {},
      partner: {}
    }
  } });

  $scope.timeFrequency = [{
    id: 'pw',
    label: 'per week'
  }, {
    id: '4w',
    label: '4 weekly',
  }, {
    id: 'pm',
    label: 'per month'
  }, {
    id: 'py',
    label: 'per year'
  }];

  var DEFAULT_TIME_FREQUENCY = $scope.timeFrequency[2].id;

  function fillDefaultTimeFrequencies(field) {
    _.each($scope.moneyData[field], function(item) {
      var key = _.keys(item)[0];
      var fieldMe = $scope.money[field].me[key];
      var fieldPartner = $scope.money[field].partner[key];

      if(fieldMe && fieldMe.frequency || fieldPartner && fieldPartner.frequency) {
        return;
      }

      // Fill in default time frequencies for 'partner' and 'me'
      $scope.money[field].me[key] = {
        frequency: DEFAULT_TIME_FREQUENCY
      };
      $scope.money[field].partner[key] = {
        frequency: DEFAULT_TIME_FREQUENCY
      };
    });
  }

  $http.get('./data/money.json').success(function(data) {
    $scope.moneyData = data;

    fillDefaultTimeFrequencies('coming_in');
    fillDefaultTimeFrequencies('going_out');
  });

  $scope.anySelected = function(options) {
    return _.any(options);
  };

  $scope.submit = function(form) {
    $scope.submitted = true;
    decision.nextStep(form, $scope.$root);
  };
});
