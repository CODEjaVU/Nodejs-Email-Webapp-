const db = require('./dbconnect');
const getMail = require('../controllers/getMail');
const getUser = require('../controllers/getUser');
const composeMail = {
    getCompose: async(req, res) => {
      try {
        const username = req.cookies.username;
        const users = await getUser(username);
        res.render('composepage', { username: username, users: users });
    } catch (error) {
        console.error('Error:', error);
    }
    },

    postCompose: async (req, res) => {
        try {
            
            const {  recipient, subject, body, attachment } = req.body;
            const sql = `
            INSERT INTO emails
            (senderEmail, recipientEmail, subject, messageBody, attachments, dateTime)
            VALUES (?, ?, ?, ?, ?, ?)`;
            const senderMail = await getMail.getEmailByUsername(req.cookies.username);
            const recipientMail = await getMail.getEmailByUsername(recipient);
            const date = new Date();
            const values = [ senderMail, recipient, subject, body, attachment, date];
            console.log(values);
            let successMsg = undefined;
            db.query(sql, values, (err) => {
              if (err) {
                console.err('Error querying MySQL:', err);
                res.render('composepage');
                return;
              }else{
                successMsg = "Sent successfully"
              }
      
            });
            
            const username = req.cookies.username;
        const users = await getUser(username);

        res.render('composepage', { msg: successMsg, username: username, users: users });
        } catch (error) {
            console.log('fail');
        }
    },
};

module.exports = composeMail;
