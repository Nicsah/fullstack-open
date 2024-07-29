const express = require('express')
const app = express()
app.use(express.static('dist'))
var morgan = require('morgan')
const cors = require('cors')
app.use(cors())
app.use(express.json())

let numbers =[
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    },
]


morgan.token('body', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons',(request,response) => {
    response.json(numbers)
})

app.get('/info',(request,response) => {
    response.send(
        `<div>Phonebook has info for ${numbers.length} people</div>
        <div>${new Date()}</div>`
    )
})

app.get('/api/persons/:id',(request,response) => {
    const id = request.params.id
    const person = numbers.find(person => person.id === id)
    if (person) {
        response.json(person)
        } else {
            response.status(404).end()
            }
})

app.delete('/api/persons/:id',(request,response) => {
    const id = request.params.id
    numbers = numbers.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons',(request,response) => {
    const body = request.body

    if (!body.name || !body.number ) {
        return response.status(400).json ({
            error: 'content missing'
       })
    }else if (numbers.find(person => person.name === body.name)){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const newPerson = {
        "id": Math.floor(Math.random() * 1000),
        "name": body.name,
        "number": body.number
    }
    
    numbers = numbers.concat(newPerson)
    response.json(newPerson)

})
        

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})