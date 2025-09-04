import { create } from "domain";
import { setUser } from "../config";
import { createUser, deleteUsers, getUser } from "src/lib/db/queries/users";
import { error } from "console";

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

export async function handlerReset(cmdName: string) {
    try {
        const result = await deleteUsers();
        console.log('Table users has been reset.')
    } catch (err) {
        throw new Error('Reset of users table was not successful');
    }
}