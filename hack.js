/** @param {NS} ns */
export async function main(ns) {
	switch (args[0]) {
		case 'hack':
			await ns.hack(ns.args[1]);
			break;
		case 'grow':
			await ns.grow(ns.args[1]);
			break;
		case 'weaken':
			await ns.hack(ns.args[1]);
			break;
	}

}
