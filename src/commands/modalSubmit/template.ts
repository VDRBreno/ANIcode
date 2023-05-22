import { Interaction } from 'discord.js';

import { Server } from '../../entities/Server';
import HandleError from '../../utils/handleError';

const modalSubmitData = {
  name: 'template'
}

export default {
  data: modalSubmitData,
  async execute(interaction: Interaction, server: Server) {
    if(!interaction.isModalSubmit()) return;
    try {  
      
      if(!interaction.guildId||!interaction.channelId||!interaction.user.id) {
        interaction.reply('Por algum motivo não consegui obter o ID do servidor, ID do canal ou ID do usuário');
        return;
      }

    } catch(err) {
      HandleError(err, interaction);
    }
  }
}