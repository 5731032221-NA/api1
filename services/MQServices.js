// var amqp = require ('amqplib/callback_api');
// const CONN_URL = 'amqp://localhost';
// let ch = null;
// amqp.connect(CONN_URL, function (err, conn) {
//    if(err){console.log('errrr')}
//    conn.createChannel(function (err, channel) {
//       ch = channel;
//    });
// });
// module.exports.publishToQueue = (async function (queueName, data) {
//    ch.sendToQueue(queueName, new Buffer(data));
// })
// process.on('exit', (code) => {
//    ch.close();
//    console.log(`Closing rabbitmq channel`);
// });
var amqp = require('amqplib/callback_api');
let ch = null;
amqp.connect('amqp://192.168.0.3', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
     ch = channel;
  });
});
 const publishToQueue = async (queueName, data) => {
   await ch.assertQueue(queueName, { durable: true });
   await ch.sendToQueue(queueName, new Buffer(data),{persistent: true});
}
process.on('exit', (code) => {
   ch.close();
   console.log(`Closing rabbitmq channel`);
});

module.exports = {publishToQueue};
