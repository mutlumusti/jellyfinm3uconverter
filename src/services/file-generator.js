/**
 * File Generator Service
 * Handles creation of M3U and STRM files
 */

import fs from 'fs/promises';
import path from 'path';

/**
 * Ensure directory exists, create if necessary
 * @param {string} dirPath - Directory path
 */
export async function ensureDirectory(dirPath) {
    try {
        await fs.access(dirPath);
    } catch {
        await fs.mkdir(dirPath, { recursive: true });
    }
}

/**
 * Sanitize filename for file system
 * @param {string} name - Original name
 * @returns {string} Sanitized filename
 */
export function sanitizeFilename(name) {
    if (!name) return 'Unknown';

    return name
        // Remove invalid characters
        .replace(/[<>:"/\\|?*]/g, '')
        // Replace multiple spaces with single space
        .replace(/\s+/g, ' ')
        // Remove leading/trailing dots and spaces
        .replace(/^[\s.]+|[\s.]+$/g, '')
        // Limit length
        .substring(0, 200)
        // Fallback for empty result
        || 'Unknown';
}

/**
 * Generate a clean M3U playlist for Live TV
 * @param {Array} entries - Live TV entries
 * @param {string} outputPath - Output file path
 */
export async function generateLiveTVPlaylist(entries, outputPath) {
    const lines = ['#EXTM3U'];

    for (const entry of entries) {
        // Build EXTINF line with preserved attributes
        let extinf = `#EXTINF:${entry.duration}`;

        if (entry.tvgId) {
            extinf += ` tvg-id="${entry.tvgId}"`;
        }
        if (entry.tvgName) {
            extinf += ` tvg-name="${entry.tvgName}"`;
        }
        if (entry.tvgLogo) {
            extinf += ` tvg-logo="${entry.tvgLogo}"`;
        }
        if (entry.groupTitle) {
            extinf += ` group-title="${entry.groupTitle}"`;
        }

        extinf += `,${entry.name}`;

        lines.push(extinf);
        lines.push(entry.url);
    }

    await ensureDirectory(path.dirname(outputPath));
    await fs.writeFile(outputPath, lines.join('\n'), 'utf-8');
}

/**
 * Generate a STRM file for a movie or episode
 * @param {string} streamUrl - Streaming URL
 * @param {string} outputPath - Output file path
 */
export async function generateSTRMFile(streamUrl, outputPath) {
    await ensureDirectory(path.dirname(outputPath));
    await fs.writeFile(outputPath, streamUrl, 'utf-8');
}

/**
 * Generate NFO metadata file for Jellyfin
 * @param {Object} metadata - Content metadata
 * @param {string} outputPath - Output file path
 */
export async function generateNFO(metadata, outputPath) {
    const nfoContent = `<?xml version="1.0" encoding="UTF-8"?>
<${metadata.type}>
  <title>${escapeXml(metadata.title)}</title>
  ${metadata.year ? `<year>${metadata.year}</year>` : ''}
  ${metadata.plot ? `<plot>${escapeXml(metadata.plot)}</plot>` : ''}
  ${metadata.season ? `<season>${metadata.season}</season>` : ''}
  ${metadata.episode ? `<episode>${metadata.episode}</episode>` : ''}
  ${metadata.genres ? metadata.genres.map(g => `<genre>${escapeXml(g)}</genre>`).join('\n  ') : ''}
</${metadata.type}>`;

    await ensureDirectory(path.dirname(outputPath));
    await fs.writeFile(outputPath, nfoContent, 'utf-8');
}

/**
 * Escape XML special characters
 */
function escapeXml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
