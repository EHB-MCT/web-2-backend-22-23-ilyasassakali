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
const Track = require('./modal/Track.js')
const Album = require('./modal/Album.js')
const Artist = require('./modal/Artist.js')
//create mongoclient
const client = new MongoClient(process.env.FINAL_URL)

app.use(express.urlencoded({
    extended: false
}));
app.use(cors())
app.use(express.json())


//CRUD MUZZY SYSTEM
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

        /*  const muzzy = {
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
          }*/
        //retrieve the muzzys collection data
        const colli = client.db('muzzysystem').collection('muzzys');
        let muzzy = new Track(req.body.opinion, req.body.score, req.body.muzzyimg, req.body.muzzytrack, req.body.muzzyartist, req.body.username, req.body.date, req.body.time, req.body.idtrack, uuidv4())
        const insertedMuzzy = await colli.insertOne(muzzy)
        const user = await client.db("muzzysystem").collection("users").findOne({
            username: muzzy.username
        })
        const response = await client.db("muzzysystem").collection("users").updateOne({
            uuid: user.uuid
        }, {
            $push: {
                userMuzzys: muzzy.uuid
            }
        })

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
app.post("/allmyMuzzys", async (req, res) => {
    const username = req.body.username;
    const userUuid = req.body.uuid;

    try {
        //connect to the db
        await client.connect();

        //retrieve the muzzys and users collection data

        const user = await client.db("muzzysystem").collection("users").findOne({
            uuid: userUuid,
            username: username
        })

        if (!user["userMuzzys"]) {
            req.status(201).send({
                status: "Succeed",
                message: "User doesn't have any muzzys.",
                data: undefined
            })
        }

        const userMuzzyUuids = user["userMuzzys"];

        const userMuzzys = await client.db("muzzysystem").collection("muzzys").find({
            uuid: {
                $in: userMuzzyUuids
            }
        }).toArray()




        //give your saved muzzys
        res.status(201).send({
            status: "Saved",
            message: "your Muzzys are saved in your mymuzzys section successfully",
            data: userMuzzys

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
// Delete a track muzzy with uuid 
app.delete('/deletemuzzy/:id', async (req, res) => {
    try {
        //connect to the db
        await client.connect();

        //retrieve the users collection data
        const muzzyCollection = client.db('muzzysystem').collection('muzzys');

        //queryforuuid
        const query = {
            uuid: req.params.id
        }

        const muzzyDelete = await muzzyCollection.deleteOne(query)

        res.status(200).send(muzzyDelete);
    } catch (error) {

        res.status(500).send({
            error: 'error',
            value: error.stack
        });
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

        /*  const muzzy = {
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
          }*/
        //retrieve the users collection data
        const colli = client.db('muzzysystem').collection('albummuzzys');
        let muzzy = new Album(req.body.opinion, req.body.score, req.body.muzzyimg, req.body.muzzyalbum, req.body.muzzyartist, req.body.username, req.body.date, req.body.time, req.body.idalbum, uuidv4())
        const insertedMuzzy = await colli.insertOne(muzzy)
        const user = await client.db("muzzysystem").collection("users").findOne({
            username: muzzy.username
        })
        const response = await client.db("muzzysystem").collection("users").updateOne({
            uuid: user.uuid
        }, {
            $push: {
                userMuzzys: muzzy.uuid
            }
        })
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
app.post("/allmyMuzzysalbum", async (req, res) => {
    const username = req.body.username;
    const userUuid = req.body.uuid;

    try {
        //connect to the db
        await client.connect();

        //retrieve the muzzys and users collection data

        const user = await client.db("muzzysystem").collection("users").findOne({
            uuid: userUuid,
            username: username
        })

        if (!user["userMuzzys"]) {
            req.status(201).send({
                status: "Succeed",
                message: "User doesn't have any muzzys.",
                data: undefined
            })
        }

        const userMuzzyUuids = user["userMuzzys"];

        const userMuzzys = await client.db("muzzysystem").collection("albummuzzys").find({
            uuid: {
                $in: userMuzzyUuids
            }
        }).toArray()




        //give your saved muzzys
        res.status(201).send({
            status: "Saved",
            message: "your Muzzys are saved in your mymuzzys section successfully",
            data: userMuzzys

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
// Delete an album muzzy with uuid 
app.delete('/deletemuzzyalbum/:id', async (req, res) => {
    try {
        //connect to the db
        await client.connect();

        //retrieve the users collection data
        const muzzyCollection = client.db('muzzysystem').collection('albummuzzys');

        //queryforuuid
        const query = {
            uuid: req.params.id
        }

        const muzzyDelete = await muzzyCollection.deleteOne(query)

        res.status(200).send(muzzyDelete);
    } catch (error) {

        res.status(500).send({
            error: 'error',
            value: error.stack
        });
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

        /* const muzzy = {
             opinion: req.body.opinion,
             score: req.body.score,
             muzzyimg: req.body.muzzyimg,
             muzzyartist: req.body.muzzyartist,
             username: req.body.username,
             date: req.body.date,
             time: req.body.time,
             idartist: req.body.idartist,
             uuid: uuidv4()
         }*/
        //retrieve the users collection data
        const colli = client.db('muzzysystem').collection('artistmuzzys');
        let muzzy = new Artist(req.body.opinion, req.body.score, req.body.muzzyimg, req.body.muzzyartist, req.body.username, req.body.date, req.body.time, req.body.idartist, uuidv4())

        const insertedMuzzy = await colli.insertOne(muzzy)
        const user = await client.db("muzzysystem").collection("users").findOne({
            username: muzzy.username
        })
        const response = await client.db("muzzysystem").collection("users").updateOne({
            uuid: user.uuid
        }, {
            $push: {
                userMuzzys: muzzy.uuid
            }
        })

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
app.post("/allmyMuzzysartist", async (req, res) => {
    const username = req.body.username;
    const userUuid = req.body.uuid;

    try {
        //connect to the db
        await client.connect();

        //retrieve the muzzys and users collection data

        const user = await client.db("muzzysystem").collection("users").findOne({
            uuid: userUuid,
            username: username
        })

        if (!user["userMuzzys"]) {
            req.status(201).send({
                status: "Succeed",
                message: "User doesn't have any muzzys.",
                data: undefined
            })
        }

        const userMuzzyUuids = user["userMuzzys"];

        const userMuzzys = await client.db("muzzysystem").collection("artistmuzzys").find({
            uuid: {
                $in: userMuzzyUuids
            }
        }).toArray()




        //give your saved muzzys
        res.status(201).send({
            status: "Saved",
            message: "your Muzzys are saved in your mymuzzys section successfully",
            data: userMuzzys

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
// Delete an artist muzzy with uuid 
app.delete('/deletemuzzyartist/:id', async (req, res) => {
    try {
        //connect to the db
        await client.connect();

        //retrieve the users collection data
        const muzzyCollection = client.db('muzzysystem').collection('artistmuzzys');

        //queryforuuid
        const query = {
            uuid: req.params.id
        }

        const muzzyDelete = await muzzyCollection.deleteOne(query)

        res.status(200).send(muzzyDelete);
    } catch (error) {

        res.status(500).send({
            error: 'error',
            value: error.stack
        });
    }
})
//place in mymuzzys section
app.post("/savemyMuzzys", async (req, res) => {
    //check for empty fields
    if (!req.body.username && !req.body.uuid) {
        res.status(401).send({
            status: "Bad request",
            message: "Some fields are missing: uuid, username"
        })
        return
    }

    const username = req.body.username;
    const userUuid = req.body.uuid;


    try {
        //connect to the db
        await client.connect();

        //retrieve the muzzys and users collection data

        const user = await client.db("muzzysystem").collection("users").findOne({
            uuid: userUuid,
            username: username
        })

        if (!user["userMuzzys"]) {
            req.status(201).send({
                status: "Succeed",
                message: "User doesn't have any muzzys.",
                data: undefined
            })
        }

        /*  const userMuzzyUuids = user["userMuzzys"];

          const userMuzzys = await client.db("muzzysystem").collection("muzzys").find({
              uuid: {
                  $in: userMuzzyUuids
              }
          }).toArray()*/

        //send back when muzzy is saved
        res.status(201).send({
            status: "Saved",
            message: "Muzzy has been saved in mymuzzys successfully",
            data: userMuzzys

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
        const colli = client.db('muzzysystem').collection('users');
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
            uuid: uuidv4(),

        }
        //retrieve the users collection data
        const colli = client.db('muzzysystem').collection('users');
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
        const colli = client.db('muzzysystem').collection('users');

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
        const colli = client.db('muzzysystem').collection('users');

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

//CRUD PROFILE SYSTEM
// Get a user with uuid  
app.get('/:id', async (req, res) => {
    try {
        let uuid = req.params.id;
        //connect to the db
        await client.connect()

        //retrieve the users collection data
        const usersCollection = client.db('muzzysystem').collection('users');

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
// Delete a user with uuid 
app.delete('/:id', async (req, res) => {
    try {
        //connect to the db
        await client.connect();

        //retrieve the users collection data
        const usersCollection = client.db('muzzysystem').collection('users');

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
// Update username,email and password 
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
        const usersCollection = client.db('muzzysystem').collection('users');

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