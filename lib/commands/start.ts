'use strict';

import * as debug from 'debug';
import { Context } from 'telegraf';

import { Command } from '../command';

export { Start }

const D: debug.IDebugger = debug('commands:start');

class Start extends Command {

	public constructor(ctx: Context) {

		super(ctx);
	}

	public exec(): void {

		D('let us greet %o', this.ctx.from.username);

		this.ctx.reply(`Hey, @${this.ctx.from.username}!`);
	}
}
