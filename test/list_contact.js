const sulla = require('sulla');

sulla.create().then((client) => start(client));

async function start(client) {
    const contacts = await client.getAllContacts();
    contacts.map(contact => console.log(contact.id._serialized))
            
}


