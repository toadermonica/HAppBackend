import express from 'express';
import usersController from '../controllers/UsersController';
import {authenticateToken} from "../utils/JwtToken";
import authController from "../controllers/AuthenticationController";
const usersApi = express.Router();

/**
 * Register / create new user in the system
 * based on email
 */
usersApi.post('/register', function(req, res){
    let newUser = req.body;
    usersController.findUserByEmail(newUser.email).then((returnedUser) => {
        if(returnedUser !== null){
            res.status(417).send('Cannot perform request');
            return;
        }
        authController.registerNewUser(newUser).then((createNewUser)=>{
            res.send(createNewUser);
        }).catch((error) => {
            res.status(404).send(error);
        })
    });
});

/**
 * Authenticate - login user and assign token
 */
usersApi.post('/login', function (req,res) {
    let user = req.body;
    authController.authenticateUser(user).then((response)=>{
        console.log('Response I am sending is: ', response);
        res.status(201).send(response);
    }).catch((error) => {
        res.status(404).send(error);
    })
});
/**
 * Api for refresh token when the access token expires.
 */
usersApi.post('/token', function (req,res) {
    const refreshToken = req.body.token;
    /**check if the token from body exists. it it is null then send status 401**/
    if(!refreshToken) return res.sendStatus(401);
    /**check if token is found in db**/
    authController.getUserRefreshToken(refreshToken).then(response => {
       if(!response.email) return res.sendStatus(403);
    });
    /**Verify incoming refresh token and if ok then provide two new tokens**/
    authController.regenerateRefreshToken(refreshToken).then(response => {
        if(!response) return res.sendStatus(403);
        res.status(200).send(response);
    });
});

/**
 * Update user password from setings - when current password is known
 * purpose is to have something here to update and test the token check
 * and expiration time;
 */

usersApi.put('/changePassword', authenticateToken, function (req, res) {
    const email = req.body.email;
    const oldPass = req.body.password;
    const newPass = req.body.newPassword;
    if(!email || !oldPass || !newPass){
        res.status(400).send('Bad request');
    }
    usersController.updateUserPassword(email, oldPass, newPass)
        .then((updated)=>{
            res.send(updated);
        }).catch((err) =>{
            res.status(400).send(err);
        });
});

/*/!*
* /users/delete/{email}
*   delete: user by email
* return response 200: Ok
*!/
usersApi.delete('/delete/:email', authenticateToken, function (req, res) {
    let userEmail = req.params.email;
    usersController.deleteUserAccount(userEmail).then((deleted, err)=> {
        res.send(deleted);
    }, err=>{
        res.status(400).send(err);
    });
});*/

////////////////////////////////////////////////////////////////////////////////////
///////////////////////////Non regular user apis for access/////////////////////////
////////////////////////////////////////////////////////////////////////////////////
/*
* /users:
*    get: all users from database
* return response 201: Ok
*/
usersApi.get('/', (req, res) =>{
    usersController.getAllUsers().then(users =>{
        res.send(users);
    }).catch((err)=>{
        res.status(404);
        res.send(err);
    });
});
/*
* /users/delete
*   delete: all users
* return response 200: Ok
*/
usersApi.delete('/delete', function (req, res) {
    usersController.deleteAllUsersFromDb().then((response)=> {
        res.send(response);
    }).catch((err)=>{
        res.status(400).send(err);
    });
});
///////////////////////////////////////////////////////////////////////////////////

export default usersApi;
