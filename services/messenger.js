const sulla = require('sulla');

const clients = []

const login = async (phone) => {

    try{
        let buffer;
        client = await sulla.create(phone, (base64Qr, asciiQR) => {
                            console.log(asciiQR);
                            base64Qr = base64Qr.replace('data:image/png;base64,', '');
                            buffer =Buffer.from(base64Qr, 'base64');
                            });

        clients[phone] = client;     
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
    if (!clients[phone]) { 
        client = await sulla.create(phone);
        clients[phone] = client
    }
    return clients[phone];    
}

module.exports.login = login;
module.exports.send = send;
