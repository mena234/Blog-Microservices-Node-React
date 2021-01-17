const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());

app.post("/events", async (req, res) => {
    const { type, data } = req.body;
    if (type === "CommentCreated") {
        console.log("CommentCreated")
        const status = data.content.includes('orange')
            ? "rejected"
            : "approved";

        const dataResult = {
            ...data,
            status
        }
        console.log(dataResult);
        await axios.post("http://event-bus-srv:4005/events", {
            type: "CommentModerated",
            data: dataResult
        });
    }

    res.send({});
});

app.listen(4003, () => {
    console.log("Listening At 4003");
});
