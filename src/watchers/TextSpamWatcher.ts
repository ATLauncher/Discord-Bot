import config from 'config';
import * as Discord from 'discord.js';

import BaseWatcher from './BaseWatcher';

/**
 * This watcher checks for people spamming text stuff.
 */
class TextSpamWatcher extends BaseWatcher {
    /**
     * If this watcher uses bypass rules.
     */
    usesBypassRules = true;

    /**
     * The methods this watcher should listen on.
     */
    methods: Array<keyof Discord.ClientEvents> = ['message', 'messageUpdate'];

    /**
     * The strings that this watcher should remove.
     */
    strings = [
        'this is cooldog',
        'this is memedog',
        'this is memecat',
        'this is trolldog',
        'this is screwoff',
        'chrisopeer davies',
        'jessica davies',
        'dming inappropriate photos of underage children',
        'bots are joining servers and sending mass',
        'kazuto kirigia',
        'colyn_9',
        'teenagers would cry',
        'little girl called clarissa',
        'become part of the ugandan squad',
        'discord is supposed to be closing down',
        'with the tag #1828',
        'copy and paste him in every discord server',
        'giving away my skins',
    ];

    /**
     * Run the watcher with the given parameters.
     */
    async action(method: keyof Discord.ClientEvents, ...args: Discord.ClientEvents['message' | 'messageUpdate']) {
        const message = args[1] || args[0];

        if (message.cleanContent) {
            const rulesChannel = this.bot.client.channels.cache.find(
                (channel) => channel.id === config.get('channels.rules'),
            );

            const cleanMessage = message.cleanContent.toLowerCase();

            if (this.strings.some((string) => cleanMessage.includes(string))) {
                const warningMessage = await message.reply(
                    `Please read the ${rulesChannel} channel. Spamming or encouraging spamming is not allowed.`,
                );

                this.addWarningToUser(message);

                message.delete({ reason: 'Posting spam text' });
                warningMessage.delete({ timeout: 60000 });
            }
        }
    }
}

export default TextSpamWatcher;
