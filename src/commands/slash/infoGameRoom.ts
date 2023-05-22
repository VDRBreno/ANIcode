import { SlashCommandBuilder, Interaction, EmbedBuilder } from 'discord.js';

import { Server } from '../../entities/Server';
import HandleError from '../../utils/handleError';

const slashCommand = new SlashCommandBuilder()
  .setName('infogame')
  .setDescription('Informações sobre a partida');

export default {
  data: slashCommand,
  async execute(interaction: Interaction, server: Server) {
    if(!interaction.isCommand()) return;
    try {  
      
      if(!interaction.guildId||!interaction.channelId||!interaction.user.id) {
        interaction.reply('Por algum motivo não consegui obter o ID do servidor, ID do canal ou ID do usuário');
        return;
      }

      const embedDescription = server.getGameRoomLeaderBoard(interaction.guildId);

      const embed = new EmbedBuilder()
        .setTitle('Placar')
        .setDescription(embedDescription)
        .setColor('DarkGreen');

      interaction.reply({ embeds: [embed] });

    } catch(error) {
      HandleError(error, interaction);
    }
  }
}