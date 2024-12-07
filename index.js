const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

// middleweare
app.use('/', (req, res) => { 
    res.send('Server is Running')
})
app.listen(port, ()=>{
    console.log(`Server Running on Port: ${port}`)
})