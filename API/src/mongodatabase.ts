import mongoose from 'mongoose'

mongoose.connect("mongodb://localhost/usersTFGDAW",{
    useNewUrlParser:true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex:true    
})
    .then(db=>console.log('MONGODB CONNECTED'))
    .catch(error => console.log(error));