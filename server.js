let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// homepage route
app.get('/', (req, res) => {
    return res.send({ 
        written_by: 'Suhaimee Yakoh',
        published_on: 'https://www.facebook.com/suraimee.yk/'
    })
})

// connection to mysql database
let dbCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_api' //ชื่อ data base
})
dbCon.connect();

// retrieve all books 
// GET
app.get('/books', (req, res) => {
    dbCon.query('SELECT * FROM books', (error, results, fields) => {
        if (error) throw error;

        let message = ""
        if (results === undefined || results.length == 0) {
            message = "Books table is empty";
        } else {
            message = "Successfully retrieved all books";
        }
        return res.send({ error: false, data: results, message: message});
    })
})

// add a new book
//POST
app.post('/book', (req, res) => {
    let name = req.body.name;
    let author = req.body.author;

    // validation
    if (!name || !author) {
        return res.status(400).send({ error: true, message: "Please provide book name and author."});
    } else {
        dbCon.query('INSERT INTO books (name, author) VALUES(?, ?)', [name, author], (error, results, fields) => {
            if (error) throw error;
            return res.send({ error: false, data: results, message: "Book successfully added"})
        })
    }
});

// retrieve book by id 
//GET
app.get('/book/:id', (req, res) => {
    let id = req.params.id;

    if (!id) {
        return res.status(400).send({ error: true, message: "Please provide book id"});
    } else {
        dbCon.query("SELECT * FROM books WHERE id = ?", id, (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results === undefined || results.length == 0) {
                message = "Book not found";
            } else {
                message = "Successfully retrieved book data";
            }

            return res.send({ error: false, data: results[0], message: message })
        })
    }
})

// update book with id 
//PUT
app.put('/book', (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let author = req.body.author;

    // validation
    if (!id || !name || !author) {
        return res.status(400).send({ error: true, message: 'Please provide book id, name and author'});
    } else {
        dbCon.query('UPDATE books SET name = ?, author = ? WHERE id = ?', [name, author, id], (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results.changedRows === 0) {
                message = "Book not found or data are same";
            } else {
                message = "Book successfully updated";
            }

            return res.send({ error: false, data: results, message: message })
        })
    }
})

// delete book by id
// Delete
app.delete('/book', (req, res) => {
    let id = req.body.id;

    if (!id) {
        return res.status(400).send({ error: true, message: "Please provide book id"});
    } else {
        dbCon.query('DELETE FROM books WHERE id = ?', [id], (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results.affectedRows === 0) {
                message = "Book not found";
            } else {
                message = "Book successfully deleted";
            }

            return res.send({ error: false, data: results, message: message })
        })
    }
})

app.listen(3000, () => {
    console.log('Node App is running on port 3000');
})

module.exports = app;
