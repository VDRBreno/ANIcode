import { SlashCommandBuilder, Interaction, EmbedBuilder } from 'discord.js';

import { Server } from '../../entities/Server';
import HandleError from '../../utils/handleError';

const slashCommand = new SlashCommandBuilder()
  .setName('info')
  .setDescription('Informações sobre a sala');

export default {
  data: slashCommand,
  async execute(interaction: Interaction, server: Server) {
    if(!interaction.isCommand()) return;
    try {  
      
      if(!interaction.guildId||!interaction.channelId||!interaction.user.id) {
        interaction.reply('Por algum motivo não consegui obter o ID do servidor, ID do canal ou ID do usuário');
        return;
      }

      const room = server.getRoomInfo(interaction.guildId);

      let embedDescription = ``;

      room.users.map(u => {
        embedDescription += `\n${u.username} | ${u.wins}`;
      });

      const embed = new EmbedBuilder()
        .setTitle('Usuário / Vitórias')
        .setDescription(embedDescription)
        .setColor('DarkGreen')
        .setFooter({
          text: 'Use o comande de ajuda para dicas úteis'
        });

      interaction.reply({ embeds: [embed] });

    } catch(error) {
      HandleError(error, interaction);
    }
  }
}