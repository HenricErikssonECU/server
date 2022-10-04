const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

const PORT = 5000;

// MIDDLEWARES //
app.use(cors());
app.use(express.json());





// ROUTES //
// create a blogPost
app.post("/newblogpost", async(req, res) => {
    try {
        let { title, description } = req.body;
        let newBlogPost = await pool.query(`INSERT INTO blog (title, description) 
                                            VALUES($1, $2) 
                                            RETURNING *`, 
                                            [title, description]);
        console.log('POST-request gjord');
        res.json(newBlogPost.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get all blogPosts
app.get('/blogposts', async(req, res) => {
    try {
        let allBlogPosts = await pool.query(`SELECT * FROM blog`);
        console.log('GET ALL-request gjord av client')
        res.json(allBlogPosts.rows);   
    } catch (err) {
        console.error(err.message);
    }
});

// get a blogPost
app.get('/blogposts/:id', async(req, res) => {
    try {
        const { id } = req.params; // hämtar req.params.id och sparar värdet i variabeln "id"
        let specificBlogPost = await pool.query(`SELECT * FROM blog WHERE id = $1`, [id]);
        res.json(specificBlogPost.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// update a blogPost
app.put('/blogposts/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const updatedBlogPost = await pool.query(`UPDATE blog 
                                                 SET title = $1, description = $2
                                                 WHERE id = $3 RETURNING *`, [title, description, id]);
        res.json(updatedBlogPost.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// delete a blogPost
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