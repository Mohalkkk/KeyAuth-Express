const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path'); 

const app = express();
const port = 80;

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
    }
}));
app.use(express.json({ limit: '10kb' }));
app.set('trust proxy', 1);
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100
});
app.use(limiter);
app.use(cors({
    methods: ['GET', 'POST'],
}));
require('dotenv').config();

const apiRouter = express.Router();
app.use('/api/', apiRouter);

const createKeyRouter = require('./routes/auth/createkey.js');
apiRouter.use('/createkey', createKeyRouter);

const registerRouter = require('./routes/auth/register.js');
apiRouter.use('/register', registerRouter);

const loginRouter = require('./routes/auth/login.js');
apiRouter.use('/login', loginRouter);

app.use('/', express.static(path.join(__dirname, 'public', 'home')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home', 'index.html'));
});

app.use('/adminpanel', express.static(path.join(__dirname, 'public', 'adminpanel')));
app.get('/adminpanel', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'adminpanel', 'adminpanel.html'));
});

app.use('/register', express.static(path.join(__dirname, 'public', 'register')));
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register', 'register.html'));
});

app.use('/login', express.static(path.join(__dirname, 'public', 'login')));
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login', 'login.html'));
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: 'false',
        msg: 'Internal Error'
    });
});
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404', '404.html'));
});

app.listen(port, () => {
    console.log(`API is running on http://localhost:${port}`);
});
