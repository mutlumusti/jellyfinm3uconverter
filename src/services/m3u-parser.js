/**
 * M3U Parser Service
 * Handles downloading, parsing, and categorizing M3U playlists
 */

import axios from 'axios';

/**
 * Download M3U content from URL
 * @param {string} url - M3U URL
 * @param {string} username - Optional username
 * @param {string} password - Optional password
 * @returns {Promise<string>} M3U content
 */
export async function downloadM3U(url, username = '', password = '') {
    let finalUrl = url;

    // Append credentials if provided (Xtream Codes style)
    if (username && password) {
        const urlObj = new URL(url);
        urlObj.searchParams.set('username', username);
        urlObj.searchParams.set('password', password);
        finalUrl = urlObj.toString();
    }

    const response = await axios.get(finalUrl, {
        responseType: 'text',
        timeout: 60000, // 60 second timeout
        headers: {
            'User-Agent': 'VLC/3.0.18 LibVLC/3.0.18'
        }
    });

    return response.data;
}

/**
 * Parse M3U content into structured entries
 * @param {string} content - Raw M3U content
 * @returns {Array} Parsed entries
 */
export function parseM3U(content) {
    const lines = content.split('\n').map(l => l.trim());
    const entries = [];

    let currentEntry = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith('#EXTINF:')) {
            // Parse EXTINF line
            currentEntry = parseExtInf(line);
        } else if (line && !line.startsWith('#') && currentEntry) {
            // This is the URL line
            currentEntry.url = line;
            entries.push(currentEntry);
            currentEntry = null;
        }
    }

    return entries;
}

/**
 * Parse #EXTINF line into structured data
 * @param {string} line - EXTINF line
 * @returns {Object} Parsed entry metadata
 */
function parseExtInf(line) {
    const entry = {
        duration: -1,
        name: '',
        originalName: '',
        groupTitle: '',
        tvgId: '',
        tvgName: '',
        tvgLogo: '',
        attributes: {}
    };

    // Extract duration
    const durationMatch = line.match(/#EXTINF:(-?\d+)/);
    if (durationMatch) {
        entry.duration = parseInt(durationMatch[1]);
    }

    // Extract attributes
    const attrRegex = /(\w+[-\w]*)="([^"]*)"/g;
    let match;
    while ((match = attrRegex.exec(line)) !== null) {
        const key = match[1].toLowerCase().replace(/-/g, '');
        entry.attributes[key] = match[2];

        switch (key) {
            case 'grouptitle':
                entry.groupTitle = match[2];
                break;
            case 'tvgid':
                entry.tvgId = match[2];
                break;
            case 'tvgname':
                entry.tvgName = match[2];
                break;
            case 'tvglogo':
                entry.tvgLogo = match[2];
                break;
        }
    }

    // Extract name (after last comma)
    const nameMatch = line.match(/,(.+)$/);
    if (nameMatch) {
        entry.originalName = nameMatch[1].trim();
        entry.name = cleanName(nameMatch[1].trim());
    }

    return entry;
}

/**
 * Clean and normalize entry name
 * Removes quality tags, country prefixes, and other clutter
 * @param {string} name - Original name
 * @returns {string} Cleaned name
 */
export function cleanName(name) {
    let cleaned = name;

    // Remove common prefixes
    const prefixPatterns = [
        /^(TR|EN|DE|FR|ES|IT|NL|PL|RU|AR|IN):\s*/i,
        /^(USA|UK|CA|AU):\s*/i,
        /^\[[^\]]+\]\s*/,
        /^\([^)]+\)\s*/,
        /^(VIP|PREMIUM|GOLD|SILVER):\s*/i
    ];

    for (const pattern of prefixPatterns) {
        cleaned = cleaned.replace(pattern, '');
    }

    // Remove quality tags
    const qualityPatterns = [
        /\s*[\[\(]?(4K|UHD|FHD|FULL\s*HD|HD|SD|720p|1080p|2160p|HEVC|H\.?265|H\.?264)[\]\)]?\s*/gi,
        /\s*\|\s*(4K|UHD|FHD|HD|SD)\s*/gi
    ];

    for (const pattern of qualityPatterns) {
        cleaned = cleaned.replace(pattern, ' ');
    }

    // Remove extra symbols and clean up
    cleaned = cleaned
        .replace(/\s*\|\s*$/, '')
        .replace(/\s+/g, ' ')
        .replace(/^\s*[-|:]\s*/, '')
        .replace(/\s*[-|:]\s*$/, '')
        .trim();

    return cleaned;
}

/**
 * Categorize entries into Live TV, Movies, and Series
 * @param {Array} entries - Parsed M3U entries
 * @param {Object} rules - Custom categorization rules
 * @returns {Object} Categorized entries
 */
export function categorizeEntries(entries, rules = {}) {
    const categories = {
        liveTV: [],
        movies: [],
        series: []
    };

    // Default patterns
    const defaultPatterns = {
        movie: [
            // VOD/Movie indicators
            /\bVOD\b/i,
            /\bMovie[s]?\b/i,
            /\bFilm[s]?\b/i,
            /\bCinema\b/i,
            /\bSinema\b/i,
            // Year patterns like (2023) or [2023]
            /[\[\(](19|20)\d{2}[\]\)]/,
            // Movie quality indicators without series markers
            /(?<!S\d{1,2}E\d{1,2})\s*(1080p|720p|4K|BluRay|BRRip|WEBRip|HDRip)/i
        ],
        series: [
            // Standard S01E01 format
            /S\d{1,2}\s*E\d{1,2}/i,
            /Season\s*\d+.*Episode\s*\d+/i,
            /Sezon\s*\d+.*B[öo]l[üu]m\s*\d+/i,
            /\b\d{1,2}x\d{1,2}\b/,
            /\bSeries\b/i,
            /\bDizi\b/i,
            // Episode only (E01, EP01)
            /\bE[Pp]?\s*\d{1,3}\b/
        ],
        liveTV: [
            /\bLIVE\b/i,
            /\bTV\b/i,
            /\bChannel\b/i,
            /\bKanal\b/i,
            /\bCANLI\b/i,
            /\bNews\b/i,
            /\bSports?\b/i,
            /\bSpor\b/i
        ]
    };

    // Compile custom rules
    const customPatterns = {
        movie: (rules.moviePatterns || []).map(p => new RegExp(p, 'i')),
        series: (rules.seriesPatterns || []).map(p => new RegExp(p, 'i')),
        liveTV: (rules.liveTvPatterns || []).map(p => new RegExp(p, 'i')),
        exclude: (rules.excludePatterns || []).map(p => new RegExp(p, 'i'))
    };

    for (const entry of entries) {
        const textToCheck = `${entry.originalName} ${entry.groupTitle}`;

        // Check exclusions first
        if (customPatterns.exclude.some(p => p.test(textToCheck))) {
            continue;
        }

        // Determine category with priority: Series > Movies > Live TV
        let category = 'liveTV'; // Default

        // Check for series first (more specific patterns)
        const isSeriesCustom = customPatterns.series.some(p => p.test(textToCheck));
        const isSeriesDefault = defaultPatterns.series.some(p => p.test(textToCheck));

        if (isSeriesCustom || isSeriesDefault) {
            category = 'series';
        } else {
            // Check for movies
            const isMovieCustom = customPatterns.movie.some(p => p.test(textToCheck));
            const isMovieDefault = defaultPatterns.movie.some(p => p.test(textToCheck));

            if (isMovieCustom || isMovieDefault) {
                category = 'movies';
            } else {
                // Check for live TV explicitly or use as default
                const isLiveTVCustom = customPatterns.liveTV.some(p => p.test(textToCheck));
                const isLiveTVDefault = defaultPatterns.liveTV.some(p => p.test(textToCheck));

                if (isLiveTVCustom || isLiveTVDefault) {
                    category = 'liveTV';
                }
            }
        }

        categories[category].push(entry);
    }

    return categories;
}

/**
 * Extract series information from entry name
 * @param {string} name - Entry name
 * @returns {Object} Series info (title, season, episode)
 */
export function extractSeriesInfo(name) {
    const info = {
        title: '',
        season: 1,
        episode: 1,
        episodeTitle: ''
    };

    // Try S01E01 format
    let match = name.match(/(.+?)\s*[Ss](\d{1,2})\s*[Ee](\d{1,3})\s*(.*)?/);
    if (match) {
        info.title = cleanName(match[1]);
        info.season = parseInt(match[2]);
        info.episode = parseInt(match[3]);
        info.episodeTitle = match[4] ? cleanName(match[4]) : '';
        return info;
    }

    // Try Season X Episode Y format
    match = name.match(/(.+?)\s*Season\s*(\d+).*Episode\s*(\d+)\s*(.*)?/i);
    if (match) {
        info.title = cleanName(match[1]);
        info.season = parseInt(match[2]);
        info.episode = parseInt(match[3]);
        info.episodeTitle = match[4] ? cleanName(match[4]) : '';
        return info;
    }

    // Try 1x01 format
    match = name.match(/(.+?)\s*(\d{1,2})x(\d{1,3})\s*(.*)?/);
    if (match) {
        info.title = cleanName(match[1]);
        info.season = parseInt(match[2]);
        info.episode = parseInt(match[3]);
        info.episodeTitle = match[4] ? cleanName(match[4]) : '';
        return info;
    }

    // Turkish format: Sezon X Bölüm Y
    match = name.match(/(.+?)\s*Sezon\s*(\d+).*B[öo]l[üu]m\s*(\d+)\s*(.*)?/i);
    if (match) {
        info.title = cleanName(match[1]);
        info.season = parseInt(match[2]);
        info.episode = parseInt(match[3]);
        info.episodeTitle = match[4] ? cleanName(match[4]) : '';
        return info;
    }

    // Fallback: Just episode number (E01 or EP01)
    match = name.match(/(.+?)\s*[Ee][Pp]?\s*(\d{1,3})\s*(.*)?/);
    if (match) {
        info.title = cleanName(match[1]);
        info.season = 1;
        info.episode = parseInt(match[2]);
        info.episodeTitle = match[3] ? cleanName(match[3]) : '';
        return info;
    }

    // No pattern matched, use whole name as title
    info.title = cleanName(name);
    return info;
}

/**
 * Extract movie year from name
 * @param {string} name - Entry name
 * @returns {Object} Movie info (title, year)
 */
export function extractMovieInfo(name) {
    const info = {
        title: '',
        year: null
    };

    // Try to extract year
    const yearMatch = name.match(/(.+?)\s*[\[\(](19|20)(\d{2})[\]\)]/);
    if (yearMatch) {
        info.title = cleanName(yearMatch[1]);
        info.year = parseInt(yearMatch[2] + yearMatch[3]);
        return info;
    }

    // No year found
    info.title = cleanName(name);
    return info;
}
