const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

const PORT = 5000;

// MIDDLEWARES //
app.use(cors()); 
app.use(express.json());



// varje http-metod tar in en end-point, samt en async function som tar in ett request- och ett respons-objekt
// *i de fall clienten förväntas skicka med någon input-data - hämtar vi det från (request-objektet).body, och sparar värdena först.
// *i de fall vi behöver info om en specifik bloggposts id som finns i url'en - hämtar vi det från (request-objektet).params.id och sparar värdet först.
// sedan skickar vi en sql-query till databasen (post, put, delete och get(specific) metoderna skickar med de sparade värdena från .body och/eller .params.id där de behövs) och efter queryn har körts klart 
// sparas resultatet.
// datan som ligger i resultatets .rows görs om till json och skickas tillbaka till client-sidan i response-objektet 

// ROUTES //
// Create a blogPost *POST*
app.post("/newblogpost", async(req, res) => {
    try {
        let { title, description } = req.body;
        let newBlogPost = await pool.query(`INSERT INTO blog (title, description, created_date) 
                                            VALUES($1::TEXT, $2::TEXT, $3::TEXT) 
                                            RETURNING *`, 
                                            [title, description, new Date().toUTCString()]);
        res.json(newBlogPost.rows[0]);
    } catch (err) {
        console.error('error post from /newblogpost' + err.message);
    }
});

// Get _all_ blogPosts *GET*
app.get('/blogposts', async(req, res) => {
    try {
        let allBlogPosts = await pool.query(`SELECT * FROM blog`);
        res.json(allBlogPosts.rows);   
    } catch (err) {
        console.error('error get all from /blogposts. ' + err.message);
    }
});

// Get a specific blogPost *GET*
app.get('/blogposts/:id', async(req, res) => {
    try {
        const id = parseInt(req.params.id); 
        let specificBlogPost = await pool.query(`SELECT * FROM blog WHERE id = $1::INT`, [id]);
        res.json(specificBlogPost.rows[0]);
    } catch (err) {
        console.error('error get specific from /blogposts/:id. ' + err.message);
    }
});

// Update a specific blogPost *PUT*
app.put('/blogposts/:id', async(req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { title, description } = req.body;
        const updatedBlogPost = await pool.query(`UPDATE blog 
                                                 SET title = $1::TEXT, description = $2::TEXT
                                                 WHERE id = $3::INT RETURNING *`, [title, description, id]);
        res.json(updatedBlogPost.rows[0]);
    } catch (err) {
        console.error('error put from /blogposts/:id. ' + err.message);
    }
});

// Delete a specific blogPost *DELETE*
app.delete('/blogposts/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const deletedBlogPost = await pool.query(`DELETE FROM blog WHERE id = $1 RETURNING *`, [id]);
        res.json(deletedBlogPost.rows[0]);
    } catch (err) {
        console.error('error delete from /blogposts/:id. ' + err.message);
    }
});



app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}!`);
})