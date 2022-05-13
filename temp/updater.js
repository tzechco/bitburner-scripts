/** @param {NS} ns */
export async function main(ns) {
    let files = ['autohack.js', '/runners/hack.js', '/runners/grow.js', '/runners/weaken.js'];
    for (let i = 0; i < files.length; ++i) {
        ns.tprintf(`Downloading ${files[i]}`);
        await ns.rm(files[i]);
        await ns.wget(`https://raw.githubusercontent.com/tzechco/bitburner-scripts/main/${files[i]}`, files[i]);
    }
}
