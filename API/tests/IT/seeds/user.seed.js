const uuid = require('uuid');

module.exports = [
    {
        email: "alice@test.com",
        name: "Alice",
        balance: 0,
        favorites: []
    },
    {
        email: "bob@test.com",
        name: "Bob",
        balance: 100,
        favorites: [uuid.v1(), uuid.v1(), uuid.v1()]
    },
    {
        email: "chen@test.com",
        name: "Chen",
        balance: 200,
        favorites: [uuid.v1()]
    }
];