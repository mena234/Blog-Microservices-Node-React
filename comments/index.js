const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const axios = require('axios');

app.use(bodyParser.json());
app.use(cors());
const commentsByPostId = {

}

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
})

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const postId = req.params.id;
    const { content } = req.body;

    const comments = commentsByPostId[postId] || [];

    comments.push({
        id: commentId,
        content,
        postId,
        status: 'pending'
    });
    commentsByPostId[postId] = comments;

    await axios.post('http://event-bus-srv:4005/events', {
        type: "CommentCreated",
        data: {
            id: commentId,
            content,
            postId,
            status: 'pending'
        }
    })

    res.status(201).send(comments);
})

app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    if (type === 'CommentModerated') {
        const { id, postId, status } = data;
        const comments = commentsByPostId[postId];

        const comment = comments.find(comment => comment.id === id);
        
        comment.status = status;

        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: { ...comment }
        })
    }
    res.send({});
})

app.listen(4001, () => {
    console.log("Listening At 4001")
})