import express from 'express';
let router = express.Router();
import jwt from 'jsonwebtoken' 
import { stringToHash, varifyHash } from 'bcrypt-inzi' 
import { client } from '../mongoDb.mjs'
const userCollection = client.db('OBISIPAuth').collection("Users");

router.post('/login', async (req, res, next) => {
    if (
        !req.body.username
        || !req.body.password
    ) {
        res.status(403).send(
            `Required Parameters Missing
                username : "Karan Kumar"
                Password: "Password"`
        );
        return;
    }

    req.body.username = req.body.username.toLowerCase();

    try {
        let result = await userCollection.findOne({ username: req.body.username });
        console.log(result);

        if (!result) {  
            res.status(403).send({
                message: "Username & Password Incorrect"
            });
            return;
        } else {
            const isMatch = await varifyHash(req.body.password, result.password) 
            if (isMatch) { 
                const token = jwt.sign({  
                    isAdmin: false,
                    username: req.body.username,
                }, process.env.SECRET_KEY, {
                    expiresIn: '1h' 
                });  
                res.cookie('token', token, {
                    httpOnly: true, 
                    secure: true,
                })
                res.send({
                    message: "Login Successfully",
                });
            } else {
                res.status(403).send({
                    message: "Username & Password Incorrect"
                });
                return;
            }
        }
    } catch (err) {
        console.log(`Error:${err}`);
        res.status(500).send('Server Error Please try Again Later');
    }
});




router.post('/signup', async (req, res, next) => {
    if ( 
        !req.body?.username
        || !req.body?.password
    ) {
        res.status(403).send(
            `Required Parameters Missing
                Please Fill All the Fields
                
                username : "xyz",
                Password: "Password"`
        );
        return;
    }

    req.body.username = req.body.username.toLowerCase(); 

    try {
        let result = await userCollection.findOne({ username: req.body.username }); 
        console.log(result);

        if (!result) {
            const passwordHash = await stringToHash(req.body.password) 
            const insertResponse = await userCollection.insertOne({
                username: req.body.username,
                password: passwordHash,
                CreatedOn: new Date
            });
            console.log(`Insert Response: ${insertResponse}`);
            res.send({
                message: "Signup Successfully"
            })
        } else {
            res.status(403).send({
                message: "The Username is Already Exists"
            });
        }
    } catch (err) {
        console.log(`Error:${err}`);
        res.status(500).send('Server Error Please try Again Later');
    }
});

export default router;