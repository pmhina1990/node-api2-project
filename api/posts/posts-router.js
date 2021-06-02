
const Posts = require('./posts-model') //import posts model
const express = require('express');
const router = express.Router();




router.get('/', (req, res) => {
    Posts.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(error => {
            res.status(500).json({message: "The posts information could not be retrieved"})
        })
})


router.get('/:id', (req, res) => {
    const {id} = req.params;
    Posts.findById(id)
        .then(post => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({message: "The post with the specified ID does not exist"})
            }
        })
        .catch(error => {
            res.status(500).json({message: "The post information could not be retrieved"})
        })
})


router.post('/', (req, res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({message: 'Please provide title and contents for the post'})
    }
    else {
        Posts.insert(req.body)
            .then(newPost => {
                    Posts.findById(newPost.id)
                        .then(post => {
                            res.status(201).json(post)
                        })
                        .catch(error => {
                            res.status(500).json({message: "There was an error while saving the post to the database"})
                        })
            })
            .catch(error => {
                res.status(500).json({message: 'There was an error while saving the post to the database'})
            })
    }
})


router.put('/:id', (req, res) => {
    const {id} = req.params;
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({message: 'Please provide title and contents for the post'})
    }
    else { 
        Posts.update(id, req.body)
            .then(updated => {
                if (updated) {
                    Posts.findById(id)
                        .then(post => {
                            res.status(200).json(post)
                        })
                        .catch(error => {
                            res.status(500).json({message: "The post information could not be modified"})
                        })
                } else {
                    res.status(404).json({message: "The post with the specified ID does not exist"})
                }
            })
            .catch(error => {
                res.status(500).json({message: "The post information could not be modified"})
            })
    }
})


router.delete('/:id', (req, res) => {
    const {id} = req.params;
    let postToDelete = null;
    Posts.findById(id)
        .then(post => {
            if (post) {
                postToDelete = post
                Posts.remove(id)
                    .then(deleted => {
                        res.status(200).json(postToDelete)
                    })
                    .catch(error => {
                        res.status(500).json({message: "The post could not be removed"})
                    })
            } else {
                res.status(404).json({message: "The post with the specified ID does not exist"})
            }
        })
        .catch(error => {
            res.status(500).json({message: "The post could not be removed"})
        })
})


router.get('/:id/comments', (req, res) => {
    const {id} = req.params;
    Posts.findById(id)
        .then(post => {
            if (post) {
                Posts.findPostComments(id)
                    .then(comments => {
                        if (comments.length !== 0) {
                            res.status(200).json(comments)
                        } else if (comments.length === 0){
                            res.status(404).json({message: "This post has no comments"})
                        }
                    })
                    .catch(error => {
                        res.status(500).json({message: "The comments information could not be retrieved."})
                    })
            } else {
                res.status(404).json({message: "The post with the specified ID does not exist"})
            }
        })
        .catch(error => {
            res.status(500).json({message: "The comments information could not be retrieved."})
        })
})


module.exports = router;