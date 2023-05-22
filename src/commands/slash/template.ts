import { SlashCommandBuilder, Interaction } from 'discord.js';

import { Server } from '../../entities/Server';
import HandleError from '../../utils/handleError';

const slashCommand = new SlashCommandBuilder()
  .setName('template')
  .setDescription('description')
  .addStringOption(option => option
    .setName('template')
    .setDescription('description')
    .setRequired(true));

export default {
  data: slashCommand,
  async execute(interaction: Interaction, server: Server) {
    if(!interaction.isCommand()) return;
    try {  
      
      if(!interaction.guildId||!interaction.channelId||!interaction.user.id) {
        interaction.reply('Por algum motivo não consegui obter o ID do servidor, ID do canal ou ID do usuário');
        return;
      }

    } catch(error) {
      HandleError(error, interaction);
    }
  }
}