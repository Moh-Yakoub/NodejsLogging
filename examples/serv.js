var mqtt = require("./MQTT.js/lib/mqtt");
var l = require("./log/logger.js");
var colors = require("colors");
l.Logger(".",10*1024*1024);


mqtt.createServer(function(client){
var self=this;
if(!self.clients)self.clients={};
if(!self.client_topics)self.client_topics={};


//
client.on('connect',function(packet){
client.connack({returnCode:0});
client.id = packet.client;
self.clients[client.id]=client;
l.log(client.id+':'+'connected');
});

//
client.on('subscribe',function(packet){
//getting id
var granted=[];
for (var i = 0; i < packet.subscriptions.length; i++) {
      var sub = packet.subscriptions[i]
      granted.push(sub.qos);
}
client.suback({messageId:packet.messageId,granted:granted});
self.client_topics[client.id]=packet.subscriptions[0]['topic'];
l.log(client.id+':'+'subscribed to :'+packet.subscriptions[0]['topic']);
});


client.on('publish',function(packet){
var topic = packet['topic'];
for(var k in self.client_topics){
l.log(k+":published ("+packet.payload+"),on topic("+packet.topic+")");
if(self.client_topics[k]==topic){
try{
self.clients[k].publish({topic:packet.topic,payload:packet.payload})
}catch(err){
delete(self.clients[k]);
delete(self.client_topics[k]);
l.log("Deleting buggy client");
}
}
}
});

 client.on('pingreq', function(packet) {
    client.pingresp();
  });

  client.on('disconnect', function(packet) {
    client.stream.end();
    l.log(client.id+":"+"_disconnected".red.bold);
delete(self.clients[client.id]);
delete(self.client_topics[client.id]);

  });

  client.on('close', function(err) {
    delete self.clients[client.id];
  });

  client.on('error', function(err) {
    client.stream.end();
l.log('error');
    util.log('error!');
  });

}).listen(1833);