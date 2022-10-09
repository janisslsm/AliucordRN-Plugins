import { Plugin } from 'aliucord/entities';
import { getByProps } from 'aliucord/metro';
import { after, before, callOriginal } from "aliucord/utils/patcher";

const [{ getEmojiURL }, usability, { getChannel }, Messages] = [
  getByProps('getEmojiURL'),
  getByProps('canUseEmojisEverywhere', 'canUseAnimatedEmojis'),
  getByProps('getChannel'),
  getByProps('receiveMessage', 'sendMessage'),
];

type Emoji = {
  roles: any[];
  require_colons: boolean;
  name: string;
  managed: boolean;
  id: string;
  available: boolean;
  animated: boolean;
  url: string;
  allNamesString: string;
  guildId: string;
};

export default class FreeNitro extends Plugin {
    public async start() {
        after(usability, 'canUseEmojisEverywhere', (ctx) => { ctx.result = true; });
        after(usability, 'canUseAnimatedEmojis', (ctx) => { ctx.result = true; });
        before(Messages, 'sendMessage', (ctx) => {
            const [channelId, message] = ctx.args;

            const channel = getChannel(channelId);
            message.validNonShortcutEmojis.forEach((e: Emoji, i: number) => {
                if (e.guildId !== channel.guildId) {
                    let url = getEmojiURL(e).replace('webp', 'png');
                    message.content = message.content.replace(
                        `<${e.animated ? 'a' : ''}:${e.name}:${e.id}>`,
                        url.substring(0, url.indexOf('?size=') + '?size='.length) + "48",
                    );
                    delete message.validNonShortcutEmojis[i];
                }
            });
            message.validNonShortcutEmojis = message.validNonShortcutEmojis.filter((e: Emoji) => e);
        });
    }
}