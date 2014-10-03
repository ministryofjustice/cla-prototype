app.filter('removeTextOnCondition', function() {
  return function(input, condition, textToRemove) {
    return condition ? input.replace(textToRemove, '') : input;
  };
});
