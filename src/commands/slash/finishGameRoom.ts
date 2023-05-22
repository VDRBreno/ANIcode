import { SlashCommandBuilder, Interaction } from 'discord.js';

import { Server } from '../../entities/Server';
import HandleError from '../../utils/handleError';
import { FormattedError } from '../../types/FormattedError';
import { client_id } from '../../config.json';

const slashCommand = new SlashCommandBuilder()
  .setName('fg')
  .setDescription('Finalizar uma partida');

export default {
  data: slashCommand,
  async execute(interaction: Interaction, server: Server) {
    if(!interaction.isCommand()) return;
    try {  
      
      if(!interaction.guildId||!interaction.channelId||!interaction.user.id) {
        interaction.reply('Por algum motivo não consegui obter o ID do servidor, ID do canal ou ID do usuário');
        return;
      }

      const channel = interaction.client.channels.cache.get(interaction.channelId);
      if(!channel||!channel.isTextBased())
        throw FormattedError({
          errorMessage: 'Canal não encontrado',
          error: 'Unable to finishGameRoom, channel not exists or is not text based'
        });

      const { embedRoomLeaderBoard, embedsGameRoomUsersCode } = server.finishGameRoom(interaction.guildId);

      interaction.reply({
        embeds: [
          ...embedsGameRoomUsersCode,
          embedRoomLeaderBoard
        ]
      });

      const pinnedMessages = await channel.messages.fetchPinned();
      pinnedMessages.forEach(msg => {
        if(msg.author.id===client_id)
          msg.unpin();
      });

    } catch(error) {
      HandleError(error, interaction);
    }
  }
}