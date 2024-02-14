const db = require('./db/db.js');
const keysModel = require('./db/models/keys.js');

const express = require('express');
const app = express();

const ApiAuth = "ce64fb814680a735d4cd6b6dae34a6526e4ba539364603fd22dc695d2b3aa01a";
const ErrorRequestmsg = "Unauthorized";

db.connect();

app.listen(80, () => {
    console.log('[READY] Api iniciada.');
});

app.get('/codes', async (req, res) => {
    if (req.headers.auth !== ApiAuth) {
        console.log('auth errado');

        return res.status(200).json({
            message: ErrorRequestmsg
        });
    };

    let key = await keysModel.find({});
    return res.status(200).json(key);
});

app.post('/createCode/:code/:id', async (req, res) => {
    if (req.headers.auth !== ApiAuth) {
        console.log('auth errado');

        return res.status(200).json({
            message: ErrorRequestmsg
        });
    };

    await keysModel.create({
        code: req.params.code,
        botsaled: req.headers.botsaled || false,
        reedemed: false,
        Type: req.query.type,
        item: req.query.item,
        amount: req.query.amount || -1
    });

    console.log('success');

    return res.status(200).json({
        message: "success"
    });
});

app.post('/createBotCode/:code/:type/:item/:amount', async (req, res) => {
    if (req.headers.auth !== ApiAuth) {
        console.log('auth errado');

        return res.status(200).json({
            message: ErrorRequestmsg
        });
    };

    await keysModel.create({
        code: req.params.code,
        botsaled: true,
        reedemed: false,
        Type: req.params.type,
        item: req.params.item,
        amount: req.params.amount || -1
    });

    console.log('success');

    return res.status(200).json({
        message: "success"
    });
});

app.get('/redeemCode/:code', async (req, res) => {
    if (req.headers.auth !== ApiAuth) {
        console.log('auth errado redeem');

        return res.status(200).json({
            message: ErrorRequestmsg
        });
    };

    let codeFind = await keysModel.findOne({
        code: req.params.code
    });

    if (codeFind) {
        if (codeFind.reedemed) {
            console.log('already reedemed');
            
            return res.status(200).json({
                message: "reedemed",
                petId: codeFind.name
            });
        }

        codeFind.reedemed = true;
        await codeFind.save();

        return res.status(200).json({
            message: "success",
            Type: codeFind.Type,
            item: codeFind.item,
            amount: codeFind.amount || -1
        });
    }

    console.log('error redeem');

    return res.status(200).json({
        message: "failed"
    });
});

app.post('/deleteCode/:code', async (req, res) => {
    let codeFind = await keysModel.findOne({
        code: req.params.code
    });
    
    if (codeFind) {
        await keysModel.deleteOne({
            code: req.params.code
        });
    }

    return res.status(200).json({
        success: !(!codeFind)
    });
});