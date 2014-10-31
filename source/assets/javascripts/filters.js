app.filter('replaceTextOnCondition', function() {
  return function(input, condition, textToReplaceFrom, textToReplaceWith) {
    var re = new RegExp(textToReplaceFrom, 'g');
    return condition ? input.replace(re, textToReplaceWith) : input;
  };
});
