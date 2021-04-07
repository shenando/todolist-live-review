const express = require('express') //bring in express
const app = express() //bring in express
const MongoClient = require('mongodb').MongoClient //bring in mongodb
const PORT = 2121 //set the port
require('dotenv').config() //set up dotenv to keep info private

let db, //set the database name and string, the connection to the database is hidden in the env file
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true}) //connection to the mongo atlas
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`) //console logs to let you know you've connected to the database
        db = client.db(dbName) //the database & name
    })
    .catch(err =>{ //catches any errors
        console.log(err) //reports what the error is
    })

app.set('view engine', 'ejs') //middleware, let's you use ejs for html
app.use(express.static('public')) //middleware, brings in the public files
app.use(express.urlencoded({ extended: true })) //middleware needed for url encoded
app.use(express.json()) //middleware needed for json

app.get('/', async (req,res)=>{ //the get function, gets the info on the page and refreshes the page. It's an async that takes in two properties
    const todoItems = await db.collection('todos').find().toArray() //the first item it gets, this is the actual to do item, found from database, put into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //constant that notes that the completed item has not been met yet so the counter is at 0
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft}) //renders the info on index.ejs
})

app.post('/createTodo', (req, res)=>{ //a post method, and the name of the location
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false}) //goes into the array of todos and adds a new one that the user enters
    .then(result =>{
        console.log('Todo has been added!') //let's you know it worked
        res.redirect('/') //refreshes the page
    })
})

app.put('/markComplete', (req, res)=>{ //a put method and the name of the location
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ //it goes into the data and grabs the item that was clicked on
        $set: { //changes something
            completed: true //changes the completed status to true, this will trigger an added class and a style change
        }
    })
    .then(result =>{
        console.log('Marked Complete') //lets you know it worked
        res.json('Marked Complete')
    })
})

app.put('/undo', (req, res)=>{ //another put request and it's location
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ //itentifies the thing the user clicked on
        $set: {
            completed: false //changes to completed status back to false, this will remove the class and style change
        }
    })
    .then(result =>{
        console.log('Marked Complete') //lets you know it worked
        res.json('Marked Complete')
    })
})

app.delete('/deleteTodo', (req, res)=>{ //a delete method and it's location
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn}) //the item the user clicked on that will be deleted
    .then(result =>{
        console.log('Deleted Todo') //lets you know it worked
        res.json('Deleted It')
    })
    .catch( err => console.log(err)) //lets you know about any errors
})
 
app.listen(process.env.PORT || PORT, ()=>{ //the port the info will be displated on, i'm still not sure how to deploy to heroku fully!
    console.log('Server is running, you better catch it!') //let's you know what port is running the info above
})    
