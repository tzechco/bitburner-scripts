/** @param {NS} ns */
export async function main(ns) {
    if (ns.args[0]) {
        await ns.wget(`https://raw.githubusercontent.com/tzechco/bitburner-scripts/main/${ns.args[0]}`, ns.args[0]);
        return ns.exec(ns.args[0], 'home', 1, 'skip');
    }
    let files = ['autohack.js', 'updater.js', 'rootall.js', '/runners/hack.js', '/runners/grow.js', '/runners/weaken.js'];
    for (let i = 0; i < files.length; ++i) {
        ns.tprint(`Downloading ${files[i]}`);
        await ns.wget(`https://raw.githubusercontent.com/tzechco/bitburner-scripts/main/${files[i]}`, files[i]);
    }
    if (!ns.fileExists('launchOptions.txt')) {
        let autoUpdate = await ns.prompt('Would you like enable auto updates?');
        await ns.write('launchOptions.txt', `{"autoUpdate":${autoUpdate}}`, 'w');
    }
    ns.tprint('Update Complete!');
}
