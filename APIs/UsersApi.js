import express from 'express';
import usersController from '../controllers/UsersController';
const usersApi = express.Router();

/*
* /users:
*    get: all users from database
* return response 201: Ok
*/
usersApi.get('/', (req, res) =>{
    usersController.getAllUsers().then(users =>{
        console.log('Users are : ', users.toString());
        res.send(users);
    }).catch((err)=>{
        res.status(404);
        res.send(err);
    });
});
/*
* /users:
*     post: create user
*       parameters in body
* return response 201: Ok
*
 */
usersApi.post('/', (req, res)=> { // how to deal with user creation / user signup
    let userData = req.body;
    usersController.addNewUser(userData).then(created => {
        res.send(created);
    }).catch((err) => {
        res.send(err);
    });

});

usersApi.put('/update/:email', function (req, res) {
    let email = req.params.email;
    let body = req.body;
    console.log('ID is : ', email, ' instructions are: ', body);

    usersController.updateUserValue(email, body).then((updated, err)=>{
        if(err)
            res.status(400).send(err);
        res.send(updated);
    }).catch((e)=>{
        res.status(400).send(e.errmsg);
    });
});

/*
* /users/delete/{email}
*   delete: user by email
* return response 200: Ok
*/
usersApi.delete('/delete/:email', function (req, res) {
    let userEmail = req.params.email;
    console.log('userEmail to delete is:',userEmail);
    usersController.deleteUserAccount(userEmail).then((deleted, err)=> {
        res.send(deleted);
        console.log('This is error: ', err);
    }, err=>{
        console.log('This is error2 : ', err);
        res.status(400).send(err);
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


export default usersApi;
