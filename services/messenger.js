const sulla = require('sulla');
const fs = require('fs');
/*
process.on('exit', async (code) => {
    console.log(`Closing whatsApp's sessions`);
    
    for(key in clients)
        if(clients[key])
            try{
                await clients[key].close();
                console.log(`${key} closed`)
            }catch(err){
                console.error(`Not possible close session ${key}`)
            }

});
*/
const clients = []

const sleep = async(ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const login = async (phone) => {
    try{

       client = await getClient(phone);
       if(client) 
            return;
             
       let buffer;
       sulla.create(phone, (base64Qr, asciiQR) => {
                    base64Qr = base64Qr.replace('data:image/png;base64,', '');
                    buffer =Buffer.from(base64Qr, 'base64');
                    },{
                        refreshQR : 0,
                    })
        .then(async (client) =>  {
                await client.close();
            }    
        );

        while(!buffer)            
            await sleep(1000)

        return buffer;
    }catch(e) {
        throw new Error(e.message);
    };
};

const setClientEvent = (phone,client) =>  {
    client.onStateChange((state) => {
        console.log(state);
        const conflits = [
                            sulla.SocketState.CONFLICT,
                            sulla.SocketState.UNPAIRED,
                            sulla.SocketState.UNLAUNCHED,
                          ];
        if (conflits.includes(state)) {
            removeSession(phone, client);
        }
    });
}

const logout = async (phone) => {
    try{
       client = await getClient(phone);
       if(!client) 
            return;
       
       removeSession(phone, client);

    }catch(e) {
        throw new Error(e.message);
    };
};

const removeSession = async(phone, client) => {
    await client.close();
    delete clients[phone]
    await sleep(1000);
    fs.rmdir('./' + phone, { recursive: true },(err) => {
     if (err) {
       console.error(err)
       return
     }
    });
}


const send = async (phone,message,groups) => {
    try{
        client = await getClient(phone);
        if(!client)
            throw new Error("403");
        else {
            await client.sendText(groups, message);
        }    
    }catch(e) {
        throw new Error(e.message);
    };
};

const getClient = async (phone) => {
    let client = clients[phone];
    if (!client) { 
        const session = './' + phone;
        if (fs.existsSync(session)) {
            const fileCash = session + '/Default/Service Worker/Database/MANIFEST-000001';
            if (fs.existsSync(fileCash))
                fs.unlinkSync(fileCash);
                
            client = await sulla.create(phone);
            setClientEvent(phone,client);
            clients[phone] = client
        }
    }

    return client;    
}

module.exports.login = login;
module.exports.logout = logout;
module.exports.send = send;


