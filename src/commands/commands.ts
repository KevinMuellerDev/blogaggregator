import { setUser } from "../config";

type CmdName = string;

type CommandHandler = (cmdName: string, ...args: string[]) => void;

type CommandsRegistry = Record<CmdName, CommandHandler>

const commandsRegistry: CommandsRegistry = {}

function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0)
        throw new Error('the login handler expects a single argument, the username.');
    setUser(args[0]);
    console.log(`User ${args[0]} has been set.`)
}

function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler
}

function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {

}