/** @param {NS} ns */
export async function main(ns) {
    if(ns.args[0] == 'ow') {
        await ns.mv('home', 'updater.js', '/temp/updater.js');
        await ns.rm('/temp/updater.js');
        ns.tprintf('Updates Complete!');

    } else if (ns.args[0]) {
        await ns.wget(`https://raw.githubusercontent.com/tzechco/bitburner-scripts/main/${ns.args[0]}`, `/temp/${ns.args[0]}`);
        if (ns.read(ns.args[0]) !== ns.read(`/temp/${ns.args[0]}`)) {
            await ns.mv('home', ns.args[0], `/temp/${ns.args[0]}`);
            return ns.exec(ns.args[0], 'home', 1, 'skip');
        }
    }
    let files = ['/autohack.js', '/updater.js', '/runners/hack.js', '/runners/grow.js', '/runners/weaken.js'];
    for (let i = 0; i < files.length; ++i) {
        if(files[i] == '/updater.js') {
            ns.tprintf(`Downloading ${files[i]}`)
            await ns.wget(`https://raw.githubusercontent.com/tzechco/bitburner-scripts/main${files[i]}`, `/temp${files[i]}`);
        }
        ns.tprintf(`Downloading ${files[i]}`)
        await ns.wget(`https://raw.githubusercontent.com/tzechco/bitburner-scripts/main${files[i]}`, files[i]);
    }
    ns.exec('/temp/updater.js', 'home', 1, 'ow');
}
