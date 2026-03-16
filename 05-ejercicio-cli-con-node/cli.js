import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

if(!process.permission) {
    console.error('This script must be run with the Node.js Permission Model enabled.\nUse: node --permission --allow-fs-read="." cli.js');
    process.exit(1);
}

if(!process.permission.has('fs.read', '.')) {
    console.error('Permission denied: fs.read is required. Run with --allow-fs-read="."');
    process.exit(1);
}

const args = process.argv.slice(2);
const dir = args.find(arg => !arg.startsWith('--')) ?? '.';
const asc = args.includes('--asc');
const desc = args.includes('--desc');
const justFiles = args.includes('--files');
const justFolders = args.includes('--folders');

const formatBytes = function(bytes) {
    if(bytes < 1024) return bytes + ' Bytes';
    if(bytes < 1024 * 1024) return bytes / 1024 + ' KB';
    if(bytes < 1024 * 1024 * 1024) return bytes / 1024 / 1024 + ' MB';
    return bytes / 1024 / 1024 / 1024 + ' GB';
}

const files = await readdir(dir);

const entries = await Promise.all(
    files.map(async(name) => {
        const fullPath = join(dir, name);
        const info = await stat(fullPath);

        return {
            name,
            size: formatBytes(info.size),
            isDirectory: info.isDirectory()
        }
    })
)

entries.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    const nameCompare = a.name.localeCompare(b.name);

    if (desc) return -nameCompare; // Z - A
    return nameCompare; // A - Z
});

if (justFiles) {
    const filteredEntries = entries.filter(entry => !entry.isDirectory);
    entries.length = 0;
    entries.push(...filteredEntries);
}

if (justFolders) {
    const filteredEntries = entries.filter(entry => entry.isDirectory);
    entries.length = 0;
    entries.push(...filteredEntries);
}

entries.forEach(entry => {
    if (justFiles && entry.isDirectory) return;
    if (justFolders && !entry.isDirectory) return;
    
    const icon = entry.isDirectory ? '📁' : '📄';
    const size = entry.isDirectory ? '-' : `${entry.size}`;
    console.log(`${icon} ${entry.name.padEnd(20)} ${size}`);
});