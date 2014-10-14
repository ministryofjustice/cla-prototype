app.filter('replaceTextOnCondition', function() {
  return function(input, condition, textToReplaceFrom, textToReplaceWith) {
    return condition ? input.replace(textToReplaceFrom, textToReplaceWith) : input;
  };
});
