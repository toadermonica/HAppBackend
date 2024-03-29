import db from '../database/database';
class UsersModule {
    constructor(){
        this.mongoose = db.getMongoose(); //connection to db
        this.Schema = this.mongoose.Schema;
        this.createUserSchema();
        this.UserModule = this.mongoose.model('users', this.UserModule);
    }
    createUserSchema(){
        this.UserModule = new this.Schema({
            email:{type: String, required: true, unique: true, dropDups: true},
            password:{type: String, required: true},
            token:{type: String, require: false}
        },{versionKey: false, timestamps: true});
    }
    getUsers(){
        return this.UserModule;
    }
}
const usersModule = new UsersModule();
export default usersModule;
