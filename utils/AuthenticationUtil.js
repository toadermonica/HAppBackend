import bcrypt from "bcrypt";
import isEmail from 'validator/lib/isEmail';

const saltRounds = 12;
const salt = bcrypt.genSaltSync(saltRounds);

export function hashPassword(password){
   return bcrypt.hashSync(password, salt);
}
export function comparePassword(plainPassword, hashedPassword){
    const test = bcrypt.compareSync(plainPassword, hashedPassword);
    return test;
}

export function isValidEmail(email){
    return isEmail(email);
}
