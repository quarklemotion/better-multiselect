/*
  Better-Multiselect Javascript Library
  Converts all standard multiselects on the HTML page to DHTML versions that do not require control-clicks for
  selecting multiple items and also shows a toolbar allowing select all/none and showing the number of items selected.
  
  https://github.com/felafelwaffle/Better-Multiselect
*/
var bmFormsConverted = false;
var betterMultiselect = {
	// BEGIN configuration options
    showMultiselectToolbar : true, // set to false to disable multiselect toolbar
    toolbarMinOptions : 5, // number of options required to enable toolbar
	// END configuration options
	
    isIE : window.attachEvent ? true : false,
    isIE6 : (window.attachEvent && (parseInt(navigator.appVersion) == 4) && (navigator.userAgent.toLowerCase().indexOf("msie 6.")!= -1) ),	
	
    newLink: function(href,text){
        var e = document.createElement('a');e.href=href;e.appendChild(betterMultiselect.newText(text));return e;
    },
    newText: function (t){
        return document.createTextNode(t);
    },
    updateNumberSelected: function (elem){
        var container = elem.parentNode.parentNode;
        var numSelected = 0;
        var checks = container.getElementsByTagName('input');
        for (var i=0; i < checks.length; i++) {
            if (checks[i].disabled == false && checks[i].checked) {numSelected++;}
        }
        container.parentNode.getElementsByTagName('span')[0].innerHTML = '(' + numSelected + ' selected)';
    },
    convertFormElements: function() {
        if (bmFormsConverted == false){
            betterMultiselect.convertMultiSelects();
            bmFormsConverted = true;
        }
    },
    convertMultiSelects: function() {
        var aSelects = document.getElementsByTagName('select');
        var onchanges = new Array();
        var onchangeCount = 0;
        // we don't increment the counter here as the array gets popped as we replace the selects
        for (var i=0; aSelects[i] != null ; ) {
            if (! betterMultiselect.convertMultiSelect(aSelects[i])) {
                i++; // increment count as we did not replace this select tag
            }
        }
    },
    convertMultiSelect: function(elem) {
        // we exclude class 'stree' as these multiselects are used by the Category-Multiselect component and should not be converted
        if (! elem || ! elem.multiple || elem.className == 'stree') {
            return false;
        }

        var onchanges = new Array();
        var onchangeCount = 0;

        for (var j = 0; j < elem.attributes.length; j++){
            if (elem.attributes[j].nodeName == "onchange"){
                onchanges[onchangeCount++] = elem.attributes[j].nodeValue;
                break;
            }
        }
        var origClassName = elem.className;
        var optionCount = elem.options.length;
        var styleMaxWidth = (elem.style.maxWidth != null && elem.style.maxWidth.length > 0) ? elem.style.maxWidth : "0";
        var styleMaxHeight = (elem.style.maxHeight != null && elem.style.maxHeight.length > 0) ? elem.style.maxHeight : "0";
        var msw=Math.max("0",Math.max(styleMaxWidth.replace("px",""), elem.offsetWidth));
        var msh=Math.max("0",styleMaxHeight.replace("px",""));
        if (msw<200) msw=200;
        if (msh<100) {
            // another IE6 hack, sigh
            if (origClassName.indexOf("dropdown") >= 0 && betterMultiselect.isIE6 && optionCount > 4) {
                if (22 * optionCount < 301) {
                    msh= 22 * optionCount;
                } else {
                    msh = 300;
                }
            } else {
                msh=100;
            }
        }

        var numSelected = 0;
        var outerDiv = document.createElement('div');
        var div = document.createElement('div');

        outerDiv.style.maxWidth      = msw+'px';
        outerDiv.className      = 'bmultiselect';
        div.className     = 'selection';
        div.style.maxWidth      = msw +'px';
        div.style.maxHeight     = msh +'px';
        if (betterMultiselect.isIE6) {  // hack for IE 6 not respecting maxheight
            div.style.height = msh +'px';;
        }

        for (j=0; j < elem.options.length; j++){
            var id = elem.name.replace('/\\[\]$/','') + j;
            var label = document.createElement('label');
            label.style.maxWidth = msw +'px';
            label.onmouseover = function() { this.className = this.getElementsByTagName('input')[0].checked ? "selected" : "hover"; };
            label.onmouseout = function() { this.className = this.getElementsByTagName('input')[0].checked ? "selected" : ""; };
            label.onselectstart = function () { return false; } // ie prevent text selection
            label.onmousedown = function () { return false; } // mozilla prevent text selection
            var checkbox = document.createElement('input');
            checkbox.type  = 'checkbox';
            if (! betterMultiselect.isIE) {
                checkbox.style.margin  = '2px 2px 2px 2px';
            }
            // need these functions since IE 6 deosn't auto-click child check boxes
            if (betterMultiselect.isIE6) {
                label.onclick = function() {
                    var thisCheck = this.getElementsByTagName('input')[0];
                    if (! thisCheck.overme) {
                        thisCheck.checked = thisCheck.checked ? false : true;
                        thisCheck.onclick();
                    }
                };
                checkbox.onmouseover = function() {
                    this.overme = true;
                };
                checkbox.onmouseout = function() {
                    this.overme = false;
                };
            }
            checkbox.name  = elem.name;
            checkbox.value = elem.options[j].value;
            checkbox.id    = id+"_"+onchangeCount;
            checkbox.overme = false; // needed for IE 6 hack
            checkbox.onclick = function(){
                if (this.checked) this.parentNode.className = "selected";
                else this.parentNode.className = ""; // clear class for default background color
                betterMultiselect.updateNumberSelected(this);
                var c = parseInt(this.id.substring(this.id.lastIndexOf("_")+1))-1;
                if (c < onchanges.length){
                    window.eval(onchanges[c]);
                }
            };
            if (elem.options[j].selected == true){
                checkbox.defaultChecked = true;
                label.className = "selected";
                numSelected++;
            }
            checkbox.disabled = elem.disabled;

            var labeltext  = document.createTextNode(elem.options[j].text);
            label.appendChild(checkbox);
            label.appendChild(labeltext);
            div.appendChild(label);
        }
        outerDiv.appendChild(div);
        if (betterMultiselect.showMultiselectToolbar == true
            && elem.disabled == false
            && origClassName.indexOf("notoolbar") == -1
            && (origClassName.indexOf("dropdown") >= 0
              || (origClassName.indexOf("dropdown") == -1 && optionCount >= betterMultiselect.toolbarMinOptions) ) ) {

            var statusDiv = document.createElement('div');
            statusDiv.className = 'toolbar';
            statusDiv.style.maxWidth = msw +'px';
            statusDiv.appendChild(betterMultiselect.newText(' ['));
            var allLink = betterMultiselect.newLink('#','all');
            allLink.onclick = function(){
                var checks = this.parentNode.parentNode.getElementsByTagName('input');
                for (var i=0; i < checks.length; i++) {
                    checks[i].checked = true;
                    checks[i].parentNode.className = "selected";
                    if (i == (checks.length - 1)) betterMultiselect.updateNumberSelected(checks[i]);

                    var c = parseInt(checks[i].id.substring(checks[i].id.lastIndexOf("_")+1))-1;
                    if (c < onchanges.length){
                        window.eval(onchanges[c]);
                    }
                }
                return false;
            };
            statusDiv.appendChild(allLink);
            statusDiv.appendChild(betterMultiselect.newText('] ['));
            var noneLink = betterMultiselect.newLink('#','none')
            noneLink.onclick = function(){
                var checks = this.parentNode.parentNode.getElementsByTagName('input');
                for (var i=0; i < checks.length; i++) {
                    checks[i].checked = false;
                    checks[i].parentNode.className = ""; // clear class for default background color
                    if (i == (checks.length - 1)) betterMultiselect.updateNumberSelected(checks[i]);

                    var c = parseInt(checks[i].id.substring(checks[i].id.lastIndexOf("_")+1))-1;
                    if (c < onchanges.length){
                        window.eval(onchanges[c]);
                    }
                }
                return false;
            };
            statusDiv.appendChild(noneLink);
            statusDiv.appendChild(betterMultiselect.newText(']'));
            var checkCount = document.createElement('span');
            checkCount.appendChild(betterMultiselect.newText('(' + numSelected + ' selected)  '));
            statusDiv.appendChild(checkCount);
            if (origClassName.indexOf("dropdown") >= 0) {
                var closelink = betterMultiselect.newLink('#','close')
                closelink.onclick = function(){
                    this.parentNode.parentNode.parentNode.style.visibility = "hidden";
                    return false;
                };
                statusDiv.appendChild(closelink);
            }
            outerDiv.appendChild(statusDiv);
        }

        elem.parentNode.replaceChild(outerDiv, elem);
        return true;
    },
	addEvent: function( obj, type, fn ) {
	  if (obj.addEventListener) {
		obj.addEventListener( type, fn, false );
		EventCache.add(obj, type, fn);
	  }
	  else if (obj.attachEvent) {
		obj["e"+type+fn] = fn;
		obj[type+fn] = function() { obj["e"+type+fn]( window.event ); }
		obj.attachEvent( "on"+type, obj[type+fn] );
		EventCache.add(obj, type, fn);
	  }
	  else {
		obj["on"+type] = obj["e"+type+fn];
	  }
	}	
};

betterMultiselect.addEvent(window,'load', betterMultiselect.convertFormElements);
