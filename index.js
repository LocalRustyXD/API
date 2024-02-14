const express = require('express');
const app = express();

const ApiAuth = "f649507478396f6f095d8e6964201c8ef5d98580c08c386eabdd6cf082c3a22b";

const fs = require('fs');

app.listen(30144, () => {
    console.log('[READY] Api iniciada.');
});

app.get('/codes', (req, res) => {
    return res.status(200).json(require('./codes.json'));
});

app.post('/createCode/:code/:id', (req, res) => {
    if (req.headers.auth !== ApiAuth) {
        console.log('auth errado');

        return res.status(200).json({
            message: "hmm"
        });
    };

    let codes = require('./codes.json');

    codes.push({
        "code": req.params.code,
        "name": req.params.id,
        "botsaled": req.headers.botsaled || false,
        "reedemed": false,
        "Type": req.query.type,
        "item": req.query.item,
        "amount": req.query.amount || -1
    });

    fs.writeFileSync('./codes.json', JSON.stringify(codes, null, 2));

    console.log('success');

    return res.status(200).json({
        message: "success"
    });
});

app.post('/createBotCode/:code/:type/:item/:amount', (req, res) => {
    if (req.headers.auth !== ApiAuth) {
        console.log('auth errado');

        return res.status(200).json({
            message: "hmm"
        });
    };

    let codes = require('./codes.json');

    codes.push({
        "code": req.params.code,
        "botsaled": true,
        "reedemed": false,
        "Type": req.params.type,
        "item": req.params.item,
        "amount": req.params.amount || -1
    });

    fs.writeFileSync('./codes.json', JSON.stringify(codes, null, 2));

    console.log('success');

    return res.status(200).json({
        message: "success"
    });
});

app.get('/redeemCode/:code', (req, res) => {
    if (req.headers.auth !== ApiAuth) {
        console.log('auth errado redeem');

        return res.status(200).json({
            message: "hmm"
        });
    };

    let codes = require('./codes.json');
    let codeFind = codes.find(x => x.code == req.params.code);

    if (codeFind) {
        if (codeFind.reedemed) {
            console.log('already reedemed');
            
            return res.status(200).json({
                message: "reedemed",
                petId: codeFind.name
            });
        }

        codeFind.reedemed = true;

        fs.writeFileSync('./codes.json', JSON.stringify(codes, null, 2));

        console.log('success redeem');

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

app.post('/deleteCode/:code', (req, res) => {
    let codes = require('./codes.json');
    let indexToRemove = codes.findIndex(code => code.code === req.params.code);
    if (indexToRemove !== -1) {
        codes.splice(indexToRemove, 1);
    }

    fs.writeFileSync('./codes.json', JSON.stringify(codes, null, 2));

    return res.status(200).json({
        success: indexToRemove !== -1,
        index: indexToRemove
    });
});

app.post('/setSalled/:code', (req, res) => {
    let codes = require('./codes.json');
    let code = codes.find(code => code.code === req.params.code);
    code.botsaled = true;

    fs.writeFileSync('./codes.json', JSON.stringify(codes, null, 2));

    return res.status(200).json({
        success: true
    });
});
