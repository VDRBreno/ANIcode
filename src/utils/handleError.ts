import { RepliableInteraction } from 'discord.js';

import { IFormattedError } from '../types/FormattedError';
import terminalColors from './terminalColors';

function isFormattedError(error: any): error is IFormattedError {
  return 'errorMessage' in error
    && 'error' in error;
}
export default function handleError(error: any, interaction?: RepliableInteraction) {
  console.log('');
  if(isFormattedError(error)) {

    console.log(`[${terminalColors.fg.red}FORMATTED ERROR${terminalColors.reset}]`);
    console.log(`[${terminalColors.fg.red}MESSAGE${terminalColors.reset}]`, error.errorMessage);
    console.log(`[${terminalColors.fg.red}ERROR${terminalColors.reset}]`, error.error);

    if(interaction) {
      if(interaction.replied)
        interaction.editReply(error.errorMessage);
      else
        interaction.reply(error.errorMessage);
    }

  } else if(error instanceof Error) {

    console.log(`[${terminalColors.fg.red}INSTANCE ERROR${terminalColors.reset}]`);
    console.log(`[${terminalColors.fg.red}MESSAGE${terminalColors.reset}]`, error.message);
    console.log(`[${terminalColors.fg.red}ERROR${terminalColors.reset}]`, error);

    if(interaction) {
      if(interaction.replied)
        interaction.editReply('Ocorreu um erro -_-');
      else
        interaction.reply('Ocorreu um erro -_-');
    }
    
  } else {
    
    console.log(`[${terminalColors.fg.red}ANY ERROR${terminalColors.reset}]`, error);

    if(interaction) {
      if(interaction.replied)
        interaction.editReply('Deu um erro :/');
      else
        interaction.reply('Deu um erro :/');
    }
    
  }
  console.log('');
}

export function handleWarning(message: string) {
  console.log('');
  console.log(`[${terminalColors.fg.yellow}WARNING${terminalColors.reset}]`, message);
  console.log('');
}