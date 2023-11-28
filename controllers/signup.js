
const connection = require("./dbconnect")
const authController = {

    getSignup: (req, res) => {
        res.render('signup');
    },

    postSignup: async (req, res) => {
        try {
            
            const { fullName, email, password , reEnterPassword } = req.body;
            let mistakes = {};

            connection.query("SELECT * FROM users WHERE email = ?", email, (err, results) => {
                if (err) {
                    console.log('Error querying MySQL:', err);
                    return;
                }

                if (results.length > 0) {
                    mistakes.email = "This email is already used!";
                    console.log('Used mail');
                }
                if ( password.length < 6) {
                    mistakes.password = "Please enter a valid password!";
                }
                
                if (reEnterPassword !== password) {
                    mistakes.reEnterPassword = "Please re-enter the password correctly!";
                }
                if (Object.keys(mistakes).length === 0) {
                    connection.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [fullName, email, password], (err, results) => {
                        if (err) {
                            console.error('Error during signup:', err);
                        } else {
                            res.redirect('/');
                        }
                    });
                } else {
                    res.render('signup', {
                        err: mistakes,
                        params: req.body
                    });
                }
            });
        } catch (error) {           
            console.log('Error during signup:', error);
            res.render('signup', {
                err: { general: "Error during signup. Please try again later." },
                params: req.body
            });
        }
    },
};

module.exports = authController;
