import { SlashCommandBuilder, Interaction, EmbedBuilder } from 'discord.js';

import { Server } from '../../entities/Server';
import HandleError from '../../utils/handleError';

const slashCommand = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Algumas ajudas úteis');

export default {
  data: slashCommand,
  async execute(interaction: Interaction, server: Server) {
    if(!interaction.isCommand()) return;
    try {  
      
      if(!interaction.guildId||!interaction.channelId||!interaction.user.id) {
        interaction.reply('Por algum motivo não consegui obter o ID do servidor, ID do canal ou ID do usuário');
        return;
      }

      const embedDescription = [
        '**Como ler entradas:**',
        '```ts',
        '// entrada:',
        '// 10',
        '// 20',
        '',
        'const linha1: string = readline(); // 10',
        'const linha2: string = readline(); // 20',
        '```',
        '**Modos de jogo:**',
        '`Fastest:` Quem enviar a solução mais rápido',
        '`Shortest:` Quem enviar a solução com menos caracteres',
        '`Reverse:` O problema não terá descrição, apenas entradas e saídas',
      ].join('\n');

      const embed = new EmbedBuilder()
        .setTitle('Ajuda')
        .setDescription(embedDescription)
        .setColor('Gold')
        .setFooter({
          text: 'Válido códigos apenas em JavaScript'
        });

      interaction.reply({ embeds: [embed] });

    } catch(error) {
      HandleError(error, interaction);
    }
  }
}