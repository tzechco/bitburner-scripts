/** @param {NS} ns */
export async function main(ns) {
	if ((!ns.fileExists('launchOptions.txt')) || (ns.args[0] == 'config')) {
		let autoUpdate = await ns.prompt('Would you like to check for updates on each run?');
		await ns.write('launchOptions.txt', `{"autoUpdate":${autoUpdate}}`, 'w');
	}
	if (ns.args[0] !== 'skip') {
		let config = JSON.parse(ns.read('launchOptions.txt'));
		if (config.autoUpdate == true) {
			return ns.exec('updater.js', 'home', 1, 'launch')
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
	async function doThing(file) {
		if (Math.floor((ns.getServerMaxRam('home') - ns.getServerUsedRam('home')) / ns.getScriptRam(`/runners/${file}`)) > 0) {
			ns.exec(`/runners/${file}`, 'home', Math.floor((ns.getServerMaxRam('home') - ns.getServerUsedRam('home')) / ns.getScriptRam(`/runners/${file}`)), bestHack);
		}
		for (let index = 0; index < serverBottom.length; ++index) {
			if (!ns.fileExists(`/runners/${file}`, serverBottom[index])) {
				await ns.scp(`/runners/${file}`, "home", serverBottom[index]);
			}
			if (Math.floor((ns.getServerMaxRam(serverBottom[index]) - ns.getServerUsedRam(serverBottom[index])) / ns.getScriptRam(`/runners/${file}`)) > 0) {
				ns.exec(`/runners/${file}`, serverBottom[index], Math.floor((ns.getServerMaxRam(serverBottom[index]) - ns.getServerUsedRam(serverBottom[index])) / ns.getScriptRam(`/runners/${file}`)), bestHack);
			}
		}
		while (ns.getRunningScript(file)) {
			await ns.sleep(1000);
		}
	}
	async function getBestHack() {
		for (let index = 0; index < serverBottom.length; ++index) {
			if ((ns.hasRootAccess(serverBottom[index]) == true) && (ns.getServerRequiredHackingLevel(serverBottom[index]) <= ns.getHackingLevel())) {
				if (ns.getServerMoneyAvailable(serverBottom[index]) > bestHackMoney) {
					bestHackMoney = ns.getServerMoneyAvailable(serverBottom[index]);
					bestHack = serverBottom[index];
				}
			}
		}
		if (bestHackMoney == 0) {
			for (let index = 0; index < serverBottom.length; ++index) {
				if ((Math.floor((ns.getServerMaxRam(serverBottom[index]) - ns.getServerUsedRam(serverBottom[index])) / ns.getScriptRam('/runners/grow.js')) > 0) && (!ns.getPurchasedServers().includes(serverBottom[index]))) {
					ns.exec('/runners/grow.js', serverBottom[index], Math.floor((ns.getServerMaxRam(serverBottom[index]) - ns.getServerUsedRam(serverBottom[index])) / ns.getScriptRam('/runners/grow.js')), serverBottom[index]);
				}
			}
			while (ns.getRunningScript('grow.js')) {
				await ns.sleep(1000);
			}
			await ns.sleep(1000);
			await getBestHack();
		} else {
			await hackTime();
		}
	}
	async function hackTime() {
		if (ns.getServerMoneyAvailable(bestHack) !== ns.getServerMaxMoney(bestHack)) {
			await doThing('grow');
			await ns.sleep(1000);
			await hackTime();
		} else if (ns.getServerMinSecurityLevel(bestHack) !== ns.getServerSecurityLevel(bestHack)) {
			await doThing('weaken');
			await ns.sleep(1000);
			await hackTime();
		} else {
			await hack();
		}
	}
	async function hack() {
		if (ns.getServerMoneyAvailable(bestHack) > 0) {
			await doThing('hack');
			await ns.sleep(1000);
			await hack();
		} else {
			await getBestHack();
		}
	}
	await getBestHack();
}
