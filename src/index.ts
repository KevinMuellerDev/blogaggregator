import { exit } from 'process';
import { setUser, readConfig } from './config'

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
    if (!registry[cmdName])
        throw new Error('the given command doesnt exist.')
    registry[cmdName](cmdName, ...args)
}


function main() {
    registerCommand(commandsRegistry, 'login', handlerLogin);
    const input = process.argv.slice(2);

    if (input.length === 0) {
        console.log('You have to submit at least one argument.')
        process.exit(1)
    }
    const cmdName = input[0]
    const argsArray = input.slice(1)

    runCommand(commandsRegistry, cmdName, ...argsArray);
}

main();