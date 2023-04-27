const express = require('express')
var bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.json());
const mongoose = require('mongoose');
require('dotenv').config()
const cors = require('cors');

app.get('/', function (req, res) {
  res.send('Server')
})

app.use(cors())

mongoose.connect(process.env.MONGODB_URL,{
useNewUrlParser: true,
useUnifiedTopology: true,
}).then(() => console.log('Connected!'))
  .catch( (e) => console.log('error', e)) 

//mongoose schema
var telemetrySchema = new mongoose.Schema({
    name: String,
    data: []
});

 
let Events = mongoose.model('Events', {
    name: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    data: {
        type: [],
        required: true,
        minLength: 1,
        trim: true
    }
});

app.get('/getTelemetry', async (req, res) => {
    try {
      const events = await Events.find({ });
      res.send(events);
      console.log("events sent")
    } catch (err) {
      console.log(err);
    }
  })
  
app.post('/telemetry/upload', (req, res) => {
    const telemetryData = req.body.events.map(function(data){
        return {
            name: data.eid,
            data: data
        }
    })

    Events.insertMany(telemetryData).then(function(){
        res.status(200).send({'message': 'Telemetry added successfully'})
        console.log("Telemetry added successfully")  // Success
    }).catch(function(error){
        console.log(error)      // Failure
    });
});

app.listen(process.env.PORT, () => { console.log("server is running on ", process.env.PORT)})