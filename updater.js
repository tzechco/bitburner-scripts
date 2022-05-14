/** @param {NS} ns */
export async function main(ns) {
    if (ns.args[0] == 'update') {
        let files = ['autohack.js', 'rootall.js', '/runners/hack.js', '/runners/grow.js', '/runners/weaken.js'];
        for (let i = 0; i < files.length; ++i) {
            ns.tprint(`Downloading ${files[i]}`);
            await ns.wget(`https://raw.githubusercontent.com/tzechco/bitburner-scripts/main/${files[i]}`, files[i]);
        }
        if (!ns.fileExists('launchOptions.txt')) {
            let autoUpdate = await ns.prompt('Would you like enable auto updates?');
            await ns.write('launchOptions.txt', `{"autoUpdate":${autoUpdate}}`, 'w');
        }
        return ns.tprint('Update Complete!');
    }
    else if (ns.args[0]) {
        await ns.wget(`https://raw.githubusercontent.com/tzechco/bitburner-scripts/main/${ns.args[0]}`, ns.args[0]);
        return ns.exec(ns.args[0], 'home', 1, 'skip');
    }
    ns.tprint('Downloading updater.js')
    await ns.wget(`https://raw.githubusercontent.com/tzechco/bitburner-scripts/main/updater.js`, 'updater.js')
    if (Math.floor((ns.getServerMaxRam('home') - ns.getServerUsedRam('home')) / ns.getScriptRam('updater.js')) > 0) {
        return ns.exec('updater.js', 'home', 1, 'update');
    }
    ns.tprint('Not enough ram to complete update.')
}
