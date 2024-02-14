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

module.exports = {
    mongoose,
    connect
};