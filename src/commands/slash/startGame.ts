import { SlashCommandBuilder, Interaction, EmbedBuilder } from 'discord.js';

import { Server } from '../../entities/Server';
import HandleError from '../../utils/handleError';
import { FormattedError } from '../../types/FormattedError';
import { IGameRoomModes } from '../../types/Room';

const gameModeOptions = ['fastest', 'shortest', 'reverse'];

const slashCommand = new SlashCommandBuilder()
  .setName('sg')
  .setDescription('Iniciar uma partida')
  .addStringOption(option => {
    let opt = option
      .setName('mode')
      .setDescription('Modo de jogo');
    gameModeOptions.map(item => {
      opt.addChoices({ name: item, value: item });
    });
    return opt;
  });

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

      const interactionOptions = {
        mode: interaction.options.get('mode')
      }
      const inputValues = {
        mode:
          interactionOptions.mode&&
            interactionOptions.mode.value&&
              typeof interactionOptions.mode.value==='string'&&
                gameModeOptions.includes(interactionOptions.mode.value)
                  ?interactionOptions.mode.value
                  :undefined
      }

      if(!inputValues.mode) {
        interaction.reply('Preencha os campos corretamente');
        return;
      }

      const mode = inputValues.mode as IGameRoomModes;
      
      const problem = server.startGame(interaction.guildId, interaction.user.id, mode);
      
      const embeds: EmbedBuilder[] = [];
      
      const embedDescription = ``
      +`*Dica: use o comando de finalizar a partida para mostrar os resultados!*`
      +`\n\n**Problema:** ${problem.title}`
      +`\`\`\`${problem.question}\`\`\``
      +`\n**Exemplos:**`;
      
      problem.examples.map((example, i) => {
        const embedExampleDescription = ``
          +`**Entrada:**`
          +`\n${example.input}`
          +`\n\n**Saída:**`
          +`\n${example.output}`;
        
        const embedExample = new EmbedBuilder()
          .setDescription(embedExampleDescription);

        embeds.push(embedExample);
      });
      
      const embed = new EmbedBuilder()
        .setTitle(`Partida Iniciada - ${mode}`)
        .setDescription(embedDescription)
        .setColor('Blue');
      
      const msg = await channel.send({ embeds: [embed, ...embeds] });
      msg.pin();

      interaction.reply(':thumbsup:');

    } catch(error) {
      HandleError(error, interaction);
    }
  }
}