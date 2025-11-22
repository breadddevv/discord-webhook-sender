import axios from 'axios';
import chalk from 'chalk';
import consola from 'consola';
import { select, spinner } from '@clack/prompts';
import * as fs from "fs";
import path from 'path';

const currentdir = path.join(__dirname, "../../../")
console.log(currentdir)

interface user {
    id: string,
    username: string,
    discriminator: string,
    global_name: string,
    bot: boolean,
    system: boolean,
}

export interface webhook {
    id: string,
    guild_id: number,
    channel_id: string,
    user: string,
    avatar: user,
    token: string,
    name: string
}

const messagebind = path.join(currentdir, "../message.json")

async function checkAlive(wID: string) {
    const s = spinner()
    s.start('Checking if the webhook exists')
    const regex = /https:\/\/discord\.com\/api\/webhooks\/(\d+)\/([\w-]+)/;
    const match = wID.match(regex);
    
    if (!match) {
        consola.error(chalk.red('Invalid token, make sure you\'ve inserted the right Discord webhook URL.'));
        return false;
    }

    const [fullUrl, webhookID, token] = match;

    // Use Axios with 'validateStatus' to prevent it from throwing on 404
    const response = await axios.get<webhook>(
        `https://discord.com/api/v10/webhooks/${webhookID}/${token}`,
        {
            validateStatus: () => true
        }
    );

    if (response.status === 404) {
        s.stop(chalk.red('Webhook not found'))
        consola.warn(chalk.yellow('Webhook not found (404)'));
        return false;
    } else if (response.status === 200) {
        s.stop(chalk.green(`Webhook with name ${response.data.name} has been found.`));
        return response.data;
    } else {
        consola.error(chalk.red(`Unexpected status code: ${response.status}`));
        return false;
    }
}

export async function login(wId: string) {
    await checkAlive(wId);
    const action = await select({
        message: 'Pick an option.',
        options: [
            { value: 'formatmessage', label: 'Format Message' },
            { value: 'sendmessage', label: 'Send Message' },
            { value: 'messagebinds', label: 'View message binds' },
            { value: 'logout', label: 'Logout'}
        ],
    });

    switch (action) {
        case "formatmessage": {
            if (!fs.existsSync(messagebind)) {
                fs.writeFileSync(messagebind, JSON.stringify({}, null, 2));
            }
        }
    }
}