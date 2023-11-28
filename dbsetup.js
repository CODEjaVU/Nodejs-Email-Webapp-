const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'wpr',
    database:'wpr2023',
    password: 'fit2023',
    port:3306
});

const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
  )
`;

const createEmailTableQuery = `
  CREATE TABLE IF NOT EXISTS emails (
      id INT AUTO_INCREMENT PRIMARY KEY,
      senderEmail VARCHAR(255) NOT NULL,
      recipientEmail VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      messageBody TEXT NOT NULL,
      attachments TEXT,
      dateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

const createUsersTable = () => {
    return new Promise((resolve, reject) => {
        connection.query(createUserTableQuery, (err, results) => {
            if (err) {
                console.error('Error creating users table:', err);
                reject(err);
            } else {
                console.log('Users table created or already exists');
                resolve();
            }
        });
    });
};

const createEmailsTable = () => {
    return new Promise((resolve, reject) => {
        connection.query(createEmailTableQuery, (err, results) => {
            if (err) {
                console.error('Error creating email table:', err);
                reject(err);
            } else {
                console.log('Email table created or already exists');
                resolve();
            }
        });
    });
};

const createUsers = () => {
    const usersToInsert = [
        { name: 'a', email: 'a@a.com', password: 'aaaaaa' },
        { name: 'b', email: 'b@b.com', password: 'bbbbbb' },
        { name: 'c', email: 'c@c.com', password: 'cccccc' }
    ];

    const userInsertPromises = usersToInsert.map(user => {
        const sql = `
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE email = email;`;

        const values = [user.name, user.email, user.password];

        return new Promise((resolve, reject) => {
            connection.query(sql, values, (err, result) => {
                if (err) {
                    console.error(`Error inserting user ${user.email}:`, err);
                    reject(err);
                } else {
                    if (result.insertId) {
                        console.log(`User inserted with ID: ${result.insertId}`);
                    } else {
                        console.log(`User with email ${user.email} already exists.`);
                    }
                    resolve();
                }
            });
        });
    });

    return Promise.all(userInsertPromises);
};

const createEmails = () => {
  const emailsToInsert = [
    {
      senderEmail: 'a@a.com',
      recipientEmail: 'b@b.com',
      subject: 'Hello',
      messageBody: 'Hey, how are you?',
      attachments: '',
      dateTime: new Date()
    },
    {
      senderEmail: 'a@a.com',
      recipientEmail: 'b@b.com',
      subject: 'Meeting',
      messageBody: 'Let schedule a meeting.',
      attachments: '',
      dateTime: new Date()
    },
    {
      senderEmail: 'a@a.com',
      recipientEmail: 'c@c.com',
      subject: 'Project Update',
      messageBody: 'Here is the latest project update.',
      attachments: '',
      dateTime: new Date()
    },
  
    {
      senderEmail: 'b@b.com',
      recipientEmail: 'a@a.com',
      subject: 'Re: Hello',
      messageBody: 'Im good, thanks!',
      attachments: '',
      dateTime: new Date()
    },
    {
      senderEmail: 'b@b.com',
      recipientEmail: 'a@a.com',
      subject: 'Re: Meeting',
      messageBody: 'Sure, lets schedule it for tomorrow.',
      attachments: '',
      dateTime: new Date()
    },
    {
      senderEmail: 'b@b.com',
      recipientEmail: 'c@c.com',
      subject: 'Re: Bye',
      messageBody: 'I get you the mocha.',
      attachments: '',
      dateTime: new Date()
    },
    
    
    {
      senderEmail: 'c@c.com',
      recipientEmail: 'a@a.com',
      subject: 'Question',
      messageBody: 'Do you have any questions?',
      attachments: '',
      dateTime: new Date()
    },
    {
      senderEmail: 'c@c.com',
      recipientEmail: 'a@a.com',
      subject: 'Feedback',
      messageBody: 'Id like to get your feedback on the project.',
      attachments: '',
      dateTime: new Date()
    }
  ];

    const emailInsertPromises = emailsToInsert.map(email => {
        const sql = `
            INSERT INTO emails
            (senderEmail, recipientEmail, subject, messageBody, attachments, dateTime)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                senderEmail = VALUES(senderEmail),
                recipientEmail = VALUES(recipientEmail),
                subject = VALUES(subject),
                messageBody = VALUES(messageBody),
                attachments = VALUES(attachments),
                dateTime = VALUES(dateTime)`;

        const values = [
            email.senderEmail,
            email.recipientEmail,
            email.subject,
            email.messageBody,
            email.attachments,
            email.dateTime
        ];

        return new Promise((resolve, reject) => {
            connection.query(sql, values, (err, result) => {
                if (err) {
                    console.error(`Error inserting or updating email ${email.senderEmail}:`, err);
                    reject(err);
                } else {
                    if (result.affectedRows === 1) {
                        console.log(`Email inserted or updated successfully: ${email.senderEmail}`);
                    } else {
                        console.log(`Email already exists. No new insertion or update: ${email.senderEmail}`);
                    }
                    resolve();
                }
            });
        });
    });

    return Promise.all(emailInsertPromises);
};


createUsersTable()
    .then(createEmailsTable)
    .then(createUsers)
    .then(createEmails)
    .then(() => {
        connection.end();
        console.log('MySQL connection closed');
    })
    .catch(err => {
        console.error('Error:', err);
        connection.end();
    });
