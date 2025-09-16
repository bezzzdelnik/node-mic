const path = require('path');
const fs = require('fs/promises');
const shell = require('shelljs');
const fetch = (...args) => import('node-fetch').then(m => m.default(...args));
const fflate = require('fflate');
const {
    SOX_MACOSX_OUTPUT_BIN,
    SOX_MACOSX_OUTPUT_DIR,
    SOX_MACOSX_URL,
    SOX_WIN32_OUTPUT_BIN,
    SOX_WIN32_OUTPUT_DIR,
    SOX_WIN32_URL,
    exists,
    isMac,
    isWindows,
} = require('./constants');

function unzip(buffer) {
    const unzipper = new fflate.Unzip();
    unzipper.register(fflate.UnzipInflate);
    return new Promise((resolve, reject) => {
        fflate.unzip(buffer, (err, unzipped) => {
            if (err) {
                reject(err);
            } else {
                resolve(unzipped);
            }
        });
    });
}

async function downloadZip(url, dir) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const fileBuffer = new Uint8Array(buffer);

    const files = await unzip(fileBuffer);

    await fs.mkdir(dir);

    for (const [key, value] of Object.entries(files)) {
        const basename = path.basename(key);
        const data = Buffer.from(value);
        const filename = path.resolve(dir, basename);
        await fs.writeFile(filename, data);
    }
}

async function installMac() {
    if (shell.which('rec')) {
        return;
    }

    if (await exists(SOX_MACOSX_OUTPUT_BIN)) {
        return;
    }

    const brew = shell.which('brew');
    if (brew) {
        const ret = shell.exec('brew install sox');
        if (ret.code === 0) {
            return;
        }
    }

    try {
        await downloadZip(SOX_MACOSX_URL, SOX_MACOSX_OUTPUT_DIR);
        return;
    } catch (err) {
        shell.echo(`Error downloading sox: ${err.message}`);
    }

    shell.echo('Failed to download SoX');
    shell.exit(1);
}

async function installWindows() {
    if (shell.which('sox')) {
        return;
    }

    if (await exists(SOX_WIN32_OUTPUT_BIN)) {
        return;
    }

    try {
        await downloadZip(SOX_WIN32_URL, SOX_WIN32_OUTPUT_DIR);
        return;
    } catch (err) {
        shell.echo(`Error downloading sox: ${err.message}`);
    }

    shell.echo('Failed to download SoX');
    shell.exit(1);
}

async function installLinux() {
    if (shell.which('arecord')) {
        return;
    }

    shell.echo('---------------------------------------------------------');
    shell.echo('');
    shell.echo('arecord not found');
    shell.echo('');
    shell.echo('Make sure you install alsa-tools before running node-mic!');
    shell.echo('');
    shell.echo('---------------------------------------------------------');
}

async function install() {
    if (isWindows) {
        await installWindows();
    } else if (isMac) {
        await installMac();
    } else {
        await installLinux();
    }
}

install().catch(err => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
});
