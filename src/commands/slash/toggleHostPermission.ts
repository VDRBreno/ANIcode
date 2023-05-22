import { SlashCommandBuilder, Interaction } from 'discord.js';

import { Server } from '../../entities/Server';
import HandleError from '../../utils/handleError';

const slashCommand = new SlashCommandBuilder()
  .setName('chp')
  .setDescription('Desative ou ative as permissões de host')
  .addBooleanOption(option => option
    .setName('allow')
    .setDescription('Ativar(True) ou desativar(False)?')
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

      const interactionOptions = {
        allow: interaction.options.get('allow')
      }
      const inputValues = {
        allow:
          interactionOptions.allow&&
            interactionOptions.allow.value&&
              typeof interactionOptions.allow.value==='boolean'
                ?interactionOptions.allow.value
                :undefined
      }

      if(typeof inputValues.allow!=='boolean') {
        interaction.reply('Preencha os campos corretamente');
        return;
      }

      server.setHostPermission(interaction.guildId, interaction.user.id, inputValues.allow);

      interaction.reply(`As permissões para apenas host estão: ${inputValues.allow ?'Ativadas' :'Desativadas'}`);

    } catch(error) {
      HandleError(error, interaction);
    }
  }
}