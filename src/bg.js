// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function matches(rule, item) {
  if (rule.matcher == 'js')
    return eval(rule.match_param);
  if (rule.matcher == 'hostname') {
    var link = document.createElement('a');
    link.href = item.url.toLowerCase();
    var host = (rule.match_param.indexOf(':') < 0) ? link.hostname : link.host;
    return (host.indexOf(rule.match_param.toLowerCase()) ==
            (host.length - rule.match_param.length));
  }
  if (rule.matcher == 'default')
    return item.filename == rule.match_param;
  if (rule.matcher == 'url-regex')
    return (new RegExp(rule.match_param)).test(item.url);
  if (rule.matcher == 'default-regex')
    return (new RegExp(rule.match_param)).test(item.filename);
  return false;
}

chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
  var rules = localStorage.rules;
  try {
    rules = JSON.parse(rules);
  } catch (e) {
    localStorage.rules = JSON.stringify([]);
  }
  rules.forEach(function(element, index){
    var regex = new RegExp(element.pattern, "i");
    if(regex.test(item.filename)){
      suggest({filename: element.path + '/' + item.filename});
    }
  });

});