
var groups = {}

function Rule(data) {
  var rules = document.getElementById('rules');
  this.node = document.getElementById('template').cloneNode(true);
  this.node.id = 'rule' + (Rule.current_id++);
  this.node.rule = this;
  rules.appendChild(this.node);
  this.node.hidden = false;

  var rule = this;

  if(data){
    rule.pattern = data.pattern;
    rule.path = data.path;
  }

  this.getElement('pattern').value = rule.pattern != undefined ? rule.pattern : '';
  this.getElement('pattern').onchange = function(){
    rule.pattern = this.value;
  }

  this.getElement('path').value = rule.path != undefined ? rule.path : '';
  this.getElement('path').onchange = function(){
    rule.path = this.value;
  }

  this.getElement('remove').onclick = function(){
    rule.remove();
  }
  this.getElement('groups').onchange = function(){
    var pattern = groups[this.item().value];
    var element = rule.getElement('pattern')
    if(pattern != 'undefined'){
      element.value = pattern;
      element.disable = true;
    }else{
      element.disable = false;
    }
  }
}

Rule.current_id = 0;
Rule.prototype.remove = function(){
  this.node.parentElement.removeChild(this.node);
}

Rule.prototype.getElement = function(name){
  return this.node.getElementsByClassName(name).item(0);
}


function loadRules() {
  var rules = localStorage.rules;
  try {
    JSON.parse(rules).forEach(function(rule) {new Rule(rule);});
  } catch (e) {
    localStorage.rules = JSON.stringify([]);
  }
}

function saveRules() {
  localStorage.rules = JSON.stringify(Array.prototype.slice.apply(
      document.getElementById('rules').childNodes).filter(function(node){
          return node.nodeType == Node.ELEMENT_NODE & node.id != "template";
      }).map(function(node) {
          return {
            pattern: node.rule.pattern,
            path: node.rule.path
          }
  }));
}

function parseFile(file) {
   var request = new XMLHttpRequest();
   request.open("GET", file, false);
   request.send(null)
   return JSON.parse(request.responseText);
}

function addDefautlRules(rules, select){
  for(var i = 0; i < rules.length; i++){
    var option = document.createElement('option');
    option.text = rules[i].name;
    select.add(option);
    groups[rules[i].name] = rules[i].pattern;
  }
}

window.onload = function() {
  var gr = document.getElementById('groups-template');
  addDefautlRules(defaultRules, gr);
  loadRules();

  groups.onselect = function(){
    console.log("Select")
  };
  document.getElementById('new_rule').onclick = function() {
    new Rule();
  };
  document.getElementById('save_rule').onclick = function() {
    saveRules();
  }
}