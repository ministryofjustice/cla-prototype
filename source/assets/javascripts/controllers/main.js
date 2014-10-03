app.controller('MainCtrl', function($rootScope, storage) {
  var me = storage.get('me') || {};
  $rootScope.has_benefits = me.has_benefits === '1';
  $rootScope.has_partner = me.has_partner === '1';
  $rootScope.has_children = me.has_children === '1';
  $rootScope.own_property = me.own_property === '1';
});
