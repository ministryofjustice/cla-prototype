app.config(function($locationProvider, $stateProvider, $urlRouterProvider, $uiViewScrollProvider) {
  // $locationProvider.html5Mode(true);
  $uiViewScrollProvider.useAnchorScroll();

  var scrollToTop = function() {
    window.scrollTo(0, 0);
  };

  $stateProvider
    .state('start', {
      url: '',
      templateUrl: './partials/start-page.html',
      controller: function($rootScope) {
        $rootScope.hasSidebar = true;
      }
    })
    .state('checker', {
      url: '/checker/:stage',
      templateUrl: function($stateParams) {
        return './partials/checker/' + $stateParams.stage + '.html';
      },
      controller: 'CheckerCtrl',
      onEnter: scrollToTop
    });
});
