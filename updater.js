/** @param {NS} ns */
export async function main(ns) {
    if (ns.args[0]) {
        await ns.wget(`https://raw.githubusercontent.com/tzechco/bitburner-scripts/main/${ns.args[0]}`, `/temp/${ns.args[0]}`);
        await ns.mv('home', ns.args[0], `/temp/${ns.args[0]}`);
        return ns.exec(ns.args[0], 'home', 1, 'skip');
    }
    await ns.wget('https://raw.githubusercontent.com/tzechco/bitburner-scripts/main/temp/updater.js', '/temp/updater.js');
    await ns.exec('/temp/updater.js', 'home');
    while (ns.getRunningScript('/temp/updater.js')) {
        await ns.sleep(1000);
    }
    ns.rm('/temp/updater.js');
}
