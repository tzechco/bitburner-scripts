/** @param {NS} ns */
export async function main(ns) {
	await ns.wget('https://raw.githubusercontent.com/tzechco/bitburner-scripts/main/downloader.js', 'downloader.js');
}
