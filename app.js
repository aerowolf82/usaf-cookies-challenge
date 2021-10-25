const express = require('express')
const morgan = require('morgan');
const app = express()
const students = require('./students.json')
const port = 3000

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))

app.get('/students', (req, res) => {
    /* Refactor to GET a user by their name using query params *IF* it's passed.
    If no name is passed in query params, should still behave as it currently does */
    if(req.query.name){
        res.send(students.filter(student => student.name.includes(req.query.name)));
    } else {
        res.send(students)
    }
})

app.get('/students/:id', (req, res) => {
    /* GET a user by their id */
    res.send(students[req.params.id-1])
})

app.get('/grades/:id', (req, res) => {
    /* GET a user by their id */
    res.send(students[req.params.id-1].grades)
})


app.post('/grades', (req, res) => {
    let result;
    let id;
    let grade;
    console.log(req.body)
    if(req.body.id > 0 && req.body.grades.length !== []){
        grade = req.body.grades;
        id = req.body.id;
    }

    if (id && grade) {
        let tempGrades =students[id-1].grades; 
        tempGrades = {...tempGrades[0],...grade[0]};
        students[id-1].grades = tempGrades;
        console.log(students[id-1].grades)
        result = {status: "Success", message: "The grade was successfully added."}
    } else {
        result = {status: "Failed", message: "The grade was not added."}
        res.status(400)
    }
    res.json(result)
    /* POST user data using the request body */
})



app.post('/register', (req, res) => {
    let result;
    let name
    let email;
    if(req.body.firstName !== '' && req.body.lastName !== '' && req.body.email !== ""){
        name = [req.body.firstName,req.body.lastName];
        email = req.body.email;
    }

    if (name && email) {
        let newUserId = students.length + 1
        students.push({
            id: newUserId,
            name: name,
            email: email,
            grades: req.body.grades
        })
        //reviews.push({ email: review.email, movieId: review.movieId, reviewTitle: review.reviewTitle, reviewText: review.reviewText })
        result = {status: "Success", message: "The user was successfully added."}
    } else {
        result = {status: "Failed", message: "The user was not added."}
        res.status(400)
    }
    res.json(result)
    /* POST user data using the request body */
})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))