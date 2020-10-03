import usersModule from '../models/UsersModule';
class UsersController{

    constructor(){
        this.usersModule = usersModule.getUsers();
    }

    /**************************
     **** Non-Bulk Operations
     **************************/
    addNewUser(user){
        let objToSave = new this.usersModule(user);
        return objToSave.save();
    }
    updateUserValue(email, newValues){
        return new Promise((resolve, reject) => {
            this.usersModule.findOneAndUpdate({email: email}, {$set:{email:"toadermonica@gmail.com"}}, {new: true})
                .then((updated, error) =>{
                    if(error){
                        reject(error);
                    }
                    resolve(updated);
                });
        });
    }
    deleteUserAccount(userEmail){
        return new Promise((resolve, reject) => {
            //find and return the task which we want to delete
            this.usersModule.find({email:userEmail}, (err, obj)=>{
                if(err || obj === null){
                    reject(err);
                }else{
                    this.usersModule.deleteOne({email: userEmail}).then((deleted, err)=>{
                        if(err)
                            reject(err);
                        resolve(deleted);
                    });
                }
            });
        });
    }
    /************************
    *****Bulk operations*****
    ************************/
    getAllUsers(){
        return this.usersModule.find({});
    }
    deleteAllUsersFromDb(){
        return this.usersModule.remove({});
    }
}
const usersController = new UsersController();
export default usersController;
