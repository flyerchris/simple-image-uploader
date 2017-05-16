var socket = io();
var reader=new FileReader();
var CanvasUI,UIctx,mycanvas,ctx;
var zoom=2;
var UI={
	state:"",
	selectarea:[0,0,0,0]
}

function readFile(){
	reader.readAsDataURL(document.getElementById('file').files[0]);
	document.getElementById('file').style.display='none';
}
function mdEvent(evt){
	var rect = CanvasUI.getBoundingClientRect();
	UI.selectarea[0]=evt.clientX-rect.left;
	UI.selectarea[1]=evt.clientY-rect.top;
	UI.state='selectarea';
}
function mvEvent(evt){
	var rect = CanvasUI.getBoundingClientRect();
	var mx=evt.clientX-rect.left;
	var my=Math.floor(evt.clientY-rect.top+0.5);
	document.getElementById('info').innerHTML=mx+" , "+my;
	if(UI.state=='selectarea'){
		UI.selectarea[2]=mx;
		UI.selectarea[3]=my;
		var width=UI.selectarea[2]-UI.selectarea[0];
		var height=UI.selectarea[3]-UI.selectarea[1];
		UIctx.clearRect(0, 0, CanvasUI.width, CanvasUI.height);
		UIctx.strokeRect(UI.selectarea[0],UI.selectarea[1], width, height);
	}
}
function mupEvent(evt){
	if(UI.state=='selectarea'){
		var x=UI.selectarea[0]<UI.selectarea[2]?UI.selectarea[0]:UI.selectarea[2];
		var y=UI.selectarea[1]<UI.selectarea[3]?UI.selectarea[1]:UI.selectarea[3];
		var width=Math.abs(UI.selectarea[0]-UI.selectarea[2]);
		var height=Math.abs(UI.selectarea[1]-UI.selectarea[3]);
		var imdata=ctx.getImageData(x*zoom,y*zoom,width*zoom,height*zoom);
		CanvasUI.width=width;
		CanvasUI.height=height;
		mycanvas.width=width*zoom;
		mycanvas.height=height*zoom;
		mycanvas.style.width=mycanvas.width/zoom+"px";
		ctx.putImageData(imdata,0,0);
	}
	UIctx.clearRect(0, 0, CanvasUI.width, CanvasUI.height);
	UI.state='';
}
function saveImg(){
	var i;
	var b64=mycanvas.toDataURL();
	for(i=0;i<60;i++){if(b64[i]==','){break;}}
	b64=b64.slice(i+1,b64.length);
	var sobj={
		filename:document.getElementById('file').files[0].name,
		data:b64
	};
	socket.send(sobj);
}

function blurImg(){
	let BlurWorker=new Worker('./blur.js');
	let iw=mycanvas.width,ih=mycanvas.height;
	let imgdata=ctx.getImageData(0,0,iw,ih).data;
	BlurWorker.postMessage({iw:iw,ih:ih,imgdata:imgdata});
	BlurWorker.onmessage=function(e){
		ctx.putImageData(new ImageData(e.data,iw,ih),0,0);
		UI.state='idle';
		UIctx.clearRect(0, 0, CanvasUI.width, CanvasUI.height);
	}
	UIctx.fillStyle = "rgba(200,200,200,0.8)";
	UIctx.fillRect(0,0,CanvasUI.width ,CanvasUI.height);
	UIctx.fillStyle = "rgba(100,100,100,0.8)";
	UIctx.fillRect(0,CanvasUI.height/2-20,CanvasUI.width , 40);
	UIctx.fillStyle="white";
	UIctx.fillText("Bluring...",60,CanvasUI.height/2+5);
	UI.state='working';
}

window.onload=function(){
	CanvasUI=document.getElementById('CanvasUI');
}
reader.onload=function(){
	var myphoto=new Image();
	myphoto.src=reader.result;
	myphoto.onload=function(){
		mycanvas=document.createElement('canvas');
		document.getElementById('PaintArea').appendChild(mycanvas);
		mycanvas.width=myphoto.width;
		mycanvas.height=myphoto.height;
		mycanvas.style.width=myphoto.width/zoom+"px";
		
		CanvasUI.width=myphoto.width/zoom;
		CanvasUI.height=myphoto.height/zoom;
		CanvasUI.style.zIndex='3';
		CanvasUI.style.boxShadow="0px 0px 0px 2px black";
		CanvasUI.addEventListener('mousedown',mdEvent);
		CanvasUI.addEventListener('mousemove',mvEvent);
		CanvasUI.addEventListener('mouseup',mupEvent);
		UIctx=CanvasUI.getContext('2d');
		UIctx.strokeStyle="#FF0000";
		ctx=mycanvas.getContext("2d");
		document.getElementById('FunBtns').style="block";
		document.getElementById('info').innerHTML=0+" , "+0;
		ctx.drawImage(myphoto,0,0);
	}
}

socket.on('message',function(data){
	alert(data);
});
