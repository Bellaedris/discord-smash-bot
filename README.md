# discord-smash-bot
Discord bot that manages an unending Smash tournament. 

-- INSTALLATION --
- npm install at the root of the project
- add a .eastrc file at the root of the project and add these lines: 
  {
    "adapter": "east-mysql",
    "url": "mysql://login:password@DBAdress/DBname",
    "createDbOnConnect": true
  }
- rename .env.example to .env and fill it with the appropriate data (discord bot token and desired prefix)
- migrate the database: east migrate
- run the project using node app.js
