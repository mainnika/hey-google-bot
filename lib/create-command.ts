'use strict';

import { Context, Middleware } from 'telegraf';

import { Command } from './command';

export const createCommand =
	<T extends Command>(ctor: { new (ctx: Context): T }): Middleware =>
		(ctx: Context) =>
			new ctor(ctx).exec();
