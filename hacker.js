/** @param {NS} ns */
export async function main(ns) {
	let scanned = [];
	let bestHackMoney = 0;
	let bestHack;
	let serverTop = ns.scan("home")
	let serverBottom = ns.scan("home")
	while (serverTop.length > 0) {
		scanned = ns.scan(serverTop[0]);
		scanned.splice("home", 1);
		serverBottom.push(serverTop[0]);
		serverTop.shift();
		serverTop = [...serverTop, ...scanned];
	}
	serverBottom = [...new Set(serverBottom)];
	async function doThing(file) {
		if (Math.floor((ns.getServerMaxRam('home') - ns.getServerUsedRam('home')) / ns.getScriptRam(file)) > 0) {
			ns.exec(file, 'home', Math.floor((ns.getServerMaxRam('home') - ns.getServerUsedRam('home')) / ns.getScriptRam(file)), bestHack);
		}
		for (let index = 0; index < serverBottom.length; ++index) {
			if (!ns.fileExists(file, serverBottom[index])) {
				await ns.scp(file, "home", serverBottom[index]);
			}
			if (Math.floor((ns.getServerMaxRam(serverBottom[index]) - ns.getServerUsedRam(serverBottom[index])) / ns.getScriptRam(file)) > 0) {
				ns.exec(file, serverBottom[index], Math.floor((ns.getServerMaxRam(serverBottom[index]) - ns.getServerUsedRam(serverBottom[index])) / ns.getScriptRam(file)), bestHack);
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
				if ((Math.floor((ns.getServerMaxRam(serverBottom[index]) - ns.getServerUsedRam(serverBottom[index])) / ns.getScriptRam('grow.js')) > 0) && (!ns.getPurchasedServers().includes(serverBottom[index]))) {
					ns.exec('grow.js', serverBottom[index], Math.floor((ns.getServerMaxRam(serverBottom[index]) - ns.getServerUsedRam(serverBottom[index])) / ns.getScriptRam('grow.js')), serverBottom[index]);
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
			await doThing('grow.js');
			await ns.sleep(1000);
			await hackTime();
		} else if (ns.getServerMinSecurityLevel(bestHack) !== ns.getServerSecurityLevel(bestHack)) {
			await doThing('weaken.js');
			await ns.sleep(1000);
			await hackTime();
		} else {
			await hack();
		}
	}
	async function hack() {
		if (ns.getServerMoneyAvailable(bestHack) > 0) {
			await doThing('hack.js');
			await ns.sleep(1000);
			await hack();
		} else {
			await getBestHack();
		}
	}
	await getBestHack();
}
