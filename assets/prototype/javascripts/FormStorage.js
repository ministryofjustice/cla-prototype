(function () {
  'use strict';

  moj.Modules.FormStorage = {
    el: 'form',

    init: function () {
      _.bindAll(this, 'render', 'saveField');
      this.cacheEls();
      this.bindEvents();
    },

    bindEvents: function () {
      moj.Events.on('render', this.render);

      $(this.el).on('change keyup', 'input[type="radio"], input[type="checkbox"], input[type="text"], input[type="number"], textarea', this.saveField);
    },

    cacheEls: function () {
      this.FormData = sessionStorage.getItem("FormData") !== null ? JSON.parse(sessionStorage.getItem("FormData")) : [];
    },

    render: function () {
      $.each(this.FormData, function(i, obj) {
        if (obj.type === "radio" || obj.type === "checkbox") {
          $('[name="' + obj.name + '"][value="' + obj.value + '"]').prop('checked', true);
        } else {
          $('[name="' + obj.name + '"]').val(obj.value);
        }
      });

      moj.Events.trigger('LabelSelect.render');
    },

    saveField: function (e) {
      var $el = $(e.target),
          field = {};

      field.name =  $el.attr('name');
      field.value = $el.val();
      field.type = $el.attr('type');

      this.FormData.push(field);
      sessionStorage.setItem("FormData", JSON.stringify(this.FormData));
    }
  };
}());