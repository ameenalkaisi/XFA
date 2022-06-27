// equality where it keeps going inside arrays to evaluate truth
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
	for(let i = 0; i < array.length; ++i)
		if(array_safe_equals(array[i], element))
		   return true;

	return false;
}
