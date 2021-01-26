"use strict";

exports.migrate = function (client, done) {
    var db = client.db;
    var sql = "create table users(" +
            "discordId varchar(100) primary key, " +
            "rating int(5) not null," +
            "previous_rating int(5) not null," +
            "created_at timestamp not null," + 
            "updated_at timestamp not null);" +

            "create table match(" +
            "id int(6) unsigned auto_increment primary key," +
            "player_one_id varchar(100) NOT NULL" + 
            "player_one_id varchar(100) NOT NULL" +
            "winner_id varchar(100)" + 
            "P1_char varchar(30) NOT NULL" +
            "P2_char varchar(30) NOT NULL" +
            "stage varchar(30) NOT NULL"

    db.query(sql, function(err, result) {
        if(err) throw err;
    });
    done();
};

exports.rollback = function (client, done) {
    var db = client.db;
    var sql = "drop table users;" + "drop table match" 
    db.query(sql, function(err, result) {
        if(err) throw err;
    });
    done();
};
