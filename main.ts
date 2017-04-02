'use strict';

import * as debug from 'debug';
import * as nconf from 'nconf';
import * as Telegraf from 'telegraf';

import { createCommand } from './lib/create-command';
import { Start } from './lib/commands/start';
import { Hey } from './lib/commands/hey';

const D: debug.IDebugger = debug('app');

nconf
	.argv()
	.env()
	.file({ file: 'config.json' });

const bot: Telegraf = new Telegraf(nconf.get('token'));

bot.command(['start'], createCommand(Start));
bot.hears(Hey.ear, createCommand(Hey));
bot.startPolling();

D('app has started');
