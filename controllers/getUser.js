const connection = require('./dbconnect');

function getUser(loggedInUser) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE name <> + ? ';
        connection.query(sql,loggedInUser, (error, results) => {
            if (error) {
                console.error('Error querying database:', error);
                reject(error);
                return;
            }
            if (results.length > 0){
            const users = results.map(row => ({
                name: row.name,
                email: row.email,
            }));
            resolve(users);
        }
        });
    });
}

module.exports = getUser;