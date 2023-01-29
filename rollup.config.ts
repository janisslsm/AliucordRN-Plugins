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
            hermesPath: "node_modules/.pnpm/hermes-engine-cli@0.12.0/node_modules/hermes-engine-cli"
        }),
        makeManifest({
            baseManifest: "baseManifest.json",
            manifest: `${process.env.plugin}/manifest.json`
	}),
        makePluginZip()
    ]
});
