import { EmbedBuilder, Interaction } from 'discord.js';

import { Server } from '../../entities/Server';
import HandleError from '../../utils/handleError';

const modalSubmitData = {
  name: 'submitCodeGameRoom'
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

      const channel = interaction.client.channels.cache.get(interaction.channelId);
      if(!channel||!channel.isTextBased())
        throw {
          warn: 'Canal inexistente!'
        };

      server.verifyIfUserIsValidForSubmission(interaction.guildId, interaction.user.id);

      const interactionOptions = {
        code: interaction.fields.getTextInputValue('codeInput')
      }
      const inputValues = {
        code:
          interactionOptions.code&&
            typeof interactionOptions.code==='string'
              ?interactionOptions.code
              :undefined
      }

      if(!inputValues.code)
        throw {
          warn: 'Não consegui obter o código!'
        }

      const code = inputValues.code;

      const response = server.gameRoomSubmission(interaction.guildId, interaction.user.id, code);

      if(response[0].type==='maxScore') {
        await interaction.reply(response[0].message);
        return;
      }
      
      if(response[0].type==='testFail') {
        
        const embedDescription = `**Esperado:**`
          +`\n\`\`\`${response[0].expected}\`\`\``
          +`\n**Recebido:**`
          +`\n\`\`\`${response[0].received}\`\`\``;
        
        const embed = new EmbedBuilder()
          .setTitle(`Teste ${response[0].testCase} falhou!`)
          .setDescription(embedDescription)
          .setColor('DarkRed');

        await interaction.reply({ embeds: [embed] });

      } else if(response[0].type==='error') {
        
        const embedDescription = `**Erro:**`
          +`\n\`\`\`${response[0].message}\`\`\``;
        
        const embed = new EmbedBuilder()
          .setTitle(`Erro no teste ${response[0].testCase}!`)
          .setDescription(embedDescription)
          .setColor('DarkRed');

        await interaction.reply({ embeds: [embed] });

      }

      if(response[1]&&response[1].type==='notMaxScore')
        channel.send(response[1].message);

    } catch(error) {
      HandleError(error, interaction);
    }
  }
}