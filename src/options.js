

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
}

Rule.prototype.getElement = function(name) {
  return document.querySelector('#' + this.node.id + ' .' + name);
}


Rule.current_id = 0;

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

window.onload = function() {
  loadRules();
  document.getElementById('new_rule').onclick = function() {
    new Rule();
  };
  document.getElementById('save_rule').onclick = function() {
    saveRules();
  }
}