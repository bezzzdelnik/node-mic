// @ts-check
const fsPromises = require('fs/promises');
const os = require('os');
const path = require('path');
const { statSync } = require('fs');

const SOX_WIN32_URL = 'https://downloads.sourceforge.net/project/sox/sox/14.4.2/sox-14.4.2-win32.zip';
const SOX_MACOSX_URL = 'https://downloads.sourceforge.net/project/sox/sox/14.4.2/sox-14.4.2-macosx.zip';

const scriptsDir = __dirname;
const SOX_WIN32_OUTPUT_DIR = path.resolve(scriptsDir, '..', 'sox-win32');
const SOX_WIN32_OUTPUT_BIN = path.resolve(SOX_WIN32_OUTPUT_DIR, 'sox.exe')
const SOX_MACOSX_OUTPUT_DIR = path.resolve(scriptsDir, '..', 'sox-macosx');
const SOX_MACOSX_OUTPUT_BIN = path.resolve(SOX_MACOSX_OUTPUT_DIR, 'rec');

const isMac = os.type() === 'Darwin';
const isWindows = os.type().indexOf('Windows') > -1;

/**
 * Check if a file exists.
 * @param {string} p
 * @returns {Promise<boolean>} `true` if the path exists, `false` otherwise.
 */
async function exists(p) {
    try {
        await fsPromises.stat(p);
        return true;
    } catch (_err) {
        return false;
    }
}

/**
 * Check if a file exists.
 * @param {string} p
 * @returns {boolean} `true` if the path exists, `false` otherwise.
 */
function existsSync(p) {
    try {
        statSync(p);
        return true;
    } catch (_err) {
        return false;
    }
}

module.exports = {
    SOX_WIN32_URL,
    SOX_MACOSX_URL,
    SOX_WIN32_OUTPUT_DIR,
    SOX_WIN32_OUTPUT_BIN,
    SOX_MACOSX_OUTPUT_DIR,
    SOX_MACOSX_OUTPUT_BIN,
    isMac,
    isWindows,
    exists,
    existsSync,
};
