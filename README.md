<div align="center">

# 🎬 IPTV Processor

### Transform Your IPTV Experience

[![Electron](https://img.shields.io/badge/Electron-2B2E3A?style=for-the-badge&logo=electron&logoColor=9FEAF9)](https://www.electronjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**A powerful desktop application that automatically parses M3U playlists and generates Jellyfin-compatible STRM files.**

[🇹🇷 Türkçe](README.tr.md) | [🇬🇧 English](README.md)

---

</div>

## 📋 Table of Contents

- [✨ Features](#-features)
- [🎯 What Does It Do?](#-what-does-it-do)
- [⚡ Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [🚀 Usage](#-usage)
- [⚙️ Configuration](#️-configuration)
- [⏰ Scheduling](#-scheduling)
- [🌐 Multi-Language Support](#-multi-language-support)
- [📁 Output Structure](#-output-structure)
- [🔧 Technical Details](#-technical-details)
- [📄 License](#-license)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔄 **Auto-Parsing** | Automatically extracts and categorizes content from M3U playlists |
| 📺 **Live TV Support** | Creates clean M3U playlists for live TV channels |
| 🎬 **Movie Processing** | Generates STRM files for movies with proper naming |
| 📺 **Series Organization** | Organizes TV series by show and season |
| ⏰ **Scheduled Processing** | Set automatic updates (hourly, daily, weekly, monthly) |
| 🌓 **Dark/Light Theme** | Beautiful UI with theme switching |
| 🌐 **Multi-Language** | Full support for Turkish and English |
| 📊 **Real-time Progress** | Live progress tracking with detailed logs |
| 🔧 **Credential Auto-Detection** | Automatically extracts username/password from URLs |

---

## 🎯 What Does It Do?

IPTV Processor solves the challenge of integrating IPTV content with media servers like **Jellyfin**, **Plex**, or **Emby**.

### The Problem
- IPTV providers give you a single M3U file with thousands of entries
- Everything is mixed together (live TV, movies, series)
- Media servers can't properly categorize this content
- Manual organization would take hours

### The Solution
IPTV Processor automatically:
1. **Downloads** your M3U playlist
2. **Parses** and analyzes each entry
3. **Categorizes** content into Live TV, Movies, and Series
4. **Generates** properly formatted STRM files
5. **Organizes** everything in a folder structure your media server understands

```
📁 Before                          📁 After
└── playlist.m3u (10,000+ entries) ├── 📺 LiveTV/
                                   │   └── playlist.m3u (clean)
                                   ├── 🎬 Movies/
                                   │   ├── Avatar (2009).strm
                                   │   ├── Inception (2010).strm
                                   │   └── ...
                                   └── 📺 Series/
                                       ├── Breaking Bad/
                                       │   ├── Season 01/
                                       │   │   ├── S01E01.strm
                                       │   │   └── ...
                                       └── ...
```

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/mustimutlu5524/jellyfinm3uconverter.git

# Navigate to directory
cd jellyfinm3uconverter

# Install dependencies
npm install

# Start the application
npm start
```

---

## 📦 Installation

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- Windows 10/11, macOS, or Linux

### Step-by-Step Installation

1. **Download the source code:**
   ```bash
   git clone https://github.com/mustimutlu5524/jellyfinm3uconverter.git
   cd jellyfinm3uconverter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the application:**
   ```bash
   npm start
   ```

### Building for Production

```bash
# Build for Windows
npm run build:win

# Build for macOS
npm run build:mac

# Build for Linux
npm run build:linux
```

---

## 🚀 Usage

### Step 1: Enter Your M3U URL

Paste your IPTV provider's M3U playlist URL into the input field.

```
https://provider.com/get.php?username=XXX&password=XXX&type=m3u
```

> 💡 **Tip:** Username and password are automatically detected from the URL!

### Step 2: Configure Output Paths

Click **Browse** to select output directories for:

| Content Type | Description |
|--------------|-------------|
| 📺 **Live TV** | Where clean M3U playlist will be saved |
| 🎬 **Movies** | Where movie STRM files will be created |
| 📺 **Series** | Where TV series folders will be organized |

### Step 3: Choose Output Format

- **TS** (Transport Stream) - Default, widely compatible
- **M3U8** (HLS) - For HTTP Live Streaming

### Step 4: Start Processing

Click **Start Processing** and watch the real-time progress:

1. ⬇️ **Download** - Fetching playlist
2. 🔍 **Parse** - Analyzing entries
3. 📂 **Categorize** - Sorting content
4. 📺 **Live TV** - Creating clean playlist
5. 🎬 **Movies** - Generating STRM files
6. 📺 **Series** - Organizing by season

---

## ⚙️ Configuration

### Presets

Choose from pre-configured templates:

| Preset | Best For |
|--------|----------|
| **Default** | Standard M3U playlists |
| **Xtream Codes** | Xtream-based providers |
| **Turkish IPTV** | Turkish content providers |

### Configuration File

Settings are saved to `config.json`:

```json
{
  "m3uUrl": "https://your-provider.com/playlist.m3u",
  "username": "your_username",
  "password": "your_password",
  "outputFormat": "ts",
  "paths": {
    "liveTV": "C:/Media/LiveTV",
    "movies": "C:/Media/Movies",
    "series": "C:/Media/Series"
  },
  "schedule": {
    "enabled": true,
    "frequency": "daily",
    "time": "03:00"
  }
}
```

---

## ⏰ Scheduling

Keep your library up-to-date automatically!

### Available Frequencies

| Frequency | Description |
|-----------|-------------|
| ⏰ **Hourly** | Every hour |
| 📅 **Daily** | Once per day at specified time |
| 📆 **Weekly** | Once per week on specified day |
| 🗓️ **Monthly** | Once per month on specified date |

### Setting Up a Schedule

1. Enable **"Enable Scheduled Processing"**
2. Select frequency (Daily, Weekly, etc.)
3. Choose the time
4. Save configuration

> ⚠️ **Note:** The application must be running for scheduled tasks to execute.

---

## 🌐 Multi-Language Support

Switch between languages instantly using the flag dropdown in the header.

| Language | Flag |
|----------|------|
| Türkçe | 🇹🇷 |
| English | 🇬🇧 |

All UI elements, labels, and messages are translated.

---

## 📁 Output Structure

### Movies
```
Movies/
├── Action/
│   ├── Die Hard (1988).strm
│   └── Mad Max Fury Road (2015).strm
├── Comedy/
│   └── The Hangover (2009).strm
└── Drama/
    └── The Shawshank Redemption (1994).strm
```

### Series
```
Series/
├── Breaking Bad/
│   ├── Season 01/
│   │   ├── S01E01 - Pilot.strm
│   │   ├── S01E02 - Cat's in the Bag.strm
│   │   └── ...
│   └── Season 02/
│       └── ...
└── Game of Thrones/
    └── ...
```

### Live TV
```
LiveTV/
└── playlist.m3u
```

---

## 🔧 Technical Details

### Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Desktop:** Electron
- **Real-time:** Socket.IO
- **Scheduling:** node-cron

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/config` | Get current configuration |
| POST | `/api/config` | Save configuration |
| POST | `/api/process` | Start processing |
| GET | `/api/test-url` | Test M3U URL |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### Made with ❤️ for Jellyfin users

**[⬆ Back to Top](#-iptv-processor)**

</div>
