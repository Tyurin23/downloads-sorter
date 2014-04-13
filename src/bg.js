chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
  var rules = localStorage.rules;
  try {
    rules = JSON.parse(rules);
  } catch (e) {
    localStorage.rules = JSON.stringify([]);
  }
  rules.forEach(function(element, index){
    var list =  element.list.join("|");
    var pattern = "[^\\s]+(\\.(tags))$".replace('tags', list);
    var regex = new RegExp(pattern, "i");
    if(regex.test(item.filename)){
      suggest({filename: element.path + '/' + item.filename});
    }
  });

});