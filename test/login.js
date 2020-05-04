const sulla = require('sulla');

sulla.create().then((client) => start(client));

async function start(client) {
    console.log('logado')
    client.close()
}


