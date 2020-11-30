const express = require('express')
const shortid = require('shortid')

const server = express()

//configure our server(plug functionality)
server.use(express.json())

let users = [
    {
        id: shortid.generate(),
        name:'William Fletcher',
        bio:'likes soft hues'
    },
]
console.log(users)
//helper functions to interact with DB
const User = {
    getAll(){
        return users
    },
    getById(id){
        return users.find(u => u.id === id)
    },
    createNew(user){
        //a- make a new user object from client
        const newUser = {id: shortid.generate(), ...user}
        //b add it to the users array
        users.push(newUser)
        //c- return the new user
        return newUser
    },
    delete(id){
        //find the user by that ID
        const user = users.find(u => u.id === id)
        if(user){
            //if user perform the delete and return the deleted
            users = users.filter(u => u.id !== id)
        }
        //otherwise return 'null'
        return user
    },
    update(id, changes){
        const user = users.find(u => u.id === id)
        if(!user){
            return null
        }
        const updatedUser = {id, ...changes}
        users = users.map(u => {
            if(u.id === id) return updatedUser
            return u
        })
        return updatedUser
    }
}

//end points for users
server.get('/api/users', (req, res) => {
    // 1- gather info from the request object
    // 2- interact with db
    const userz = User.getAll()
    // 3- send to client an appropriate response
    res.status(200).json(userz)
})
server.post('/api/users', (req, res) => {
    // 1- gather info from the request object
    const userFromClient = req.body
    // 2- interact with db
    const newUser = User.createNew(userFromClient)
    //3 - send to client res
    res.status(201).json(newUser)
})
server.get('/api/users/:id', (req, res) => {
    const { id } = req.params
    const user = User.getById(id)
    if(user){
        res.status(200).json(user)
    }else{
        res.status(404).json({message:'user not found with id' + id})
    }
})
server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params
    const deletedUser = User.delete(id)
    if(deletedUser){
        res.status(200)/json(deletedUser)
    }else{
        res.status(404).json({message:'user cannot be deleted :P'})
    }
})
server.put('/api/users/:id', (req, res) => {
    const changes = req.body
    const { id } = req.params
    const updatedUser = User.update(id, changes)
    if(updatedUser){
        res.status(200).json(updatedUser)
    }else{
        res.status(404).json({message:'user not found with id' + id})
    }
})

//catch-all endpoint
server.use('*', (req, res) => {
    res.status(404).json({message:'error404'})
})

server.listen(5000, () => {
    console.log('server is listening on port 5000')
})