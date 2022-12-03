import { Plugin } from 'aliucord/entities';
import { getByProps } from 'aliucord/metro';
import { after, before } from "aliucord/utils/patcher";

const [{ getEmojiURL }, usability, { getChannel }, Messages] = [
    getByProps('getEmojiURL'),
    getByProps('canUseEmojisEverywhere', 'canUseAnimatedEmojis'),
    getByProps('getChannel'),
    getByProps('receiveMessage', 'sendMessage'),
];

type Emoji = {
    roles: any[],
    require_colons: boolean,
    name: string,
    originalName?: string,
    managed: boolean,
    id: string,
    available: boolean,
    animated: boolean,
    url: string,
    allNamesString: string,
    guildId: string,
    size: number
};

export default class FreeNitro extends Plugin {
    public async start() {
        after(usability, 'canUseEmojisEverywhere', (ctx) => ctx.result = true);
        after(usability, 'canUseAnimatedEmojis', (ctx) => ctx.result = true);
        before(Messages, 'sendMessage', (ctx) => {
            const [channelId, message] = ctx.args;
            const channel = getChannel(channelId);
            message.validNonShortcutEmojis.forEach((e: Emoji, i: number) => {
                if (e.guildId !== channel.guild_id || e.animated) {
                    message.content = message.content.replace(
                        `<${e.animated ? "a" : ""}:${e.originalName ?? e.name}:${e.id}>`,
                        e.url.replace("webp", "png").replace(/size=\d+/, "size=48")
                    );
                    delete message.validNonShortcutEmojis[i];
                }
            });
            message.validNonShortcutEmojis = message.validNonShortcutEmojis.filter((e: Emoji) => e);
        });
    }
}