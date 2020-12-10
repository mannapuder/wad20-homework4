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
    //const id = authorize vms
    // Endpoint to create a new post
    /*
    const message = {
        id: 1,
        text: request.body.text,
        type: 'video',
        url: '',
    };
    const date = Date.parse(request.body.date);
    */
    
    console.log(request.body);

    return response.send("Post request");
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
