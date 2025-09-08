import { readConfig } from "src/config";
import { getUser } from "src/lib/db/queries/users";
import type { User } from "src/lib/db/schema";
export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

type UserCommandHandler = (
    cmdName: string,
    user: User,
    ...args: string[]
) => Promise<void>;

type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export async function registerCommand(
    registry: CommandsRegistry,
    cmdName: string,
    handler: CommandHandler,
): Promise<void> {
    registry[cmdName] = handler;
}

export async function runCommand(
    registry: CommandsRegistry,
    cmdName: string,
    ...args: string[]
): Promise<void> {
    const handler = registry[cmdName];
    if (!handler) {
        throw new Error(`Unknown command: ${cmdName}`);
    }

    await handler(cmdName, ...args);
}

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName, ...args) => {
        const config = readConfig();
        if (!config.currentUserName)
            throw new Error('No User is logged in.')
        const user = await getUser(config.currentUserName)
        if (!user)
            throw new Error(`User ${config.currentUserName} not found.`)
        await handler(cmdName, user, ...args)
    }
}
