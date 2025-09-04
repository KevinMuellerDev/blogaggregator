import { create } from "domain";
import { setUser } from "../config";
import { createUser, getUser } from "src/lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }

    const userName = args[0];
    const userDb = await getUser(userName)

    if (!userDb) {
        throw new Error('This users does not exist.')
    }

    setUser(userName);
    console.log("User switched successfully!");
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }
    const userName = args[0];

    const found = await getUser(userName);

    if (found) {
        throw new Error('User already exists.')
    }

    const createdUser = await createUser(userName);
    setUser(userName);
    console.log(`User ${userName} was created.`)
    console.log(createdUser);

}