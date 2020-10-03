import chalk from'chalk';
import mongoose from 'mongoose';


class DatabaseConnection {

    constructor(){
        this.connectToMongoDb();
    }

    getConnUri(){
        return "mongodb+srv://toadermonica:Pinguinireci2828@mongodbfreecluster.clfgi.azure.mongodb.net/HAppDb?retryWrites=true";
        //return `mongodb+srv://${username}:${password}@mongodbfreecluster.clfgi.azure.mongodb.net/${dbname}?retryWrites=true&w=majority`;
        //mongodb+srv://toadermonica:Pinguinireci2828@mongodbfreecluster.clfgi.azure.mongodb.net/HAppDb?retryWrites=true&w=majority
    }
    connectToMongoDb(){

        mongoose.connect(this.getConnUri(), {useUnifiedTopology: true})
            .then(() => {

                console.log(chalk.blue('Ready for take off MongoDb'));
                },
            err => { throw err;}
        );
    }


    getMongoose(){
        return mongoose;
    }
}

const dbCon = new DatabaseConnection();
export default dbCon;
