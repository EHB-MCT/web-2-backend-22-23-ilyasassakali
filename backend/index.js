const express = require('express')
const app = express()
const cors = require('cors')

let users = [];

app.use(express.urlencoded({
    extended: false
}));
app.use(cors())
app.use(express.json())

app.post("/register", (req, res) => {


    //check for empty fields
    if (!req.body.username || !req.body.email || !req.body.password) {
        res.status(401).send({
            status: "Bad request",
            message: "Some fields are missing: username, email, password"
        })
    }
    //save to users array
    users.push({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })

    //send back when user is registered
    res.send({
        status: "Saved",
        message: "User has been saved"
    })

})

app.post("/login", (req, res) => {


    //check for empty fields
    if (!req.body.email || !req.body.password) {
        res.status(401).send({
            status: "Bad request",
            message: "Some fields are missing: username, email, password"
        })
    }

    //check for the user in array users
    let user = users.find(element => element.email == req.body.email)

    if (user) {
        //compare passwords
        if (user.password == req.body.password) {
            //password is correct
            res.status(200).send({
                status: "Authentication succesfull!",
                message: "You are logged in!"
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
})


app.listen(3000);
console.log("app running at http://localhost:3000");