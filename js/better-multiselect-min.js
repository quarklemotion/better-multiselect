var bmFormsConverted=false;var betterMultiselect={showMultiselectToolbar:true,toolbarMinOptions:5,newLink:function(e,t,n){var r=document.createElement("a");r.href=e;r.title=n;r.appendChild(betterMultiselect.newText(t));return r},newText:function(e){return document.createTextNode(e)},updateNumberSelected:function(e){var t=e.parentNode.parentNode;numberOfOptions=t.getElementsByTagName("label").length;if(betterMultiselect.showMultiselectToolbar==true&&numberOfOptions>=betterMultiselect.toolbarMinOptions){var n=0;var r=t.getElementsByTagName("input");for(var i=0;i<r.length;i++){if(r[i].disabled==false&&r[i].checked){n++}}var s=t.parentNode.getElementsByTagName("span");s[s.length-1].innerHTML="("+n+" selected)"}},convertFormElements:function(){if(bmFormsConverted==false){betterMultiselect.convertMultiSelects();bmFormsConverted=true}},convertMultiSelects:function(){var e=document.getElementsByTagName("select");for(var t=0;e[t]!=null;){if(!betterMultiselect.convertMultiSelect(e[t])){t++}}},convertMultiSelect:function(e){if(!e||!e.multiple||e.className=="stree"){return false}var t=new Array;var n=0;for(var r=0;r<e.attributes.length;r++){if(e.attributes[r].nodeName=="onchange"){t[n++]=e.attributes[r].nodeValue;break}}var i=e.className;var s=e.options.length;var o=e.style.maxWidth!=null&&e.style.maxWidth.length>0?e.style.maxWidth:"0";var u=e.style.maxHeight!=null&&e.style.maxHeight.length>0?e.style.maxHeight:"0";var a=Math.max("0",Math.max(o.replace("px",""),e.offsetWidth));var f=Math.max("0",u.replace("px",""));if(a<200)a=200;if(f<180)f=180;var l=0;var c=document.createElement("div");var h=document.createElement("div");c.style.maxWidth=a+24+"px";c.className="bmultiselect";h.className="selection";h.style.minWidth=a+"px";h.style.maxWidth=a+20+"px";h.style.maxHeight=f+"px";for(r=0;r<e.options.length;r++){var p=e.name.replace("/\\[]$/","")+r;var d=document.createElement("label");d.onmouseover=function(){this.className=this.getElementsByTagName("input")[0].checked?"selected":"hover"};d.onmouseout=function(){this.className=this.getElementsByTagName("input")[0].checked?"selected":""};d.onselectstart=function(){return false};d.onmousedown=function(){return false};var v=document.createElement("input");v.type="checkbox";v.name=e.name;v.value=e.options[r].value;v.id=p+"_"+n;v.overme=false;v.onclick=function(){if(this.checked)this.parentNode.className="selected";else this.parentNode.className="";betterMultiselect.updateNumberSelected(this);var e=parseInt(this.id.substring(this.id.lastIndexOf("_")+1))-1;if(e<t.length){window.eval(t[e])}};if(e.options[r].selected==true){v.defaultChecked=true;d.className="selected";l++}v.disabled=e.disabled;var m=document.createElement("span");m.appendChild(document.createTextNode(e.options[r].text));d.appendChild(v);d.appendChild(m);h.appendChild(d)}c.appendChild(h);if(betterMultiselect.showMultiselectToolbar==true&&e.disabled==false&&i.indexOf("notoolbar")==-1&&(i.indexOf("dropdown")>=0||i.indexOf("dropdown")==-1&&s>=betterMultiselect.toolbarMinOptions)){var g=document.createElement("div");g.className="toolbar";g.appendChild(betterMultiselect.newText(" ["));var y=betterMultiselect.newLink("javascript:;","all","Select all items");y.onclick=function(){var e=this.parentNode.parentNode.getElementsByTagName("input");for(var n=0;n<e.length;n++){e[n].checked=true;e[n].parentNode.className="selected";if(n==e.length-1)betterMultiselect.updateNumberSelected(e[n]);var r=parseInt(e[n].id.substring(e[n].id.lastIndexOf("_")+1))-1;if(r<t.length){window.eval(t[r])}}return false};g.appendChild(y);g.appendChild(betterMultiselect.newText("] ["));var b=betterMultiselect.newLink("javascript:;","none","Deselect all items");b.onclick=function(){var e=this.parentNode.parentNode.getElementsByTagName("input");for(var n=0;n<e.length;n++){e[n].checked=false;e[n].parentNode.className="";if(n==e.length-1)betterMultiselect.updateNumberSelected(e[n]);var r=parseInt(e[n].id.substring(e[n].id.lastIndexOf("_")+1))-1;if(r<t.length){window.eval(t[r])}}return false};g.appendChild(b);g.appendChild(betterMultiselect.newText("]"));var w=document.createElement("span");w.appendChild(betterMultiselect.newText("("+l+" selected) "));g.appendChild(w);c.appendChild(g)}e.parentNode.replaceChild(c,e);return true},addLoadEvent:function(e){var t=window.onload;if(typeof window.onload!="function"){window.onload=e}else{window.onload=function(){if(t){t()}e()}}}};betterMultiselect.addLoadEvent(betterMultiselect.convertFormElements)