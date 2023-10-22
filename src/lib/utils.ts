import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { DrizzleChat } from './db/schema';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertToAscii = (inputString: string) => {
  // remove all non ascii characters
  const asciiString = inputString.replace(/[^\x00-\x7F]+/g, '');
  return asciiString;
};

export const getChatIndex = (chatId: number, chats: DrizzleChat[]) => {
  return chats.findIndex((chat) => chat.id === chatId);
};
