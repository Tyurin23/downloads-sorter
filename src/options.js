
var groups = {}

function List(data) {
  var list = this;
  this.node = document.createElement('div');
  this.node.setAttribute('class', 'data-list');
  this.node.onclick = function(){
    console.log("click");
    list.input.style.display = "block";
    list.empty.style.display = "none";
    list.input.focus();
  }

  this.input = document.createElement('input');
  this.input.type = "text";
  this.input.style.display = "none";
  this.input.onblur = function(){
    list.input.style.display = "none";
    list.pack();
  }
  this.input.onchange = function(){
    console.log("submit");
  }
  this.input.onkeyup = function(event){
    if(event.keyCode == 13){ // Enter
      if(this.value != ""){
        list.addElement(this.value);
        this.value = "";
        list.pack();
      }
    }
  }


  this.list = document.createElement('ul');
  this.list.style.display = "none";

  this.empty = document.createElement('span');
  this.empty.setAttribute('class', 'empty-list clickable');
  this.empty.textContent = "Click here";
  this.empty.style.display = "none";

  this.node.appendChild(this.input);
  this.node.appendChild(this.list);
  this.node.appendChild(this.empty);
  
  this.pack();
}

List.prototype.addElement = function(element){
  var list = this;
  var li = document.createElement('li');
  var span = document.createElement('span');
  var a = document.createElement('a');
  span.textContent = element
  a.href = "#";
  a.innerText = "x";
  a.onclick = function(event){
    this.parentNode.parentNode.removeChild(this.parentNode);
    event.stopPropagation();
    list.pack();
  }
  li.appendChild(span);
  li.appendChild(a);

  this.list.appendChild(li);
  this.pack();
}

List.prototype.pack = function(){
  if(this.list.childNodes.length != 0){
    this.list.style.display = "block";
    this.empty.style.display = "none";
  }else{
    this.list.style.display = "none";
    this.empty.style.display = "block";
  }
}

List.prototype.getList = function(){
  var res = [];
  for (var i = this.list.childNodes.length - 1; i >= 0; i--) {
    res.push(this.list.childNodes[i].getElementsByTagName('span').item(0).textContent);
  }
  return res;
}

function Rule(data) {
  var rules = document.getElementById('rules');
  this.node = document.getElementById('template').cloneNode(true);
  this.node.id = 'rule' + (Rule.current_id++);
  this.node.rule = this;
  rules.appendChild(this.node);
  this.node.hidden = false;
  this.list = new List();

  var rule = this;

  if(data){
    data.list.forEach(function(item){
      rule.list.addElement(item);
    });
    rule.path = data.path;
  }

  this.getElement('files-list').appendChild(this.list.node);


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

Rule.prototype.packPattern = function(){
  return "([^\\s]+(\\.(?i)(tags))$)".replace('tags', this.list.getList().join("|"));
}


function loadRules() {
  var rules = localStorage.rules;
  try {
    JSON.parse(rules).forEach(function(rule) {new Rule(rule);});
  } catch (e) {
    console.log(e);
    localStorage.rules = JSON.stringify([]);
  }
}

function saveRules() {
  console.log('save');
  localStorage.rules = JSON.stringify(Array.prototype.slice.apply(
      document.getElementById('rules').childNodes).filter(function(node){
          return node.nodeType == Node.ELEMENT_NODE & node.id != "template";
      }).map(function(node) {
          return {
            list: node.rule.list.getList(),
            path: node.rule.path
          }
  }));
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
  document.getElementById('save').onclick = function() {
    saveRules();
  }
}