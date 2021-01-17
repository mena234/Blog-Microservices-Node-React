import React from "react";

export default ({ comments }) => {
    console.log(comments);

    if (comments != undefined) {
        const rendererComments = comments.map((comment) => {
            let content;

            if (comment.status === "rejected") {
                content = "This Comment Had Been Rejected";
            } else if (comment.status === "pending") {
                content = "This Comment is Awaiting Moderation";
            } else if (comment.status === "approved") {
                content = comment.content;
            }
            return <li key="comment.id">{content}</li>;
        });

        return <ul>{rendererComments}</ul>;
    } else {
        return null;
    }
};
