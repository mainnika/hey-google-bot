'use strict';

import * as debug from 'debug';
import { Context } from 'telegraf';

export { Command }

const D: debug.IDebugger = debug('command');

abstract class Command {

	protected user: any;

	public constructor(
		protected ctx: Context
	) {
		D('handle incoming message from %o', this.ctx.from.username);
	}

	public abstract exec(): void;

	private loadUser() {

		this.user = this.ctx.from;

		D('user was loaded, %o', this.user);
	}
}
