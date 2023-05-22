import { SlashCommandBuilder, Interaction, EmbedBuilder } from 'discord.js';

import { Server } from '../../entities/Server';
import HandleError from '../../utils/handleError';
import { IUser } from '../../types/Room';

const slashCommand = new SlashCommandBuilder()
  .setName('join')
  .setDescription('Entrar na sala');

export default {
  data: slashCommand,
  async execute(interaction: Interaction, server: Server) {
    if(!interaction.isCommand()) return;
    try {  
      
      if(!interaction.guildId||!interaction.channelId||!interaction.user.id) {
        interaction.reply('Por algum motivo não consegui obter o ID do servidor, ID do canal ou ID do usuário');
        return;
      }

      const user: Omit<IUser, 'wins'> = {
        id: interaction.user.id,
        username: interaction.user.username,
        avatarURL: interaction.user.avatarURL() || interaction.user.defaultAvatarURL 
      }

      const room = server.userJoinRoom({ guildId: interaction.guildId, user });

      let embedDescription = ``
        +`**Usuário / Vitórias**\n`;

      room.users.map(u => {
        embedDescription += `\n${u.username} | ${u.wins}`;
      });

      const embed = new EmbedBuilder()
        .setTitle(`${user.username} - Entrou na sala`)
        .setDescription(embedDescription)
        .setColor('DarkGreen')
        .setFooter({
          text: 'Use o comando de ajuda para dicas úteis'
        });

      interaction.reply({ embeds: [embed] });

    } catch(error) {
      HandleError(error, interaction);
    }
  }
}