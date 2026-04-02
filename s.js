var filterWord = '';
var previous = 'filter';
var ol = null;
var statusCheckbox = true;
var flaggedCheckbox = false;
var xhr = window.XMLHttpRequest ? new window.XMLHttpRequest : (window.ActiveXObject ? new ActiveXObject("MSXML2.XMLHTTP"): null);

function createFilterForm() {
 ol = document.getElementById('lines');
 var inp = document.createElement('input');
 inp.setAttribute('type', 'text');
 inp.setAttribute('value', previous);
 inp.id = 'filter';
 inp.onfocus = function() {
  this.select();
 };
 inp.onkeyup = function() {
  if (this.value.toLowerCase() != previous) {
   filterWord = this.value.toLowerCase().replace('<', '&lt;').replace('>', '&gt;');
   previous = filterWord;
   updateFilter();
  };
 };
 var p = document.getElementsByTagName('p')[0];
 p.appendChild(inp);
 var chk = document.createElement('input');
 chk.setAttribute('type', 'checkbox');
 chk.checked = true;
 chk.id = 'status';
 chk.onclick = function() {
  statusCheckbox = this.checked;
  updateFilter();
 };
 var lbl = document.createElement('label');
 lbl.setAttribute('for', 'status');
 lbl.appendChild(document.createTextNode('Hide Join/Parts/Quits'));
 p.appendChild(chk);
 p.appendChild(lbl);
 updateFilter();
};

function updateFilter() {
 var lis = ol.getElementsByTagName('li');
 for (var i = 0; i < lis.length; i++) {
  if (lis[i].className != 'flagged') {
   if (
    statusCheckbox &&
	 (
	 lis[i].textContent.search(/^# \[\d\d:\d\d\] \* (Joins|Parts|Quits): /) == 0 ||
	 lis[i].textContent.search(/^# Session (Start|Ident|Close): /) == 0 ||
	 lis[i].textContent.search(/^# \[\d\d:\d\d\] \* .+ is now known as /) == 0
	 )
	) {
    lis[i].className = 'hide';
   } else {
    if (lis[i].innerHTML.toLowerCase().indexOf(filterWord) != -1) {
     lis[i].className = '';
    } else {
     lis[i].className = 'filtered';
    };
   };
  };
 };
 if (location.hash) {
  location.hash = location.hash;
 };
};

function addDoubleClickers() {
 var lis = ol.getElementsByTagName('li'), hasSpans = false;
 for (var i = 0; i < lis.length; i++) {
 	var spans = lis[i].getElementsByTagName('span');
 	if (spans[0]) {
 	 hasSpans = true;
   spans[0].onclick = function() {
    if (xhr) {
     xhr.open('POST', '/irc-logs/flag.php', true);
     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
     if (this.parentNode.className != 'flagged') {
      xhr.send('file=' + document.getElementsByTagName('h1')[0].id + '&line=' + this.parentNode.id + '&flag=y');
      this.parentNode.previousClassName = this.parentNode.className;
      this.parentNode.className = 'flagged';
     } else {
      xhr.send('file=' + document.getElementsByTagName('h1')[0].id + '&line=' + this.parentNode.id + '&flag=n');
      this.parentNode.className = this.parentNode.previousClassName;
     };
    };
    return false;
   };
 	}
 };
 if (hasSpans) {
  var p = document.getElementsByTagName('p')[0], span = document.createElement('span');
  span.appendChild(document.createTextNode('You can flag lines as important by clicking on the yellow box when you hover a line.'));
  p.appendChild(span);
 }
};

// Dean Edwards/Matthias Miller/John Resig
function init() {
 if (arguments.callee.done) return;
 arguments.callee.done = true;
 if (_timer) clearInterval(_timer);
 if (document.getElementById && document.getElementsByTagName && document.createElement) {
  createFilterForm();
  addDoubleClickers();
 };
};
if (document.addEventListener) {
 document.addEventListener("DOMContentLoaded", init, false);
};
/*@cc_on @*/
/*@if (@_win32)
document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
var script = document.getElementById("__ie_onload");
script.onreadystatechange = function() {
if (this.readyState == "complete") {
init();
};
};
/*@end @*/
if (/WebKit/i.test(navigator.userAgent)) {
 var _timer = setInterval(function() {
  if (/loaded|complete/.test(document.readyState)) {
   init();
  };
 }, 10);
};
window.onload = init;