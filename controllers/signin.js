const db = require("./dbconnect")

const loginController = {

    getSignin: (req, res) => {
        res.render('signin');
    },

    postSignin: async (req, res) => {
        try {
            const {  fullName, password } = req.body;
            const sql = 'SELECT * FROM users WHERE name = ? AND password = ?';
            const values = [fullName, password];
            let mistakes = {};
            db.query(sql, values, (err, results) => {
              if (err) {
                console.err('Error querying MySQL:', err);
                mistakes.field = "Please re-enter the info correctly!";
                res.render('signin', { err: mistakes });
              }
            
              if (results.length > 0) {
                res.cookie("username", fullName, { maxAge: 3600000 });
                res.redirect('inboxpage');
                
              } else {
                mistakes.field = "Please re-enter the info correctly!";
                res.render('signin', {err: mistakes,
                params: req.body});

              }

            });
        } catch (error) {
             console.error('Error during login:', error);
        }
    },
};

module.exports = loginController;
