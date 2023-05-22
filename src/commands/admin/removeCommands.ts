import { REST, Routes, Message } from 'discord.js';
import { token, client_id,  } from '../../config.json';
import terminalColors from '../../utils/terminalColors';

export default async function removeCommands(message: Message) {

  if(!message.guildId) {
    message.reply('GuildID not exists');
    return;
  }

  try {
    console.log(`[${terminalColors.fg.yellow}Started deleting application (/) slashCommands${terminalColors.reset}]`);

    const rest = new REST({ version: '10' }).setToken(token);
    const guildId = message.guildId;

    rest.get(Routes.applicationGuildCommands(client_id, guildId))
      .then(data => {
        const d = data as {
          id: string
        }[];
        const promises = [];
        for(const c of d) {
          const deleteUrl = `${Routes.applicationGuildCommands(client_id, guildId)}/${c.id}` as const;
          promises.push(rest.delete(deleteUrl))
        }
        return Promise.all(promises);
      });

    console.log(`[${terminalColors.fg.green}Successfully deleted application (/) slashCommands${terminalColors.reset}]`);
  } catch(err) {
    console.error(`\n[${terminalColors.fg.red}An error ocurred while slashCommands (/) as deleting${terminalColors.reset}] -> `);
    console.error(err);
  }
}