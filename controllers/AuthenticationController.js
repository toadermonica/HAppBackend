import {getTokens, verifyRefreshToken} from "../utils/JwtToken";
import usersModule from "../models/UsersModule";
import {comparePassword, hashPassword, isValidEmail} from "../utils/AuthenticationUtil";
import usersController from "./UsersController";

class AuthenticationController{
    constructor(){
        this.usersModule = usersModule.getUsers();
    }

    registerNewUser(user){
        return new Promise((resolve, reject)=>{
            if(isValidEmail(user.email)) {
                //hash password
                user.password = hashPassword(user.password);
                //create & save new instance
                let userObject = new this.usersModule(user);
                return resolve(userObject.save());
            }else{
                reject('Not a valid email');
            }
        });
    }

    getUserRefreshToken(token) {
        return this.usersModule.findOne({token: token});
    }

    regenerateRefreshToken(refreshToken){
        // if ok, find user and add refresh token to db
        const user = verifyRefreshToken(refreshToken);
        if(!user.email) return Promise.reject(null);
        return this.usersModule.findOne({email:user.email}).then(value => {
            return getTokens(user.email).then(responseTokens => {
                value.token = responseTokens.refreshToken;
                value.save();
                return Promise.resolve(responseTokens);
            });
        });
    }

    async authenticateUser(user){
        const userObj = await usersController.findUserByEmail(user.email);
        if(!comparePassword(user.password, userObj.password)){
            return Promise.reject('Invalid credentials, please try again');
        }
        return getTokens(userObj.email).then(response => {
            console.log('Response is: ', response);
            if(!response) return Promise.reject(null);
           userObj.token = response.refreshToken;
           return usersController.updateUserRefreshToken(userObj.email, userObj.token).then(res => {
               console.log('res is ', res);
               if(!res) return Promise.reject(null);
               return Promise.resolve(response);
           });
        });
    }
}

const authController = new AuthenticationController();
export default authController;
