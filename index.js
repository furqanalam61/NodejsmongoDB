const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myfirstmongodb', {useNewUrlParser: true});
//mongoose.connect('mongodb+srv://muzammal6313:ashrafi9885@cluster0-4hc2l.mongodb.net/studentDB?retryWrites=true&w=majority',
//                 {useNewUrlParser: true}, ()=>console.log('connected'));

const Student = mongoose.model('Student', {
    name: String,
    student_id: Number,
    email: String,
    //password: String,
    //date_added: Date
});

const bodyParser = require('body-parser');
const express = require('express');
const app = express();
//mongoose.connect('mongodb://localhost:27017/myfirstmongodb', {useNewUrlParser: true, useUnifiedTopology:true});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/* app.post('/signup', async (req,res) => {
    const body = req.body;
    console.log('req.body', body);
    res.send({
        message: 'Success'
    });
}); */

app.post('/Signup', async (req, res) => {
    const body = req.body;
    console.log('req.body', body)
      try{
    const student = new Student(body);
    
    const result = await student.save();
    res.send({
      message: 'Student signup successful'
    });
    
      }
      catch(ex){
        console.log('ex',ex);
        res.send({message: 'Error'}).status(401);
      }
});

app.post('/login',  async (req, res) => {
    const body = req.body;
    console.log('req.body', body);

    const email = body.email;

    // lets check if email exists

    const result = await Student.findOne({"email":  email});
    if(!result) // this means result is null
    {
      res.status(401).send({
        Error: 'This user doesnot exists. Please signup first'
       });
    }
    else{
      // email did exist
      // so lets match password

      if(body.password === result.password){

        // great, allow this user access

        console.log('match');

        res.send({message: 'Successfully Logged in'});
      }

        else{

          console.log('password doesnot match');

          res.status(401).send({message: 'Wrong email or Password'});
        }


    }

  });

  app.patch('/:updateStudent', async (req, res) => {
    try {
        const student = new Student(req.body);
        console.log('student', student);
        const result = await student.updateOne(
            {_id: req.params.updateStudent},
            {$set: {name: req.body.name}}
        );
        if (result) {
            res.send({
                massage: "Student Update Successfully"
            });
        }
    } catch (ex) {
        console.log('ex', ex);
        res.send({message: 'Error'}).status(401);
    }
});

app.post('/deleteStudent', async (req, res) => {
    try {
        const student = new Student(req.body);
        const result = await student.delete();
        if (result) {
            res.send({
                massage: 'Student deleted Successfully.'
            });
        }
    } catch (ex) {
        console.log('ex', ex);
        res.send({message: 'Error'}).status(401);
    }
});

/* const http = require('http');

const server = http.createServer();

server.on('request',(request,response) => {
    response.writeHead(200,{'Content-Type':'text/plain'});
    response.write('Hello World Welcome to my Node.js app without Express.js framework');
    response.end();
});

server.listen(3000,() => {
    console.log('Node server created at port 3000');
});  */

//const express = require('express');
//const app = express();

app.get('/', (req, res) => {
    res.send('Hola World. Welcome to my Node.js app using Express.js framework');
});

app.get('/students', (req, res) => {
    //res.send('Hola Students');
    const listOfStudents = [
        {id: '1', name: 'Furqan'},
        {id: '2', name: 'Alam'},
        {id: '3', name: 'Hashmi'}
    ]
    res.send(listOfStudents);
    // listOfStudents = get students from mysql/mongodb/whatever database
});

app.get('/getStudents', async (req, res) => {

    const allStudents = await Student.find();
    console.log('allStudents', allStudents);
  
    res.send(allStudents);
  });

app.get('*',(req,res) => {
    res.send('Page Does not exists');
});

app.listen(3000, () => {
    console.log('Express application running on localhost:3000');
});
