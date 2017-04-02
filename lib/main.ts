'use strict';

import * as debug from 'debug';
import * as nconf from 'nconf';
import * as path from 'path';
import * as Telegraf from 'telegraf';

import { createCommand } from './create-command';
import { Start } from './commands/start';
import { Hey } from './commands/hey';

const D: debug.IDebugger = debug('app');

nconf
	.argv()
	.env()
	.file({ file: path.join(__dirname, 'config.json') });

const bot: Telegraf = new Telegraf(nconf.get('token'));

bot.command(['start'], createCommand(Start));
bot.hears(Hey.ear, createCommand(Hey));
bot.startPolling();

D('app has started');
