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
    
    newLink: function(href, text, title){
        var e = document.createElement('a');
        e.href = href;
        e.title = title;
        e.appendChild(betterMultiselect.newText(text));
        return e;
    },
    newText: function (t){
        return document.createTextNode(t);
    },
    updateNumberSelected: function (elem){
        if (betterMultiselect.showMultiselectToolbar == true && elem.options.length >= betterMultiselect.toolbarMinOptions) {
            var container = elem.parentNode.parentNode;
            var numSelected = 0;
            var checks = container.getElementsByTagName('input');
            for (var i = 0; i < checks.length; i++) {
                if (checks[i].disabled == false && checks[i].checked) {numSelected++;}
            }
            var spans = container.parentNode.getElementsByTagName('span');
            spans[spans.length - 1].innerHTML = '(' + numSelected + ' selected)';
        }
    },
    convertFormElements: function() {
        if (bmFormsConverted == false){
            betterMultiselect.convertMultiSelects();
            bmFormsConverted = true;
        }
    },
    convertMultiSelects: function() {
        var aSelects = document.getElementsByTagName('select');
        // we don't increment the counter here as the array gets popped as we replace the selects
        for (var i = 0; aSelects[i] != null; ) {
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

        var onChanges = new Array();
        var onChangeCount = 0;

        for (var j = 0; j < elem.attributes.length; j++){
            if (elem.attributes[j].nodeName == "onchange"){
                onChanges[onChangeCount++] = elem.attributes[j].nodeValue;
                break;
            }
        }
        var origClassName = elem.className;
        var optionCount = elem.options.length;
        var styleMaxWidth = (elem.style.maxWidth != null && elem.style.maxWidth.length > 0) ? elem.style.maxWidth : "0";
        var styleMaxHeight = (elem.style.maxHeight != null && elem.style.maxHeight.length > 0) ? elem.style.maxHeight : "0";
        var msw = Math.max("0",Math.max(styleMaxWidth.replace("px",""), elem.offsetWidth));
        var msh = Math.max("0",styleMaxHeight.replace("px",""));
        if (msw < 200) msw = 200;
        if (msh < 180) msh = 180;

        var numSelected = 0;
        var outerDiv = document.createElement('div');
        var div = document.createElement('div');

        outerDiv.style.maxWidth = (msw + 24) + 'px';
        outerDiv.className      = 'bmultiselect';
        div.className           = 'selection';
        div.style.minWidth      = msw +'px';
        div.style.maxWidth      = (msw + 20) + 'px';
        div.style.maxHeight     = msh +'px';

        for (j = 0; j < elem.options.length; j++){
            var id = elem.name.replace('/\\[\]$/','') + j;
            var label = document.createElement('label');
            //label.style.maxWidth = msw +'px';
            label.onmouseover = function() { this.className = this.getElementsByTagName('input')[0].checked ? "selected" : "hover"; };
            label.onmouseout = function() { this.className = this.getElementsByTagName('input')[0].checked ? "selected" : ""; };
            label.onselectstart = function () { return false; }; // ie prevent text selection
            label.onmousedown = function () { return false; }; // mozilla prevent text selection
            var checkbox = document.createElement('input');
            checkbox.type  = 'checkbox';
            checkbox.name  = elem.name;
            checkbox.value = elem.options[j].value;
            checkbox.id    = id + "_" + onChangeCount;
            checkbox.overme = false; // needed for IE 6 hack
            checkbox.onclick = function(){
                if (this.checked) this.parentNode.className = "selected";
                else this.parentNode.className = ""; // clear class for default background color
                betterMultiselect.updateNumberSelected(this);
                var c = parseInt(this.id.substring(this.id.lastIndexOf("_") + 1)) - 1;
                if (c < onChanges.length){
                    window.eval(onChanges[c]);
                }
            };
            if (elem.options[j].selected == true){
                checkbox.defaultChecked = true;
                label.className = "selected";
                numSelected++;
            }
            checkbox.disabled = elem.disabled;

            var labeltext  = document.createElement('span');
            labeltext.appendChild(document.createTextNode(elem.options[j].text));
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
            statusDiv.appendChild(betterMultiselect.newText(' ['));
            var allLink = betterMultiselect.newLink('javascript:;', 'all', 'Select all items');
            allLink.onclick = function(){
                var checks = this.parentNode.parentNode.getElementsByTagName('input');
                for (var i = 0; i < checks.length; i++) {
                    checks[i].checked = true;
                    checks[i].parentNode.className = "selected";
                    if (i == (checks.length - 1)) betterMultiselect.updateNumberSelected(checks[i]);

                    var c = parseInt(checks[i].id.substring(checks[i].id.lastIndexOf("_") + 1)) - 1;
                    if (c < onChanges.length){
                        window.eval(onChanges[c]);
                    }
                }
                return false;
            };
            statusDiv.appendChild(allLink);
            statusDiv.appendChild(betterMultiselect.newText('] ['));
            var noneLink = betterMultiselect.newLink('javascript:;','none', 'Deselect all items');
            noneLink.onclick = function(){
                var checks = this.parentNode.parentNode.getElementsByTagName('input');
                for (var i = 0; i < checks.length; i++) {
                    checks[i].checked = false;
                    checks[i].parentNode.className = ""; // clear class for default background color
                    if (i == (checks.length - 1)) betterMultiselect.updateNumberSelected(checks[i]);

                    var c = parseInt(checks[i].id.substring(checks[i].id.lastIndexOf("_") + 1)) - 1;
                    if (c < onChanges.length){
                        window.eval(onChanges[c]);
                    }
                }
                return false;
            };
            statusDiv.appendChild(noneLink);
            statusDiv.appendChild(betterMultiselect.newText(']'));
            var checkCount = document.createElement('span');
            checkCount.appendChild(betterMultiselect.newText('(' + numSelected + ' selected) '));
            statusDiv.appendChild(checkCount);
            outerDiv.appendChild(statusDiv);
        }

        elem.parentNode.replaceChild(outerDiv, elem);
        return true;
    },

    addLoadEvent: function(func) {
        var oldonload = window.onload;
        if (typeof window.onload != 'function') {
            window.onload = func;
        } else {
            window.onload = function() {
                if (oldonload) {
                    oldonload();
                }
                func();
            }
        }
    }
};

betterMultiselect.addLoadEvent(betterMultiselect.convertFormElements);