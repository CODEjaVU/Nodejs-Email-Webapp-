//require('dotenv').config();

const express = require('express');

const app = express();
const path = require('path');
const authController = require('./controllers/signup')
const loginController = require('./controllers/signin')
const composeMail = require('./controllers/composeMail')


const getUser = require('./controllers/getUser')
const { getEmailByUsername, getReceivedEmails , getSentEmails , getAllEmails } = require('./controllers/getMail'); 

app.use(express.urlencoded({ extended: true }));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const isSignedIn = (req, res, next) => {
    const isSignedIn = req.cookies.username !== undefined; 
    if (isSignedIn) {
      next();
    } else {
      res.status(403).render('access-denied'); 
    }
  };


app.get('/', loginController.getSignin);
app.post('/', loginController.postSignin);

app.get('/inboxpage',isSignedIn, async (req, res) => {
    try {
        const username = req.cookies.username;
        const emailAcc = await getEmailByUsername(username);
        const emails = await getReceivedEmails(emailAcc);     
        const page = parseInt(req.query.page) || 1; 
        const pageSize = 5;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedEmails = emails ? emails.slice(startIndex, endIndex) : [];
    
        res.render('inboxpage', {
            emails: paginatedEmails,
            username: username,
            currentPage: page,
            totalPages: Math.ceil(emails.length / pageSize)
        });
    } catch (error) {
        console.error('Error:', error);
    } 
});

app.get('/outboxpage',isSignedIn, async (req, res) => {
    try {
        const username = req.cookies.username;
        const emailAcc = await getEmailByUsername(username);
        const emails = await getSentEmails(emailAcc);
        const page = parseInt(req.query.page) || 1; 
        const pageSize = 5;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedEmails = emails ? emails.slice(startIndex, endIndex) : [];
    
        res.render('outboxpage', {
            emails: paginatedEmails,
            username: username,
            currentPage: page,
            totalPages: Math.ceil(emails.length / pageSize)
        });
    } catch (error) {
        console.error('Error:', error);
        res.render('error', { error: 'Error fetching inbox data.' });
    } 
});

app.get('/detailpage/:emailId', async (req, res) => {
    const emailId = req.params.emailId;
    const username = req.cookies.username;
    const emailAcc = await getEmailByUsername(username);
    const emails = await getAllEmails(emailAcc);
    const emailDetails = emails.find(email => email.id === parseInt(emailId));
    if (!emailDetails) {     
        res.render('email-not-found');
        return;
    }
    res.render('detailpage', { username: username, emailDetails: emailDetails  });
});

app.get('/composepage',isSignedIn, composeMail.getCompose);
app.post('/composepage', composeMail.postCompose);


app.get('/signup', authController.getSignup);
app.post('/signup', authController.postSignup);

app.get('/signout', (req, res) => {
    const cookies = Object.keys(req.cookies);
    cookies.forEach(cookie => {
        res.clearCookie(cookie);
    });
    res.redirect('/');
});
//app.use('/attachments', express.static(path.join(__dirname, '')));

app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    //const filePath = path.join(__dirname, '', filename);


    res.download(filePath, filename, (err) => {
        if (err) {
            console.error('Error downloading :', err);
            res.status(500).json({ error: 'Error downloading .' });
        }
    });
});

app.listen(8000, () => {
    console.log(`Server is running at http://localhost:8000`);
});
