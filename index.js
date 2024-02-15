const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3000

const database = require('./db/database')
const time = require('./db/time')
const admin = require('./routes/admin')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use('/css/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))

app.use('/admin', admin)

app.get('/', (req, res) => {
    const gifts = database.get('gifts')
    const props = {
        nightly: {
            cc: { num: 0, amount: 0},
            pledge: { num: 0, amount: 0 },
            callers: []
        },
        weekly: {
            cc: { num: 0, amount: 0 },
            pledge: { num: 0, amount: 0 },
            callers: []
        }
    }

    for (let gift of gifts) {
        if (gift.date < time.sunday().valueOf())
            return // last week
        if (gift.date > time.today().valueOf()) {
            // today, add to nightly
            if (gift.method === 'cc') {
                props.nightly.cc.num += 1
                props.nightly.cc.amount += gift.amount
                let caller = props.nightly.callers.filter(c => c.name === gift.caller)
                if (caller.length === 0) {
                    props.nightly.callers.push({
                        name: gift.caller,
                        num: 1,
                        amount: gift.amount
                    })
                } else {
                    caller = caller[0]
                    caller.num += 1
                    caller.amount += gift.amount
                }
            } else {
                props.nightly.pledge.num += 1
                props.nightly.pledge.amount += gift.amount
            }
        }
        // weekly, update in every case
        if (gift.method === 'cc') {
            props.weekly.cc.num += 1
            props.weekly.cc.amount += gift.amount
            let caller = props.weekly.callers.filter(c => c.name === gift.caller)
            if (caller.length === 0) {
                props.weekly.callers.push({
                    name: gift.caller,
                    num: 1,
                    amount: gift.amount
                })
            } else {
                caller = caller[0]
                caller.num += 1
                caller.amount += gift.amount
            }
        } else {
            props.weekly.pledge.num += 1
            props.weekly.pledge.amount += gift.amount
        }
    }

    props.nightly.callers.sort((a, b) => b.amount - a.amount)
    props.weekly.callers.sort((a, b) => b.amount - a.amount)
    
    res.render('index', props)
})

app.listen(PORT, () => console.log(`listening on ${PORT}`))