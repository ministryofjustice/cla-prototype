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
      var that = this;

      $.each(this.formData, function(i, obj) {
        if (obj.type === "radio" || obj.type === "checkbox") {
          $('[name="' + obj.name + '"][value="' + obj.value + '"]').prop('checked', true);
        } else {
          $('[name="' + obj.name + '"]').val(obj.value);
        }
      });

      $('[data-dependant-field]').each(function (i, el) {
        var $el = $(el),
            field = $el.data('dependant-field'),
            val = $el.data('dependant-value');
        if (
          that.formData[field] !== undefined && 
          that.formData[field].value.toString() === val.toString()
        ) {
          // do nothing
        } else {
          $el.hide().find('[required]').removeAttr('required');
        }
      });

      $('[data-item-value]').each(function (i, el) {
        var $el = $(el),
            field = $el.data('item-value'),
            value = that.formData[field] !== undefined ? that.formData[field].value : '-';

        if ($el.data('type') === 'number') {
          value = parseInt(value).toFixed(2);
        }

        $el.html(value);
      });

      moj.Events.trigger('LabelSelect.render');

      this.checkElig();
      this.checkDiagnosis();
    },

    onFieldChange: function (e) {
      var $el = $(e.target);

      this.saveField($el);
      this.checkDiagnosis();
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

    checkDiagnosis: function () {
      
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