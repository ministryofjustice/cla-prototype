(function () {
  'use strict';

  moj.Modules.FieldHelp = {
    el: '.js-FieldHelp',

    init: function () {
      this.cacheEls();
      this.bindEvents();
    },

    bindEvents: function () {
      this.$options
        .on('focus', function () {
          $(this).parents('.FormRow').addClass('Help');
        })
        .on('focusout', function () {
          $('.Help').removeClass('Help');
        });
    },

    cacheEls: function () {
      this.$options = $(this.el).find('input[type=number], input[type=text], input[type=radio], input[type=checkbox]');
    }
  };
}());