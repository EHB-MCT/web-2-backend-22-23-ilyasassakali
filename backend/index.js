const express = require('express')
const app = express()
const cors = require('cors')
const {
    MongoClient
} = require('mongodb')
const {
    v4: uuidv4,
    validate: uuidValidate
} = require('uuid')
require('dotenv').config()

//create mongoclient
const client = new MongoClient(process.env.FINAL_URL)

app.use(express.urlencoded({
    extended: false
}));
app.use(cors())
app.use(express.json())

//LOGIN SYSTEM
app.get('/testMongo', async (req, res) => {
    try {
        //connect to the db
        await client.connect();
        //retrieve the users collection data
        const colli = client.db('logintutorial').collection('users');
        const users = await colli.find({}).toArray();

        //send back the data with response
        res.status(200).send(users);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: 'something went wrong',
            value: error
        });
    } finally {
        await client.close();
    }
})

app.post("/register", async (req, res) => {


    //check for empty fields
    if (!req.body.username || !req.body.email || !req.body.password) {
        res.status(401).send({
            status: "Bad request",
            message: "Some fields are missing: username, email, password"
        })
        return
    }

    try {
        //connect to the db
        await client.connect();

        const user = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            uuid: uuidv4()
        }
        //retrieve the users collection data
        const colli = client.db('logintutorial').collection('users');
        const insertedUser = await colli.insertOne(user)

        //send back when user is saved
        res.status(201).send({
            status: "Saved",
            message: "User has been saved",
            data: insertedUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: 'something went wrong',
            value: error
        });
    } finally {
        await client.close();
    }

})

app.post("/login", async (req, res) => {


    //check for empty fields
    if (!req.body.email || !req.body.password) {
        res.status(401).send({
            status: "Bad request",
            message: "Some fields are missing: email, password"
        })
        return
    }

    try {
        //connect to the db
        await client.connect();

        const loginuser = {
            email: req.body.email,
            password: req.body.password
        }
        //retrieve the users collection data
        const colli = client.db('logintutorial').collection('users');

        const query = {
            email: loginuser.email
        }
        const user = await colli.findOne(query)

        if (user) {
            //compare passwords
            if (user.password == loginuser.password) {
                //password is correct
                res.status(200).send({
                    status: "Authentication succesfull!",
                    message: "You are logged in!",
                    data: {
                        username: user.username,
                        email: user.email,
                        uuid: user.uuid
                    }
                })
            } else {
                //password is incorrect
                res.status(401).send({
                    status: "Authentication error",
                    message: "Password is incorrect!"
                })
            }
        } else {
            //no user found: send back error
            res.status(401).send({
                status: "Authentication error",
                message: "No user with email has been found! Make sure your register first!"
            })

        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: 'something went wrong',
            value: error
        });
    } finally {
        await client.close();
    }


})

app.post("/verifyID", async (req, res) => {


    //check for empty and faulty ID fields
    if (!req.body.uuid) {
        res.status(401).send({
            status: "Bad request",
            message: "ID is missing"
        })
        return
    } else {
        if (!uuidValidate(req.body.uuid)) {
            res.status(401).send({
                status: "Bad request",
                message: "ID is not a valid UUID"
            })
            return
        }
    }

    try {
        //connect to the db
        await client.connect();

        //retrieve the users collection data
        const colli = client.db('logintutorial').collection('users');

        const query = {
            uuid: req.body.uuid
        }
        const user = await colli.findOne(query)

        if (user) {

            res.status(200).send({
                status: "Verified!",
                message: "You UUID is valid!",
                data: {
                    username: user.username,
                    email: user.email,
                    uuid: user.uuid
                }
            })
        } else {
            //password is incorrect
            res.status(401).send({
                status: "Verify error",
                message: `No user exists with uuid ${req.body.uuid}!`
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: 'something went wrong',
            value: error
        });
    } finally {
        await client.close();
    }


})

//MUZZY SYSTEM
app.get('/AllMuzzys', async (req, res) => {
    try {
        //connect to the db
        await client.connect();
        //retrieve the muzzys collection data
        const colli = client.db('muzzysystem').collection('muzzys');
        const muzzys = await colli.find({}).toArray();

        //send back the data with response
        res.status(200).send(muzzys);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: 'something went wrong',
            value: error
        });
    } finally {
        await client.close();
    }
})

app.post("/savemuzzy", async (req, res) => {


    //check for empty fields
    if (!req.body.opinion || !req.body.score) {
        res.status(401).send({
            status: "Bad request",
            message: "Some fields are missing: opinion, score"
        })
        return
    }


    try {
        //connect to the db
        await client.connect();

        const muzzy = {
            opinion: req.body.opinion,
            score: req.body.score,
            muzzyimg: req.body.muzzyimg,
            muzzytrack: req.body.muzzytrack,
            muzzyartist: req.body.muzzyartist,
            username: req.body.username,
            date: req.body.date,
            time: req.body.time,
            uuid: uuidv4()
        }
        //retrieve the users collection data
        const colli = client.db('muzzysystem').collection('muzzys');
        const insertedMuzzy = await colli.insertOne(muzzy)

        //send back when muzzy is saved
        res.status(201).send({
            status: "Saved",
            message: "Muzzy has been saved",
            data: insertedMuzzy

        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: 'something went wrong',
            value: error
        });
    } finally {
        await client.close();
    }

})

app.get('/AllalbumMuzzys', async (req, res) => {
    try {
        //connect to the db
        await client.connect();
        //retrieve the muzzys collection data
        const colli = client.db('muzzysystem').collection('albummuzzys');
        const muzzys = await colli.find({}).toArray();

        //send back the data with response
        res.status(200).send(muzzys);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: 'something went wrong',
            value: error
        });
    } finally {
        await client.close();
    }
})

app.post("/savealbummuzzy", async (req, res) => {


    //check for empty fields
    if (!req.body.opinion || !req.body.score) {
        res.status(401).send({
            status: "Bad request",
            message: "Some fields are missing: opinion, score"
        })
        return
    }


    try {
        //connect to the db
        await client.connect();

        const muzzy = {
            opinion: req.body.opinion,
            score: req.body.score,
            muzzyimg: req.body.muzzyimg,
            muzzyalbum: req.body.muzzyalbum,
            muzzyartist: req.body.muzzyartist,
            username: req.body.username,
            date: req.body.date,
            time: req.body.time,
            uuid: uuidv4()
        }
        //retrieve the users collection data
        const colli = client.db('muzzysystem').collection('albummuzzys');
        const insertedMuzzy = await colli.insertOne(muzzy)

        //send back when muzzy is saved
        res.status(201).send({
            status: "Saved",
            message: "Muzzy has been saved",
            data: insertedMuzzy

        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: 'something went wrong',
            value: error
        });
    } finally {
        await client.close();
    }

})



app.listen(3000);
console.log("app running at http://localhost:3000");