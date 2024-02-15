/*
 * hahahahhaa you fools, you complete
 * imbeciles, you absolute buffoons,
 * you have fallen into my trap. this
 * is not a database at all, despite the
 * pretensions of the file and directory
 * name! this is a glorified disk i/o
 * interface!
 * 
 * this place is not a place of honour.
 * no highly esteemed deed is commemorated here.
 * nothing valued is here.
 * what is here was dangerous and repulsive to us.
 * this message is a warning about danger.
 */
const fs = require('fs')
const path = require('path')
const database = {}
const DB_FILE = path.join(__dirname, 'database.json')

database._read = function () {
    const text = fs.readFileSync(DB_FILE)
    return JSON.parse(text)
}

database._write = function (data) {
    const text = JSON.stringify(data)
    fs.writeFileSync(DB_FILE, text)
}

database.set = function (key, value) {
    if (key === '__proto__') return

    const data = this._read()
    data[key] = value
    this._write(data)
}

database.get = function (key) {
    const data = this._read()
    return data[key]
}

database.has = function (key) {
    const data = this._read()
    return Object.keys(data).includes(key)
}

module.exports = database
