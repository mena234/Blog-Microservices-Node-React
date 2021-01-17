const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require('axios');
const app = express();

app.use(bodyParser.json());

app.use(cors());

const handleError = (type, data) => {
    if (type === "PostCreated") {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    } else if (type === "CommentCreated") {
        console.log('CommentCreated');
        const { id, content, postId, status } = data;
        const post = posts[postId];
        post.comments.push({ id, content, status, postId });
    } else if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        const comments = post.comments;
        const comment = comments.find(comment => comment.id === id);
        comment.status = status;
        comment.content = content;
    }
}

const posts = {};

app.get("/posts", (req, res) => {
    res.send(posts);
});

app.post("/events", (req, res) => {
    const { type, data } = req.body;

    handleError(type, data);

    res.send({});
});

app.listen(4002, async () => {
    console.log("Listen to 4002");

    const result = await axios.get('http://event-bus-srv:4005/events');

    console.log(result.data);

    result.data.forEach(event => handleError(event.type, event.data));
});
