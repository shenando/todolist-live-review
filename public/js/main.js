const deleteBtn = document.querySelectorAll('.del') //bring in delete button
const todoItem = document.querySelectorAll('.todoItem span') //bring to do button
const todoComplete = document.querySelectorAll('.todoItem span.completed') //bring in any button that has a class of completed

Array.from(deleteBtn).forEach((el)=>{ //Add an event listener to every delete button
    el.addEventListener('click', deleteTodo) //it will run th deleteTodo function
})

Array.from(todoItem).forEach((el)=>{ //Add an event listener to every to do item
    el.addEventListener('click', markComplete) //it will run the markComplete function
})

Array.from(todoComplete).forEach((el)=>{ //add event listener to every to do item with the complete task
    el.addEventListener('click', undo) //it will run the undo function
})

async function deleteTodo(){ //async function
    const todoText = this.parentNode.childNodes[1].innerText //bring in the todo text from the database
    try{ //the first thing the code will try to do
        const response = await fetch('deleteTodo', { //await the response from the database and run the delete method that's in server.js
            method: 'delete', //the method that's being run
            headers: {'Content-type': 'application/json'}, //the type of data in the object
            body: JSON.stringify({ //the body of the data in the data base in json form
                'rainbowUnicorn': todoText //the todo that was brought in and will be deleted 
            })
        })
        const data = await response.json() //the data that is brought in
        console.log(data)
        location.reload() //refresh the page
    }catch(err){
        console.log(err) //catches any errors
    }
}

async function markComplete(){ //async function to mark completed items 
    const todoText = this.parentNode.childNodes[1].innerText //bring in the specific item 
    try{ //first thing the block of code will try
        const response = await fetch('markComplete', { //wait for the database to return this info and then it will run the method from server.js
            method: 'put', //the type of method - it will be putting a mark on the todo
            headers: {'Content-type': 'application/json'}, //type of data
            body: JSON.stringify({ //the data itself in json form
                'rainbowUnicorn': todoText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload() //refresh page
    }catch(err){
        console.log(err) //catches any errors and reports what kind
    }
}

async function undo(){ //async to undo the mark as complete action
    const todoText = this.parentNode.childNodes[1].innerText //taking in the specific data
    try{
        const response = await fetch('undo', { //waits for data from database, then takes in action from server js
            method: 'put', //type of method, it will be un putting the styling
            headers: {'Content-type': 'application/json'}, //type of data
            body: JSON.stringify({
                'rainbowUnicorn': todoText //data itself
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}
