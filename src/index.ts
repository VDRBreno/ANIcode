import { Client, GatewayIntentBits, Events } from 'discord.js';

import registerCommands from './commands/admin/registerCommands';
import removeCommands from './commands/admin/removeCommands';
import modalSubmits from './commands/modalSubmit';
import slashCommands from './commands/slash';
import { Server } from './entities/Server';
import terminalColors from './utils/terminalColors';
import { token } from './config.json';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const server = new Server();

client.on('ready', () => {
  console.log(`\n[${terminalColors.fg.green}Bot Running${terminalColors.reset}]\n`);
});

client.on(Events.MessageCreate, async message => {
  if(message.content==='registerCommands') {
    await registerCommands(message);
    message.reply('Comandos registrados!');
  }
  if(message.content==='removeCommands') {
    await removeCommands(message);
    message.reply('Comandos deletados!');
  }
});

client.on(Events.InteractionCreate, interaction => {
  if(interaction.isChatInputCommand())
    for(const slashCommand of slashCommands) {
      if(slashCommand.data.name===interaction.commandName) {
        slashCommand.execute(interaction, server);
        break;
      }
    }
  else if(interaction.isModalSubmit())
    for(const modalSubmit of modalSubmits) {
      if(modalSubmit.data.name===interaction.customId) {
        modalSubmit.execute(interaction, server);
        break;
      }
    }
});

client.login(token);