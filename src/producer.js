const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const kafka = require('kafka-node')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var Producer = kafka.Producer,
    client = new kafka.Client(),
    producer = new Producer(client);

producer.on('ready', function () {
    console.log('Producer is ready');
});

producer.on('error', function (err) {
    console.log('Producer is in error state');
    console.log(err);
});

app.get('/',function(req,res){
    res.json({greeting:'Kafka Consumer'})
});

app.post('/sendMessage',function(req,res){
    var sentMessage = JSON.stringify(req.body);
    payloads = [
        { topic: "test", messages:sentMessage , partition: 0 }
    ];
    producer.send(payloads, function (err, data) {
            res.json(data);
    });
    
})

app.listen(5001,function(){
    console.log('Kafka producer running at 5001')
});

/*app.get('/posts', (req, res) => {
  res.send(
    [{
      title: "Hello World!",
      description: "Hi there! How are you?"
    }]
  )
})

app.listen(process.env.PORT || 8081)
*/