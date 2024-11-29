const express = require('express')
const fs = require('fs')
const users = require("./MOCK_DATA.json")
const app = express()

app.use(express.urlencoded({extended:false}))

app.get('/',(req,res)=>{
    return res.send("Welcome to Home Page")
})

app.get('/users',(req,res)=>{
    const allusers = `<ul>
    ${users.map(user=>{
        return `<li>${user.first_name} ${user.last_name}</li>`
    }).join("")}
    </ul>`

    return res.status(200).send(allusers)
})

app.get('/users/:id',(req,res)=>{
    const id = Number(req.params.id)
    const find = users.find(user=>{
        if(user.id===id){
            return user
        }
    })
    console.log(find)
    return res.status(200).send(`${find.first_name} ${find.last_name}`)
})

app.get('/api/users',(req,res)=>{
    return res.status(200).json(users)
})

app.route("/api/users/:id").get((req,res)=>{
    const id = Number(req.params.id)
    let find = users.find((user)=>{
        if(user.id===id){
            return user
        }
    })
    if(!find){
        return res.status(400).send("User Not Found")
    }
    return res.status(200).send(find)
}).patch((req,res)=>{
    const id = Number(req.params.id)
    const body = req.body
    let find = users.find(user=>{
        if(user.id===id){
            return user
        }
    })
    if(!find){
        return res.status(400).send("User not Found")
    }
    const updatedUser = {...find,...body}
    // const index = users.findIndex(user=>{
    //     if(user.id===id){
    //         return user
    //     }
    // })
    users[find.id - 1] = updatedUser
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err)=>{
        if(err){
            return res.status(201).json("Error Occured")
        }
        return res.status(200).json({status:"Success",updatedUser})
    })
}).delete((req,res)=>{
    const id = req.params.id
    if(id<=0){
        return res.status(400).send("Cannot delete with the negative index")
    }
    if(id>users.length){
        return res.status(400).send("A person with that id don t exist")
    }
    const find = users.findIndex(user=>{
        if(user.id===id){
            return user
        }
    })
    if(!find){
        return res.send("User not exist")
    }
    users.splice(find,1)
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err)=>{
        if(err){
            return res.status(400).send("Some error occured")
        }
        return res.status(200).json({status:"Deleted Successfully"})
    })
})

app.post("/api/users",(req,res)=>{
    const body = req.body
    if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title){
        return res.json({err:"Information Missing. All fields are Required"})
    }
    users.push({id:users.length + 1, ...body})
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err)=>{
        if(err){
            return res.status(400).json({err:"SOME ERROR OCCURED"})
        }
        return res.status(200).json({status:"User Created Successfully"})
    })
})

app.listen(8000,'localhost',()=>{
    console.log("Server Started")
})