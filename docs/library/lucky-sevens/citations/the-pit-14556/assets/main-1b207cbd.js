function $(v) { return(document.getElementById(v)); }
function $S(v) { return($(v).style); }
function browser(v) { return(Math.max(navigator.userAgent.toLowerCase().indexOf(v),0)); }
function xy(e,v) { return(v?(browser('msie')?event.clientY+document.body.scrollTop:e.pageY):(browser('msie')?event.clientX+document.body.scrollTop:e.pageX)); }

function clearDefault(el) { if(el.defaultValue==el.value) el.value=""; }

function createWindow(cUrl,cName,cFeatures) { var xWin=window.open(cUrl,cName,cFeatures); }

function expandcollapse(id) { var v=$(id).parentNode.getElementsByTagName('a')[0].style,ps=($(id).className=="postshown")?1:'';

	if(ps) { $(id).className="posthidden"; } else { $(id).className="postshown"; } 

	v.background='url(http://www.bandamp.com/images/menuicon'+(ps?'':'-open')+'.gif) no-repeat';

}

function mailSelect() { var r=$('forge').getElementsByTagName('input'); for(var i in r) { r[i].checked=!r[i].checked?'checked':''; } }

function toggleMenu(t) {

	var v=$S(t.parentNode.id+'Menu'),b=t.parentNode.getElementsByTagName('img')[0],base='http://www.bandamp.com/images/';

	b.src=(b.src==base+'menuicon.gif')?base+'menuicon-open.gif':base+'menuicon.gif';

	v.display=(v.display=='none' || v.display=='')?'block':'none';

}

var starGo='',starUp='';

function starUpdate(path,e,i) { var x=(xy(e)-$('star'+i).offsetLeft)/84*100; $('starCurr'+i).title=x;
	
	if(window.XMLHttpRequest){ var req = new XMLHttpRequest(); }
	
	else{ req = new ActiveXObject("Microsoft.XMLHTTP"); }
	
	req.open('GET','?path='+path+'&vote='+(x/100),false);
	
	req.send(null); starUp=1;
	
}

function starRevert(i,s) { var v=Math.round(parseInt($('starCurr'+i).title)*84/100)+'px';

	if($('starCurr2')) $S('starCurr2').width=v;
	
	if($('starCurr1')) $S('starCurr1').width=v;
	
	$('starUser'+i).innerHTML=starUp?'Thank you! ;)':'';

	setTimeout("$('starUser"+i+"').innerHTML=''",1500);
	
	document.onmousemove='';

}

function starCurr(e,i) { 

	function starMove(e) {
	
		var eX=xy(e)-$('star'+i).offsetLeft,eY=xy(e,1)-$('star'+i).offsetTop;  
		
		if(eX<1 || eX>84 || eY<0 || eY>19) {

			starGo=''; starRevert(i); 

		} 
		else { 

			$S('starCurr'+i).width=eX+'px'; 

			$('starUser'+i).innerHTML=Math.round(eX/84*100)+'%'; 

		}
	}

	if(!starGo) { starGo=1; document.onmousemove=starMove; var oX=$('main').offsetLeft, oY=$('main').offsetTop; }

}