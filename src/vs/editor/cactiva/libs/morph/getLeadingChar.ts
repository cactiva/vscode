export function getLeadingChar(str: string, pos: number) {
	let loop = true;
	let i = pos;
	while (loop) {
		if (i <= 0) loop = false;
		i--;

		if (str[i] === '\n') {
			loop = false;
			return pos - i;
		}
	}
	return 0;
}
