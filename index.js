const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

const PORT = 5000;

// MIDDLEWARES //
app.use(cors());
app.use(express.json());





// ROUTES //
// Create a blogPost *POST*
app.post("/newblogpost", async(req, res) => {
    try {
        let { title, description } = req.body;
        let newBlogPost = await pool.query(`INSERT INTO blog (title, description, created_date) 
                                            VALUES($1::TEXT, $2::TEXT, $3::TEXT) 
                                            RETURNING *`, 
                                            [title, description, new Date().toUTCString()]);
        console.log('POST-request gjord');
        res.json(newBlogPost.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Get _all_ blogPosts *GET*
app.get('/blogposts', async(req, res) => {
    try {
        let allBlogPosts = await pool.query(`SELECT * FROM blog`);
        console.log('GET ALL-request gjord av client')
        res.json(allBlogPosts.rows);   
    } catch (err) {
        console.error(err.message);
    }
});

// Get a blogPost *GET*
app.get('/blogposts/:id', async(req, res) => {
    try {
        const id = parseInt(req.params.id); 
        let specificBlogPost = await pool.query(`SELECT * FROM blog WHERE id = $1::INT`, [id]);
        res.json(specificBlogPost.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Update a blogPost *PUT*
app.put('/blogposts/:id', async(req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { title, description } = req.body;
        const updatedBlogPost = await pool.query(`UPDATE blog 
                                                 SET title = $1::TEXT, description = $2::TEXT
                                                 WHERE id = $3::INT RETURNING *`, [title, description, id]);
        res.json(updatedBlogPost.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Delete a blogPost *DELETE*
app.delete('/blogposts/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const deletedBlogPost = await pool.query(`DELETE FROM blog WHERE id = $1 RETURNING *`, [id]);
        res.json(deletedBlogPost.rows);
    } catch (err) {
        console.error(err.message);
    }
});



app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}!`);
})