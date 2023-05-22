import { SlashCommandBuilder, Interaction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

import { Server } from '../../entities/Server';
import HandleError from '../../utils/handleError';

const slashCommand = new SlashCommandBuilder()
  .setName('submit')
  .setDescription('Enviar código');

export default {
  data: slashCommand,
  async execute(interaction: Interaction, server: Server) {
    if(!interaction.isCommand()) return;
    try {  
      
      if(!interaction.guildId||!interaction.channelId||!interaction.user.id) {
        interaction.reply('Por algum motivo não consegui obter o ID do servidor, ID do canal ou ID do usuário');
        return;
      }

      const modal = new ModalBuilder()
        .setCustomId('submitCodeGameRoom')
        .setTitle('Enviar code');

      const codeInput = new TextInputBuilder()
        .setCustomId('codeInput')
        .setLabel('code')
        .setStyle(TextInputStyle.Paragraph);

      const actionRowBuilder = new ActionRowBuilder<TextInputBuilder>()
        .addComponents(codeInput);

      modal.addComponents(actionRowBuilder);

      await interaction.showModal(modal);

    } catch(error) {
      HandleError(error, interaction);
    }
  }
}