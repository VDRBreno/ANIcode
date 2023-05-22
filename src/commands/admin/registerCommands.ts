import { RESTPostAPIChatInputApplicationCommandsJSONBody, REST, Routes, Message } from 'discord.js';
import { token, client_id,  } from '../../config.json';
import terminalColors from '../../utils/terminalColors';
import slashCommands from '../slash';

export default async function registerCommands(message: Message) {

  if(!message.guildId) {
    message.reply('GuildID not exists');
    return;
  }

  try {
    const restSlashCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

    for(const cmd of slashCommands) {
      restSlashCommands.push(cmd.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(token);
    const guildId = message.guildId;

    console.log(`[${terminalColors.fg.yellow}Started refreshing application (/) slashCommands${terminalColors.reset}]`);

    await rest.put(
      Routes.applicationGuildCommands(client_id, guildId),
      { body: restSlashCommands }
    );

    console.log(`[${terminalColors.fg.green}Successfully reloaded application (/) slashCommands${terminalColors.reset}]`);
  } catch(err) {
    console.error(`\n[${terminalColors.fg.red}An error ocurred while slashCommands (/) as registering${terminalColors.reset}] -> `);
    console.error(err);
  }
}