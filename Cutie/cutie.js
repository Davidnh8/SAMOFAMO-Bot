// Bot designed to give insight to the mystery wallet's SAMO

// requires auth.json of the structure
/*
{
  "token": "token"
}
*/

var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
var axios = require('axios');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// CONST
const cutieTokenAddress = 'ECRXxKJDff23uDmkcg3WCjX38z1W7HnCKzVvKuwfHcoh'

// Initialize Discord Bot
const client = new Discord.Client()
client.login(auth.token)

client.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(client.username + ' - (' + client.id + ')');
});

client.on('message', function (message) {
	switch(message.content) {
		case '!cutie N':
		case '!cutie Balance':
		case '!cutie Samo Balance':
			getCutieTokenBalance().then(res =>
				client.channel.send(res.data[0].result.value.uiAmountString.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' SAMO')
			)
		break;
	}
});

async function getCutieTokenBalance() {
	return await axios({
		url: `https://api.mainnet-beta.solana.com`,
		method: "post",
		headers: { "Content-Type": "application/json" },
		data: [
			{
			  jsonrpc: "2.0",
			  id: 1,
			  method: "getTokenAccountBalance",
			  params: [
				cutieTokenAddress
			  ],
			},
		]
    })
}
