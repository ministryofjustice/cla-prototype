(function () {
  'use strict';

  moj.Modules.FormStorage = {
    el: 'form',

    init: function () {
      _.bindAll(this, 'render', 'onFieldChange', 'saveField', 'checkElig');
      this.cacheEls();
      this.bindEvents();
    },

    bindEvents: function () {
      moj.Events.on('render', this.render);

      $(this.el).on('change keyup', 'input[type="radio"], input[type="checkbox"], input[type="text"], input[type="email"], input[type="number"], textarea', this.onFieldChange);
    },

    cacheEls: function () {
      this.$form = $('form');
      this.formData = sessionStorage.getItem('FormData') !== null ? JSON.parse(sessionStorage.getItem('FormData')) : {};
      this.journey = sessionStorage.getItem('journey');
    },

    render: function () {
      $.each(this.formData, function(i, obj) {
        if (obj.type === "radio" || obj.type === "checkbox") {
          $('[name="' + obj.name + '"][value="' + obj.value + '"]').prop('checked', true);
        } else {
          $('[name="' + obj.name + '"]').val(obj.value);
        }

        // custom show/hide
        if (obj.value === "0") {
          $('[data-dependant-field="' + obj.name + '"]')
            .hide()
            .find('[required]').removeAttr('required');
        }
      });

      moj.Events.trigger('LabelSelect.render');

      this.checkElig();
    },

    onFieldChange: function (e) {
      var $el = $(e.target);

      this.saveField($el);
      this.checkElig();
    },

    saveField: function (el) {
      var data = {};

      data.name =  el.attr('name');
      data.value = el.val();
      data.type = el.attr('type');
      data.limit = el.data('fail-limit');

      this.formData[el.attr('name')] = data;
      sessionStorage.setItem('FormData', JSON.stringify(this.formData));
    },

    checkElig: function () {
      var eligible = true;

      $.each(this.formData, function(i, obj) {
        if (obj.limit !== undefined && obj.value > obj.limit) {
          eligible = false;
        }
      });

      // Journey A
      if (this.journey === 'A') {
        if (!eligible) {
          this.$form.attr('action', 'ineligible.html');
        } else {
          this.$form.attr('action', $('body').data('next-step'));
        }
      } 
      // Journey B
      else {
        if (this.$form.attr('action') === 'eligible.html' && !eligible) {
          this.$form.attr('action', 'ineligible.html');
        }
      }
    }
  };
}());