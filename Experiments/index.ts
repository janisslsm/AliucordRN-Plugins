import { Plugin } from "aliucord/entities";
import { getByProps, UserStore, FluxDispatcher } from "aliucord/metro";

export default class Experiments extends Plugin {
    public enableExperiments() {
        var actions = getByProps('_actionHandlers')._actionHandlers["_orderedActionHandlers"]["CONNECTION_OPEN"];
        var user = UserStore.getCurrentUser();
        actions.find(n => n.name === "ExperimentStore").actionHandler({
            type: "CONNECTION_OPEN", user: { flags: user.flags |= 1 }, experiments: [],
        });
        actions.find(n => n.name === "DeveloperExperimentStore").actionHandler();
        user.flags &= ~1;
    }
    
    public async start() {
        if (UserStore.getCurrentUser())
            this.enableExperiments()
        else {
            try {
                const handleConnect = () => {
                    FluxDispatcher.unsubscribe("CONNECTION_OPEN", handleConnect);
                    this.enableExperiments()
                }

                FluxDispatcher.subscribe("CONNECTION_OPEN", handleConnect);
            } catch (error) {
                this.logger.error((error as Error).stack)
            }
        }
    }
}