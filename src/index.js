const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.post('/',(req,res)=>{
    res.send({'message': 'connected'});
})
app.listen(port,()=>{
    console.log(`Server is up and running on port ${port}`);
})