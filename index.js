const mongoose = require('mongoose');
const config = {
    db: {
        user: "flzzdb",
        password: "t3GytbovGBbCbuPy"
    }
};

const MONGO_KEY = `mongodb+srv://${config.db.user}:${config.db.password}@flzzcluster.d9zkoqn.mongodb.net/?retryWrites=true&w=majority`;

const connect = () => {
    mongoose.connect(MONGO_KEY);

    const connection = mongoose.connection;

    connection.on("error", () => {
        console.log(`[🌟 - DATABASE] Erro ao se conectar com a database.`);
    });

    connection.on("open", () => {
        console.log(`[🌟 - DATABASE] Conectado com a database.`);
    });
};

const schema = new mongoose.Schema({
    code: String,
    botsaled: Boolean,
    reedemed: Boolean,
    Type: String,
    item: String,
    amount: Number
});

let keyModel = mongoose.model('keymodel', schema);

/* DATABASE */

const express = require('express');
const app = express();

const ApiAuth = "f649507478396f6f095d8e6964201c8ef5d98580c08c386eabdd6cf082c3a22b";

app.listen(30144, () => {
    console.log('[READY] Api iniciada.');
    connect();
});

app.get('/codes', async (req, res) => {
    if (req.headers.auth !== ApiAuth) {
        console.log('auth errado');

        return res.status(200).json({
            message: "hmm"
        });
    };

    let key = await keyModel.find({});
    return res.status(200).json(key);
});

app.post('/createCode/:code/:id', async (req, res) => {
    if (req.headers.auth !== ApiAuth) {
        console.log('auth errado');

        return res.status(200).json({
            message: "hmm"
        });
    };

    await keyModel.create({
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
            message: "hmm"
        });
    };

    await keyModel.create({
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
            message: "hmm"
        });
    };

    let codeFind = await keyModel.findOne({
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
    let codeFind = await keyModel.findOne({
        code: req.params.code
    });
    
    if (codeFind) {
        await keyModel.deleteOne({
            code: req.params.code
        });
    }

    return res.status(200).json({
        success: !(!codeFind)
    });
});
