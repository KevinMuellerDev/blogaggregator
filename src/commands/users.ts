import { readConfig, setUser } from "../config";
import { createUser, deleteUsers, getUser, getUsers } from "src/lib/db/queries/users";

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

/**
 * Handles the user registration command.
 *
 * This function registers a new user with the provided username.
 * It expects exactly one argument (the username). If the user already exists,
 * it throws an error. Otherwise, it creates the user, sets the user as active,
 * and logs the creation.
 *
 * @param cmdName - The name of the command being executed.
 * @param args - The arguments passed to the command. Should contain exactly one element: the username.
 * @throws Will throw an error if the number of arguments is not exactly one.
 * @throws Will throw an error if the user already exists.
 */
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

/**
 * Handles the reset operation for the users table.
 * 
 * This function attempts to delete all users by calling `deleteUsers()`.
 * If successful, it logs a confirmation message to the console.
 * If an error occurs during the deletion process, it throws a new error indicating the reset was not successful.
 *
 * @param cmdName - The name of the command invoking the reset operation.
 * @throws {Error} If the reset of the users table is not successful.
 */
export async function handlerReset(_: string) {
    try {
        await deleteUsers();
        console.log('Table users has been reset.')
    } catch (err) {
        throw new Error('Reset of users table was not successful');
    }
}


export async function handlerUsers(cmdName: string) {
    try {
        const users = await getUsers();
        const config = readConfig();
        users.forEach((user) => {
            console.log(`* ${user.name} ${config.currentUserName === user.name ? '(current)' : ''}`)
        })
    } catch (error) {
        throw new Error('There are no users in the Database');
    }
}