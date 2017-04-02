'use strict';

import { Context, Middleware } from 'telegraf';

import { Command } from './command';

export const createCommand =
	<T extends Command>(ctor: { new (ctx: Context): T }): Middleware =>
		async (ctx: Context) => {
			try {
				await new ctor(ctx).exec();
			} catch (err) {
				console.error(err);
			};
		}
