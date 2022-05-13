/** @param {NS} ns */
export async function main(ns) {
	if (ns.args[0] !== 'skip') {
		let config = JSON.parse(ns.read('launchOptions.txt'));
		if (config.autoUpdate == true) {
			return ns.exec('updater.js', 'home', 1, 'autohack.js')
		}
	}
	let scanned = [];
	let bestHackMoney = 0;
	let bestHack;
	let serverTop = ns.scan("home");
	let serverBottom = ns.scan("home");
	while (serverTop.length > 0) {
		scanned = ns.scan(serverTop[0]);
		scanned.splice("home", 1);
		serverBottom.push(serverTop[0]);
		serverTop.shift();
		serverTop = [...serverTop, ...scanned];
	}
	serverBottom = [...new Set(serverBottom)];
	async function execute(file) {
		if (Math.floor((ns.getServerMaxRam('home') - ns.getServerUsedRam('home')) / ns.getScriptRam(`/runners/${file}`)) > 0) {
			ns.exec(`/runners/${file}`, 'home', Math.floor((ns.getServerMaxRam('home') - ns.getServerUsedRam('home')) / ns.getScriptRam(`/runners/${file}`)), bestHack);
		}
		for (let i = 0; i < serverBottom.length; ++i) {
			if (!ns.fileExists(`/runners/${file}`, serverBottom[i])) {
				await ns.scp(`/runners/${file}`, "home", serverBottom[i]);
			}
			if (Math.floor((ns.getServerMaxRam(serverBottom[i]) - ns.getServerUsedRam(serverBottom[i])) / ns.getScriptRam(`/runners/${file}`)) > 0) {
				ns.exec(`/runners/${file}`, serverBottom[i], Math.floor((ns.getServerMaxRam(serverBottom[i]) - ns.getServerUsedRam(serverBottom[i])) / ns.getScriptRam(`/runners/${file}`)), bestHack);
			}
		}
		while (ns.getRunningScript(file)) {
			await ns.sleep(1000);
		}
	}
	async function getBestServer() {
		for (let i = 0; i < serverBottom.length; ++i) {
			if ((ns.hasRootAccess(serverBottom[i]) == true) && (ns.getServerRequiredHackingLevel(serverBottom[i]) <= ns.getHackingLevel())) {
				if (ns.getServerMoneyAvailable(serverBottom[i]) > bestHackMoney) {
					bestHackMoney = ns.getServerMoneyAvailable(serverBottom[i]);
					bestHack = serverBottom[i];
				}
			}
		}
		if (bestHackMoney == 0) {
			for (let i = 0; i < serverBottom.length; ++i) {
				if ((Math.floor((ns.getServerMaxRam(serverBottom[i]) - ns.getServerUsedRam(serverBottom[i])) / ns.getScriptRam('/runners/grow.js')) > 0) && (!ns.getPurchasedServers().includes(serverBottom[i]))) {
					ns.exec('/runners/grow.js', serverBottom[i], Math.floor((ns.getServerMaxRam(serverBottom[i]) - ns.getServerUsedRam(serverBottom[i])) / ns.getScriptRam('/runners/grow.js')), serverBottom[i]);
				}
			}
			while (ns.getRunningScript('grow.js')) {
				await ns.sleep(1000);
			}
			await ns.sleep(1000);
			await getBestServer();
		} else {
			await prepare();
		}
	}
	async function prepare() {
		if (ns.getServerMoneyAvailable(bestHack) !== ns.getServerMaxMoney(bestHack)) {
			await execute('grow.js');
			await ns.sleep(1000);
			await prepare();
		} else if (ns.getServerMinSecurityLevel(bestHack) !== ns.getServerSecurityLevel(bestHack)) {
			await execute('weaken.js');
			await ns.sleep(1000);
			await prepare();
		} else {
			await hack();
		}
	}
	async function hack() {
		if (ns.getServerMoneyAvailable(bestHack) > 0) {
			await execute('hack.js');
			await ns.sleep(1000);
			await hack();
		} else {
			await getBestServer();
		}
	}
	await getBestServer();
}
