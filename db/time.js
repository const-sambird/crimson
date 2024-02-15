const time = {}

time.today = function () {
    let d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
}

time.sunday = function () {
    let today = this.today()
    let sunday = new Date(today)
    sunday.setDate(sunday.getDate() - sunday.getDay())
    return sunday
}

module.exports = time
