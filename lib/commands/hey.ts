'use strict';

import * as debug from 'debug';
import * as https from 'https';
import * as http from 'http';
import { defer, Deferred } from 'when';
import { call } from 'when/node';
import { Context } from 'telegraf';

import { Command } from '../command';

export { Hey }

const D: debug.IDebugger = debug('commands:hey');

class Hey extends Command {

	public static ear(incoming: string): boolean {

		const filtered = incoming
			.toLowerCase()
			.replace(/[^a-zа-я]/g, '');

		switch (true) {
			case filtered.startsWith('haygoogle'):
			case filtered.startsWith('hellogoogle'):
			case filtered.startsWith('heygoogle'):
			case filtered.startsWith('хайгугл'):
			case filtered.startsWith('хейгугл'):
			case filtered.startsWith('хеллогугл'):
				return true;

			default:
				return false;
		}
	}

	private static URL: string = 'https://suggestqueries.google.com/complete/search?output=chrome&q='

	public constructor(ctx: Context) {

		if (ctx.updateType !== 'message') {
			throw new Error('invalid update type');
		}

		super(ctx);
	}

	public async exec(): Promise<void> {

		D('message from %o was hear', this.ctx.from.username);

		const query: string = this.ctx.message.text
			.split(',')
			.splice(1)
			.join(',')
			.trim();

		if (!query.length) {
			D('can not parse query from %o', this.ctx.from.username);
			this.ctx.reply(`Hey, @${this.ctx.from.username}, you may put the request after a comma!`, { reply_to_message_id: this.ctx.message.message_id });
			return;
		}

		D('fetch query %o', query);

		const deferred: Deferred<string> = defer<string>();

		https
			.get(`${Hey.URL}${encodeURIComponent(query)}`, (res: http.ClientResponse) => {

				const chunks: string[] = [];

				res.setEncoding('utf8');
				res.on('data', (chunk: string) => chunks.push(chunk));
				res.on('end', () => deferred.resolve(chunks.join('')));
			})
			.on('error', deferred.reject.bind(deferred));

		const [input, output]: [string, string[]] = JSON.parse(await deferred.promise);

		D('query %o was answered with %i results', output.length);

		if (!Array.isArray(output) || !output.length) {
			this.ctx.reply(`You are boring, @${this.ctx.from.username}…`, { reply_to_message_id: this.ctx.message.message_id });
			return;
		}

		const random: string = output[Math.trunc(Math.random() * output.length)];

		D('choose %o for reply', random);

		const [head, tail]: [string, string] = [
			random.charAt(0).toUpperCase(),
			random.slice(1),
		];

		this.ctx.reply(`${head}${tail}, @${this.ctx.from.username}?`, { reply_to_message_id: this.ctx.message.message_id });
	}
}
