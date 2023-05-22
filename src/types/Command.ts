import { SlashCommandBuilder, Interaction } from 'discord.js';
import { Server } from '../entities/Server';

export interface ISlashCommand {
  data: Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">,
  execute: (interaction: Interaction, server: Server) => void;
}

export interface IModalSubmit {
  data: {
    name: string;
  };
  execute: (interaction: Interaction, server: Server) => void;
}