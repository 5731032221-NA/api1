const publishToQueue = require('./services/MQServices');
//import {publishToQueue} from '../services/MQServices';
//ABC
const express = require('express');
const app = express();


const datetime = require('./library/datetime');
const schema = require('./library/checkSchema');
var mongo = require('./library/mongoconfig');
const lookup_pm200mp = require('./library/lookup/lookup_pm200mp');
const mqconfig = require('./library/mqconfig');

const bodyParser = require('body-parser');

app.listen(8203, function () {
    console.log('app listening on port 8203!');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var db = mongo.connect;

app.get('/all',function(req,res){
	db.transaction.find(function(err,docs){
		res.json(docs);
		console.log('SHOW ALL Transactions')
	});
});

app.post('/cardtransaction', async function (req, res) {
	//console.log(JSON.stringify(req.headers));
    var dtf = await datetime.getdatetime();

    //check schema
    if( await schema.checkSchema(req, res, dtf, "CardTransactions")){
    console.log("Check Schema pass")
    


    // lookup PM200MP and check connection and get PartnerCardInfo
    console.log("start lookup_pm200mp")
    let PCDetail = await lookup_pm200mp.lookup(res, dtf, req.body.PARTNER_ID,req.body.CARD_REF);
    ////////////// exist card //////////////////
    let MBCODE = PCDetail[0].MBCODE;
    console.log("MBCODE = "+MBCODE)


    console.log("Include MBCODE to Req.body")
    var stringtosent = req.body;
    stringtosent["MBCODE"] = MBCODE;
    stringtosent["x-global-transaction-id"] = await req.headers['x-global-transaction-id']

    //MQ
    console.log("Start sending message to queue")
    await publishToQueue.publishToQueue(mqconfig.queuename,JSON.stringify(stringtosent));
    console.log("Sent to queue Successfully")

    //connect MongoDB
    //var db = mongo.connect;
    console.log('DBBBBBBBBBBBBBBBBBBBBBBBBB : ' +db)

     db.on('error', function (errr) {
         console.log('database error', errr)
          res.status(200).json({
              "RESP_SYSCDE": 503,
              "RESP_DATETIME": dtf,
              "RESP_CDE": 200,
              "RESP_MSG": "Error Cannot Connect DB"
          });
         res.end();
         db.close();
    })
    console.log('attempt connect database')

    //TEST MONGO CONNECTION
    var TID = req.body.TXN_REFNBR;
    console.log("Before Inserting to Database")
    db.transaction.insert({"id":TID,"Body":req.body} , function (err,docs){
        if(err) {
            console.log('MongoDB Error Please Restart DatabaseNode and ThisNode')
            res.status(200).json({
                "RESP_SYSCDE": 304,
                "RESP_DATETIME": dtf,
                "RESP_CDE": 200,
                "RESP_MSG": "Database error"
            });
            res.end(); 
        }  
        else{
            res.status(200).json({
                "RESP_SYSCDE": 200,
                "RESP_DATETIME": dtf,
                "RESP_CDE": 200,
                "RESP_MSG": "Process SuccessFully",
                "TXN_REFNBR":req.body.TXN_REFNBR
            });
            res.end(); 
        }
        
    });
   }
})



