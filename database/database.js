import chalk from'chalk';
import mongoose from 'mongoose';
require('dotenv').config();

class DatabaseConnection {
    constructor(){
        this.connectToMongoDb();
    }
    getConnUri(){
        return process.env.DB_CONN_URI;
    }
    connectToMongoDb(){
        mongoose.connect(this.getConnUri().toString(), {useUnifiedTopology: true})
            .then(() => {console.log(chalk.blueBright('Connected!'));},
            err => { throw err;}
        );
    }
    getMongoose(){
        return mongoose;
    }
}

const dbCon = new DatabaseConnection();
export default dbCon;
