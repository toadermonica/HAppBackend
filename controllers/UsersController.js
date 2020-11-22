import usersModule from '../models/UsersModule';
import {comparePassword, hashPassword} from "../utils/AuthenticationUtil";
import authController from "./AuthenticationController";
class UsersController{

    constructor(){
        this.usersModule = usersModule.getUsers();
    }

    /**
     * Function that finds user by email
     * Checks the current password for match
     * Updates old password with new password
     **/
    updateUserPassword(email, password, newPassword){
           return this.usersModule.findOne({email:email}).then(userValue => {
                if(!comparePassword(password, userValue.password)){
                    return Promise.reject("Not matching");
                }
                const digest = hashPassword(newPassword);
                userValue.password = digest;
                userValue.save();
           });
    }
    deleteUserAccount(userEmail){
        return this.usersModule.deleteOne({email: userEmail});
    }
    findUserByEmail(userEmail){
        return this.usersModule.findOne({email:userEmail});
    }
    updateUserRefreshToken(email, token){
        if(!email || !token)
            return Promise.reject(null);
        console.log('null user is ', email);
        return this.usersModule.findOneAndUpdate(email, { $set: { token: token } });
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
