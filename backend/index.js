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

app.listen(3000);
console.log("app running at http://localhost:3000");