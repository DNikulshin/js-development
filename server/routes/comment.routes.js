const express = require('express')
const auth = require('../middleware/auth.middleware')
const router = express.Router({mergeParams: true})

router
    .route('/')
    .get(auth, async (req, res) => {
        try {
            const {orderBy, equalTo} = req.body
            const list = await Comment.find({[orderBy]: equalTo})
            res.send(list)
        } catch (e) {
            res.status(500).json({
                message: 'На сервере произошла ошибка. Попробуйте позже'
            })
        }
    })
    .post(auth, async (req, res) => {
        try {
            const newComment = await Comment.create({
                ...req.body,
                userId: req.user._id
            })
            res.status(201).save(newComment)
        } catch (e) {
            res.status(500).json({
                message: 'На сервере произошла ошибка. Попробуйте позже'
            })
        }
    })

router.delete('/:commentId', auth, async (req, res) => {
    try {
        const {commentId} = req.params
        const removedComment = await Comment.findById(commentId)
        if (removedComment.user._id.toString() === req.user._id) {
            await removedComment.remove()
            return res.send(null)
        }else {
            res.status(401).json({message: 'Unauthorized'})
        }
    } catch (e) {
        res.status(500).json({
            message: 'На сервере произошла ошибка. Попробуйте позже'
        })
    }
})

module.exports = router
