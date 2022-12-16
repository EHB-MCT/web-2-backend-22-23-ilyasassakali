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


//MUZZY SYSTEM

//muzzytracks
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
            idtrack: req.body.idtrack,
            uuid: uuidv4()
        }
        //retrieve the users collection data
        const colli = client.db('muzzysystem').collection('muzzys');
        const insertedMuzzy = await colli.insertOne(muzzy)

        //send back when muzzy is saved
        res.status(201).send({
            status: "Saved",
            message: "Muzzy has been published successfully",
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

//muzzyalbums
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
            idalbum: req.body.idalbum,
            uuid: uuidv4()
        }
        //retrieve the users collection data
        const colli = client.db('muzzysystem').collection('albummuzzys');
        const insertedMuzzy = await colli.insertOne(muzzy)

        //send back when muzzy is saved
        res.status(201).send({
            status: "Saved",
            message: "Muzzy has been published successfully",
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

//muzzyartists
app.get('/AllartistMuzzys', async (req, res) => {
    try {
        //connect to the db
        await client.connect();
        //retrieve the muzzys collection data
        const colli = client.db('muzzysystem').collection('artistmuzzys');
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

app.post("/saveartistmuzzy", async (req, res) => {


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
            muzzyartist: req.body.muzzyartist,
            username: req.body.username,
            date: req.body.date,
            time: req.body.time,
            idartist: req.body.idartist,
            uuid: uuidv4()
        }
        //retrieve the users collection data
        const colli = client.db('muzzysystem').collection('artistmuzzys');
        const insertedMuzzy = await colli.insertOne(muzzy)

        //send back when muzzy is saved
        res.status(201).send({
            status: "Saved",
            message: "Muzzy has been published successfully",
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
            message: "User has been created",
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

// Get a user with uuid  (using a npm package)
app.get('/:id', async (req, res) => {
    try {
        let uuid = req.params.id;
        //connect to the db
        await client.connect()

        //retrieve the users collection data
        const usersCollection = client.db('logintutorial').collection('users');

        //queryforuuid
        const query = {
            uuid: req.params.id
        }

        const answ = await usersCollection.findOne(query)

        res.status(200).json(answ)
    } catch (error) {

        res.status(500).send({
            error: 'something went wrong',
            value: error.stack
        })
    } finally {
        await client.close()
    }
})

// Delete a user with uuid (using a npm package)
app.delete('/:id', async (req, res) => {
    try {
        //connect to the db
        await client.connect();

        //retrieve the users collection data
        const usersCollection = client.db('logintutorial').collection('users');

        //queryforuuid
        const query = {
            uuid: req.params.id
        }

        const userDelete = await usersCollection.deleteOne(query)

        res.status(200).send(userDelete);
    } catch (error) {

        res.status(500).send({
            error: 'error',
            value: error.stack
        });
    }
})

// Update username,email and password (using a npm package)
app.put('/:id', async (req, res) => {

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
        //retrieve the users collection data
        const usersCollection = client.db('logintutorial').collection('users');

        //queryforuuid
        const query = {
            uuid: req.params.id
        }

        const user = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        }


        const userUpdate = await usersCollection.updateOne(query, {
            $set: {
                username: user.username,
                email: user.email,
                password: user.password
            }
        })

        if (userUpdate) {
            res.status(201).send({
                succes: `Profile changes updated succesfully.`,
            });
            return;
        } else {
            res.status(400).send({
                error: `Profile changes failed`,
                value: error.stack,
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: 'Something went wrong',
            value: error.stack
        });
    } finally {
        await client.close();
    }
});



app.listen(3000);
console.log("app running at http://localhost:3000");