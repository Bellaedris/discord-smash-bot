"use strict";

exports.migrate = function (client, done) {
    var db = client.db;
    var sql = ["create table if not exists users(" +
            "discordId varchar(100) primary key, " +
            "discordTag varchar(100),"+
            "rating int(5)," +
            "previous_rating int(5)," +
            "created_at timestamp not null," + 
            "updated_at timestamp not null);",

            "create table if not exists games(" +
            "id_game int(6) unsigned auto_increment primary key, " +
            "player_one_id varchar(100) NOT NULL," + 
            "player_two_id varchar(100) NOT NULL," +
            "winner_id varchar(100)," + 
            "P1_char varchar(30) NOT NULL," +
            "P2_char varchar(30) NOT NULL," +
            "stage varchar(30) NOT NULL);",

            "create table if not exists season("+
            "id_season int(6) auto_increment primary key,"+
            "start_season DATE,"+
            "end_season DATE,"+
            "duration varchar(15));"]

    sql.forEach(query => {
        db.query(query, function(err, result) {
            if(err) throw err;
        });
    });
    
    done();
};

exports.rollback = function (client, done) {
    var db = client.db;
    var sql = "drop table if exists users, games;" 
    db.query(sql, function(err, result) {
        if(err) throw err;
    });
    done();
};
