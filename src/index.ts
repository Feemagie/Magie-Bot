import dotenv from 'dotenv';
import config from './config';
import Discord, { Emoji, TextChannel } from 'discord.js';

// Load in environment configurations.
dotenv.config();

// Create our bot.
const client = new Discord.Client();

// St
const memory: {
    welcomeAcknowledgedEmoji?: string;
} = {
    welcomeAcknowledgedEmoji: undefined
};

function emojiUnicode(emoji: string) {
    var comp;
    if (emoji.length === 1) {
        comp = emoji.charCodeAt(0);
    }
    comp = (
        (emoji.charCodeAt(0) - 0xD800) * 0x400
      + (emoji.charCodeAt(1) - 0xDC00) + 0x10000
    );
    if (comp < 0) {
        comp = emoji.charCodeAt(0);
    }
    return comp.toString(16);
};

/**
 * Event telling us the client is ready.
 */
client.on('ready', () => {
    console.log(`client is now running as ${client.user?.tag}`);

    // Cache messages in the welcome channel.
    const welcomeChannel = client.channels.cache.find(channel => (channel.id === config.welcomeChannelId && channel.type == 'text')) as TextChannel;
    welcomeChannel.messages.fetch();
});

/**
 * When a messages is reacted to.
 */
client.on('messageReactionAdd', (reaction, user) => {
    const channel = reaction.message.channel;

    if(channel.id == config.welcomeChannelId) {
        const { message, emoji } = reaction;

        if(emoji.name === config.welcomeAcknowledgedEmoji) {
            try {
                const role = message.guild?.roles.cache.find(role => role.name === config.serverMinimumAccessRole);
                role && message.guild?.members.cache.get(user.id)?.roles.add(role);
            } catch (error) {
                console.error(error);
            }
        }
    }
});

// Login to our client using our token.
client.login(process.env.TOKEN);