/** @param {NS} ns */
export async function main(ns) {
    if (ns.args[0] == 'launch') {
        await ns.wget('https://raw.githubusercontent.com/tzechco/bitburner-scripts/main/launch.js', '/temp/launch.js')
        if (ns.read('/temp/launch.js') !== ns.read('launch.js')) {
            await ns.mv('home', 'launch.js', '/temp/launch.js')
            return ns.exec('launch.js', 'home', 1, 'skip');
        }
    }
    let files = ['launch.js', 'updater.js', 'runners/hack.js', 'runners/grow.js', 'runners/weaken.js']
    files.forEach((file) => {
        await ns.wget(`https://raw.githubusercontent.com/tzechco/bitburner-scripts/main/${file}`, file)
    })
}