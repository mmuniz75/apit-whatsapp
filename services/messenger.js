const sulla = require('sulla');
const fs = require('fs');

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
       let finished = false
       sulla.create(phone, (base64Qr, asciiQR) => {
                    console.log(asciiQR);
                    base64Qr = base64Qr.replace('data:image/png;base64,', '');
                    buffer =Buffer.from(base64Qr, 'base64');
                    }, {
                        refreshQR : 0
                    })
        .then(client => {
                clients[phone] = client
                finished = true
            }    
        );

        while(!buffer && !finished)            
            await sleep(1000)

        return buffer;

    }catch(e) {
        throw new Error(e.message);
    };

};


const send = async (phone,message,groups) => {

    try{
        client = await getClient(phone);
        if(!client)
            throw new Error("403");
        else {
            await client.sendText(groups, message);
            //client.close()    
        }    
          
    }catch(e) {
        throw new Error(e.message);
    };
};

const getClient = async (phone) => {
    let client = clients[phone];
    let connected = true;
    if (!client) { 
        if (fs.existsSync('./' + phone)) {
            client = await sulla.create(phone);
            clients[phone] = client
        }else
            connected = false;    
    }else {
        if(await !client.isConnected)
            connected = false;
    }

    return connected?client:undefined;    
}

module.exports.login = login;
module.exports.send = send;
