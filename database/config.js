const mongoose = require('mongoose');

const dbConnection = async()=>{
    try {
        await mongoose.connect(process.env.DB_CNN);
        console.log("Db Online Correctly");
    } catch (error) {
        console.log(error);
        throw new Error('Error starting database reference logs')
    }
   
}

module.exports= {
    dbConnection
}