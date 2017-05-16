let express=require('express');
let fs=require('fs');
let app=express();
let io=require('socket.io');

app.use(express.static(__dirname+"/public"));
let server=app.listen(80,function(err){
	if(err){
		console.log(err);
		return;
	}
	console.log("server start at 1234");
});
io=io(server);
io.on('connection',function(socket){
	socket.on('message',function(data){
		console.log('receive a file');
		var buf = new Buffer(data.data, 'base64');
		fs.writeFileSync(data.filename,buf);
		socket.send("File have been received");
	});
});