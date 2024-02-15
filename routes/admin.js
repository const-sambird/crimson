const express = require('express')
const crypto = require('crypto')
const router = express.Router()
const database = require('../db/database')
const time = require('../db/time')
const callers = require('../callers.json')

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.get('/', (req, res) => {
    const gifts = database.get('gifts').sort((a, b) => b.date - a.date)
    
    res.render('admin', { gifts: gifts, callers: callers })
})

router.post('/gift', (req, res) => {
    const caller = req.body['caller']
    const method = req.body['type']
    const amount = req.body['amount']

    if (!caller || !method || !amount)
        return res.sendStatus(400)

    const uid = crypto.randomBytes(16).toString('hex')
    const date = new Date().valueOf()
    const gifts = database.get('gifts')

    gifts.push({ caller: caller, method: method, amount: Number(amount), date: date, id: uid })

    database.set('gifts', gifts)

    res.redirect('/admin')
})

router.get('/clear', (req, res) => {
    database.set('gifts', [])
    return res.redirect('/admin')
})

router.get('/delete/:id', (req, res) => {
    const toDelete = req.params.id
    
    if (!toDelete)
        return res.status(400).send('no id of gift to delete')

    const gifts = database.get('gifts')
    const matches = gifts.filter(gift => gift.id === toDelete)

    if (matches.length === 0)
        return res.sendStatus(404)

    database.set('gifts', gifts.filter(gift => gift.id !== toDelete))

    return res.redirect('/admin')
})

module.exports = router