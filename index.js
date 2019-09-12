'use strict';

import express from 'express';
import bodyParser from 'body-parser'
import RouteController from './RouteController';

const app = express();

app.enable("trust proxy");
if(process.env.NODE_ENV === 'production') {
    app.use (function (req, res, next) {
        if (req.secure) {
            next();
        } else {
            res.redirect('https://' + req.headers.host + req.url);
        }
    });
}

app.use(bodyParser.urlencoded({extended: false}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/api', RouteController);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});