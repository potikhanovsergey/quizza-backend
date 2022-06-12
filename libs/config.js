
const config = {};

config.port = 3001;

config.mongoose = {
    "uri": "mongodb://localhost:27017/quizzadb",
    "options": {
        "keepAlive": 1,
        "autoIndex": true,
        "useNewUrlParser": true,
        "poolSize" : 10
    }
};

config.session = {
    "secret": "quizza",
    "key": "sid",
    "cookie": {
        "path": "/",
        "httpOnly": true,
        "maxAge": null
    }
};

config.oauth = {
    // 'googleAuth' : {
    //     'clientID': 'your_client_id',
    //     'clientSecret': 'your_client_secret',
    //     'callbackURL': '/registration/google/callback'
    // },
    'vkontakteAuth' : {
        'clientID': '8165962',
        'clientSecret': '6wAGjlpincJlr4YsCBWA',
        'callbackURL': '/vk-oauth-callback'
    }
};

module.exports = config;