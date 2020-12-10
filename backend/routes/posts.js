const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const PostModel = require('../models/PostModel');


router.get('/', authorize, (request, response) => {

    // Endpoint to get posts of people that currently logged in user follows or their own posts

    PostModel.getAllForUser(request.currentUser.id, (postIds) => {

        if (postIds.length) {
            PostModel.getByIds(postIds, request.currentUser.id, (posts) => {
                response.status(201).json(posts)
            });
            return;
        }
        response.json([])

    })

});

router.post('/', authorize,  (request, response) => {

    // Endpoint to create a new post
    let form = {
        text: {required: true},
        media: {
            url: null,
            type: null
            }
    };

    const fieldMissing = {
        code: null,
        message: 'Please provide %s field'
    };

    if (!request.body["text"]) {

        fieldMissing.code = form.text;
        fieldMissing.message = fieldMissing.message.replace('%s', "text");

        response.json(fieldMissing, 400);
        return;
    }

    if (!request.body.media.url !== !request.body.media.type) {

        fieldMissing.code = "media";
        fieldMissing.message = fieldMissing.message.replace('%s', "media");

        response.json(fieldMissing, 400);
        return;
    }

    let params = {
        userId: request.currentUser.id,
        text: request.body.text,
        media: {
            url: request.body.media.url,
            type: request.body.media.type
        }
    };

    PostModel.create(params, () => {
        response.status(201).json()
    });

});


router.put('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to like a post

    PostModel.like(request.currentUser.id, request.params.postId, () => {
        response.status(201)});

    response.json([]);
});

router.delete('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to unlike a post

    PostModel.unlike(request.currentUser.id, request.params.postId, () => {
        response.status(201)});

    response.json([]);
});


module.exports = router;
