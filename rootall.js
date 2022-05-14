/** @param {NS} ns */
export async function main(ns) {
    let scanned = []
    let serverTop = ns.scan("home")
    let serverBottom = ns.scan("home")
    while (serverTop.length > 0) {
        scanned = ns.scan(serverTop[0])
        scanned.splice("home", 1)
        serverBottom.push(serverTop[0])
        serverTop.shift()
        serverTop = [...serverTop, ...scanned]
    }
    serverBottom = [...new Set(serverBottom)]
    for (let i = 0; i < serverBottom.length; ++i) {
        let portsOpen = 0;
        if (ns.fileExists('BruteSSH.exe', 'home')) {
            ns.brutessh(serverBottom[i])
            ++portsOpen
        }
        if (ns.fileExists('FTPCrack.exe', 'home')) {
            ns.ftpcrack(serverBottom[i])
            ++portsOpen
        }
        if (ns.fileExists('relaySMTP.exe', 'home')) {
            ns.relaysmtp(serverBottom[i])
            ++portsOpen
        }
        if (ns.fileExists('HTTPWorm.exe', 'home')) {
            ns.httpworm(serverBottom[i])
            ++portsOpen
        }
        if (ns.fileExists('SQLInject.exe', 'home')) {
            ns.sqlinject(serverBottom[i])
            ++portsOpen
        }
        if ((ns.getServerNumPortsRequired(serverBottom[i]) <= portsOpen) && (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(serverBottom[i]))) {
            ns.nuke(serverBottom[i])
        }
    }
}
