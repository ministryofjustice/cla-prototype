(function () {
  'use strict';

  moj.Modules.ProtoShame = {
    init: function () {
      this.bindEvents();
    },

    bindEvents: function () {
      $(':input[type=number]').on('mousewheel',function(e){ 
        // e.preventDefault();
        $(this).blur();
      });
    }
  };
}());