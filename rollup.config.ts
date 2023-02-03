import { defineConfig } from "rollup";
import { aliucordPlugin, makeManifest, makePluginZip } from "@aliucord/rollup-plugin";

export default defineConfig({
    input: `${process.env.plugin}/index.ts`,
    output: {
        file: `dist/${process.env.plugin}.js`
    },
    plugins: [
        aliucordPlugin({
            autoDeploy: !!process.env.ROLLUP_WATCH,
            hermesPath: "node_modules/.pnpm/@aliucord+hermesc@0.70.6-aliucord-2/node_modules/@aliucord/hermesc"
        }),
        makeManifest({
            baseManifest: "baseManifest.json",
            manifest: `${process.env.plugin}/manifest.json`
	}),
        makePluginZip()
    ]
});
//node_modules\.pnpm\@aliucord+hermesc@0.70.6-aliucord-2\node_modules\@aliucord\hermesc\win64-bin