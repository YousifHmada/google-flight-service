const express = require('express')
const app = express() //Start express server
const port = process.env.port || 3000


const scrape = require('./scrape')

var status = 'pending'
var last_request_results = []

// Accept cors
const cors = require('cors');
app.use(cors());

/*
    End point to scrape google flights for one way tickets between the 
    origin airport code and the destination airport between two dates 
    and find the lowest rate between those two dates 
    Query => { origin_airport_code, des_airport_code, from, to }
    Response => { data : [...] }
*/
app.get('/flights', (req, res) => {
    //Reset status
    status = 'pending'
    last_request_results = []

    //Fetch params
    var {
        origin_airport_code = '',
        des_airport_code = '',
        from,
        to
    } = req.query || {}

    scrape(
        origin_airport_code,
        des_airport_code,
        from,
        to
    ).then(data => {
        status = 'done'
        last_request_results = data
        res.json({ data })
    }).catch(err => {
        status = 'failed'
        last_request_results = []
        res.status(400).end('Something went wrong')
    })
})

/*
    End point to get the current status or the result of the last request if done
    Response =>  { status : 'failed' } || { status : 'pending' } || { status : 'done', data : [...] }
*/
app.get('/status', (req, res) => {
    var res_obj = {
        status
    }
    if (status == 'done') {
        res_obj.data = last_request_results
    }
    res.json(res_obj)
})

//Make the server start listening
app.listen(
    port,
    () => console.log(`Example app listening on port ${port}!`)
)