const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const app = express();
const axios = require("axios");

app.use(bodyParser.json());
app.use(cors());
const posts = {};

app.get("/posts", (req, res) => {
    res.send(posts);
});

app.post("/posts/create", async (req, res) => {
    const id = randomBytes(4).toString("hex");
    const { title } = req.body;

    posts[id] = {
        id,
        title,
    };

    await axios.post("http://event-bus-srv:4005/events", {
        type: "PostCreated",
        data: {
            title,
            id,
        },
    });

    res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
    console.log("Recieved Events", req.body.type);

    res.send(posts);
});

app.listen(4000, () => {
    console.log("Listening At 4000");
});
