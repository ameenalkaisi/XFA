// e.g., array_safe_equals([[1, 2]], [[1, 2]]) goes inside of the outer array, then inside the inner array

// then it sees that 1 == 1 and 2 == 2 and returns true all the way out
export function array_safe_equals(a: any, b: any): boolean {
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a === b) return true;
		if (a == null || b == null) return false;
		if (a.length !== b.length) return false;

		// If you don't care about the order of the elements inside
		// the array, you should sort both arrays here.
		// Please note that calling sort on an array will modify that array.
		// you might want to clone your array first.

		for (let i = 0; i < a.length; ++i) {
			if (!array_safe_equals(a[i], b[i])) return false;
		}

		return true;
	} else return a === b;
}

export function array_safe_includes(array: any[], element: any): boolean {
	for (let i = 0; i < array.length; ++i)
		if (array_safe_equals(array[i], element)) return true;

	return false;
}

export function mapSafeReplacer(_key: any, value: any) {
	if (value instanceof Map) {
		return {
			dataType: 'Map',
			value: Array.from(value.entries()), // or with spread: value: [...value]
		};
	} else {
		return value;
	}
}

export function mapSafeReviver(_key: any, value: any) {
	if (typeof value === 'object' && value !== null) {
		if (value.dataType === 'Map') {
			return new Map(value.value);
		}
	}
	return value;
}

export interface IQueue<T> {
	enqueue(item: T): void;
	dequeue(): T | undefined;
	size(): number;
}

export class Queue<T> implements IQueue<T> {
	private storage: T[] = [];

	constructor(private capacity: number = Infinity) { }

	enqueue(item: T): void {
		if (this.size() === this.capacity) {
			throw Error("Queue has reached max capacity, you cannot add more items");
		}

		this.storage.push(item);
	}

	dequeue(): T | undefined {
		return this.storage.shift();
	}

	size(): number {
		return this.storage.length;
	}
}
