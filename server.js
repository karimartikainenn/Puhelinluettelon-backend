const http = require('http')

let numbers = [
    {
        id: 1,
        name: "Kari Martikainen",
        number: "0452350455",
    },
    {
        id: 2,
        name: "Made Im-ari",
        number: "0491294900",
    },
    {
        id: 3,
        name: "Juha Martikainen",
        number: "0491281199",
    }
]
const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(numbers))
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)