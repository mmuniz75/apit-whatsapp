const sulla = require('sulla');
const fs = require('fs');

fs.unlink('./session/Default/Service Worker/Database/MANIFEST-000001', (err) => {
    if (err) throw err;
        //sulla.create("session",(base64Qr, asciiQR)=>{},{headless: false}).then((client) => start(client))
        sulla.create().then((client) => start(client));
  });


async function start(client) {
    const contacts = await client.getAllContacts();
    contacts.map(contact => console.log(contact.id._serialized))
    //await client.close();
    process.exit(0);
            
}

