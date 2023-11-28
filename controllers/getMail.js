const connection = require('./dbconnect');

function getEmailByUsername(username) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT email FROM users WHERE name = ?';
        connection.query(sql, [username], (error, results) => {
            if (error) {
                console.error('Error querying database:', error);
                reject(error);
                return;
            }

            if (results.length > 0) {
                const userEmail = results[0].email;
                resolve(userEmail);
            }  
            else {

                resolve(null);
            }
        });
    });
}

function getReceivedEmails(recipientEmail) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM emails WHERE recipientEmail = ?';
        connection.query(sql, recipientEmail, (error, results) => {
            if (error) {
                console.error('Error querying database:', error);
                reject(error);
                return;
            }
            if (results.length > 0){
            const emails = results.map(row => ({
                id : row.id,
                senderName: row.senderEmail,
                subject: row.subject,
                date: row.dateTime,
                messageBody: row.messageBody
            }));
            resolve(emails);
        }else {
            const emails = results.map(row => ({
                id : row.id,
                senderName: row.senderEmail,
                subject: row.subject,
                date: row.dateTime,
                messageBody: row.messageBody
            }));
            resolve(emails);
            console.log('no received found')
        }
        
        });
    });
}

function getSentEmails(senderEmail) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM emails WHERE senderEmail = ?';
        connection.query(sql, senderEmail, (error, results) => {
            if (error) {
                console.error('Error querying database:', error);
                reject(error);
                return;
            }
            if (results.length > 0 ){
            const emails = results.map(row => ({
                id : row.id,
                recipientName: row.recipientEmail,
                subject: row.subject,
                date: row.dateTime,
                messageBody: row.messageBody
            }));
            resolve(emails);
        }
        else {
            const emails = results.map(row => ({
                id : row.id,
                senderName: row.senderEmail,
                subject: row.subject,
                date: row.dateTime,
                messageBody: row.messageBody
            }));
            resolve(emails);
            console.log('no sent found')
        }
        });
    });
}

function getAllEmails() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM emails ';
        connection.query(sql, (error, results) => {
            if (error) {
                console.error('Error querying database:', error);
                reject(error);
                return;
            }
            if (results.length > 0){
            const emails = results.map(row => ({
                id : row.id,
                recipientName: row.recipientEmail,
                senderName: row.senderEmail,
                subject: row.subject,
                date: row.dateTime,
                messageBody: row.messageBody,
                attachments: row.attachments
            }));
            resolve(emails);
        }
        });
    });
}

module.exports = { getEmailByUsername, getReceivedEmails , getSentEmails , getAllEmails};
