import { z } from 'zod';

export const CustomMapSchema = z.object ({
	keys: z.string().array(),
	values: z.string().array().array()
})

export default class CustomMap {
	values: string[][];
	keys: string[];

	constructor() {
		this.values = [];
		this.keys = [];
	}

	get(k: string): string[] {
		return this.values[this.keys.indexOf(k)];
	}

	has(key: string): boolean {
		return this.keys.indexOf(key) !== -1;
	}

	set(key: string, val: string[]): void {
		if (this.keys.indexOf(key) === -1) {
			this.keys.push(key);
			this.values.push(val);
		} else {
			this.values[this.keys.indexOf(key)] = val;
		}
	}

	forEach(nodeFunction: (value: string[], key: string) => void) {
		for(let i: number = 0; i < this.keys.length; ++i) {
			let curValue: string[] = this.values[i];
			let curKey: string = this.keys[i];

			nodeFunction(curValue, curKey);
		}
	}
}
