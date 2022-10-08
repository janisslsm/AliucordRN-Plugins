import { Plugin } from "aliucord/entities";
import { getByProps, UserStore } from "aliucord/metro";

export default class Experiments extends Plugin {
    public async start() {
        this.commands.registerCommand({
            name: "experiments",
            description: "Enables Experiments",
            options: [],
            execute: (args, ctx) => {
                var actions = getByProps('_actionHandlers')._actionHandlers["_orderedActionHandlers"]["CONNECTION_OPEN"];
                var user = UserStore.getCurrentUser();
                actions.find(n => n.name === "ExperimentStore").actionHandler({
                    type: "CONNECTION_OPEN", user: { flags: user.flags |= 1 }, experiments: [],
                });
                actions.find(n => n.name === "DeveloperExperimentStore").actionHandler();
                user.flags &= ~1; "done";
            }
        });
    }
}