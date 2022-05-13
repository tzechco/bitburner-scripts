/** @param {NS} ns */
export async function main(ns) {
    if (ns.args[0] == 'launch') {
        await ns.wget('https://raw.githubusercontent.com/tzechco/bitburner-scripts/main/autohack.js', '/temp/autohack.js')
        if (ns.read('/temp/autohack.js') !== ns.read('autohack.js')) {
            await ns.mv('home', 'autohack.js', '/temp/autohack.js')
            return ns.exec('autohack.js', 'home', 1, 'skip');
        }
    }
    let files = ['autohack.js', 'updater.js', 'runners/hack.js', 'runners/grow.js', 'runners/weaken.js']
    files.forEach((file) => {
        await ns.wget(`https://raw.githubusercontent.com/tzechco/bitburner-scripts/main/${file}`, file)
    })
}
