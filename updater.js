/** @param {NS} ns */
export async function main(ns) {
    if (ns.args[0]) {
        await ns.wget(`https://raw.githubusercontent.com/tzechco/bitburner-scripts/main/${ns.args[0]}`, `/temp/${ns.args[0]}`)
        if (ns.read(ns.args[0]) !== ns.read(`/temp/${ns.args[0]}`)) {
            await ns.mv('home', ns.args[0], `/temp/${ns.args[0]}`)
            return ns.exec(ns.args[0], 'home', 1, 'skip');
        }
    }
    let files = ['autohack.js', 'updater.js', 'runners/hack.js', 'runners/grow.js', 'runners/weaken.js']
    files.forEach((file) => {
        await ns.wget(`https://raw.githubusercontent.com/tzechco/bitburner-scripts/main/${file}`, file)
    })
}
