import { Plugin } from 'aliucord/entities';
import { getByName, Styles } from 'aliucord/metro';
import { after } from "aliucord/utils/patcher";

type FilterOptions = {
    exports?: boolean;
    default?: false;
} | {
    exports?: true;
    default?: true;
};

export default class HideCallButtons extends Plugin {
    public async start() {
        const UserProfileHeader = getByName("UserProfileHeader");
        const UserProfileActions = getByName("UserProfileActions");

        after(UserProfileHeader, "default", (ctx, component) => {
            const { props } = component;
            const { children } = props
            if(children === undefined) return;
            const buttons = children[4]?.props?.children;
            if(buttons === undefined) return;

            delete buttons[1];
            delete buttons[2];

            ctx.result = [component]
        });

        after(UserProfileActions, "default", (ctx, component) => {
            const { props } = component;
            const { children } = props
            if(children === undefined) return;
            const buttons = children?.props?.children[1]?.props?.children;
            if(buttons === undefined) return;

            delete buttons[1];
            delete buttons[2];

            ctx.result = [component]
        });
    }
}