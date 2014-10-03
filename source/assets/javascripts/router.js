app.config(function($locationProvider, $stateProvider, $urlRouterProvider, $uiViewScrollProvider) {
  // $locationProvider.html5Mode(true);
  $uiViewScrollProvider.useAnchorScroll();

  var scrollToTop = function() {
    window.scrollTo(0, 0);
  };

  $stateProvider
    .state('start', {
      url: ''
    })
    .state('problem', {
      url: '/problem',
      templateUrl: './partials/problem.html',
      controller: 'ProblemCtrl'
    })
    .state('about', {
      url: '/about',
      templateUrl: './partials/about.html',
      controller: 'AboutCtrl'
    })
    .state('money', {
      abstract: true,
      url: '/money',
      controller: 'MoneyCtrl',
      templateUrl: './partials/money.html'
    })
    .state('money.section', {
      url: '/:id',
      templateUrl: function($stateParams) {
        return './partials/money/' + $stateParams.id + '.html';
      },
      onEnter: scrollToTop
    })
    .state('result', {
      url: '/result/:id',
      controller: 'ResultCtrl',
      templateUrl: function($stateParams) {
        return './partials/result/' + $stateParams.id + '.html';
      },
      onEnter: scrollToTop
    });
});
