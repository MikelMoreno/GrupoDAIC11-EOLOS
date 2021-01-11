var config = {};

// config.db_hostname = "172.19.0.2";
config.db_hostname = process.env.MONGO_HOSTNAME;
config.db_port = process.env.MONGO_PORT;
config.express_db_user = process.env.MONGO_USERNAME;
config.express_db_pass = process.env.MONGO_PASSWORD;
config.db_name = process.env.MONGO_DB;

config.db_connection_string =  "mongodb://" + 
                                config.db_hostname + 
                                ":" + config.db_port +
                                "/" + config.db_name;

config.db_full_connection_string =  "mongodb://" + 
                                    config.express_db_user + ":" +
                                    config.express_db_pass + "@" +
                                    config.db_hostname + 
                                    ":" + config.db_port +
                                    "/" + config.db_name;
                                                                     
module.exports = config;