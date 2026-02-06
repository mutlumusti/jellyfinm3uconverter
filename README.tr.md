<div align="center">

# 🎬 IPTV İşleyici

### IPTV Deneyiminizi Dönüştürün

[![Electron](https://img.shields.io/badge/Electron-2B2E3A?style=for-the-badge&logo=electron&logoColor=9FEAF9)](https://www.electronjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Lisans](https://img.shields.io/badge/Lisans-MIT-blue?style=for-the-badge)](LICENSE)

**M3U playlistlerini otomatik olarak ayrıştıran ve Jellyfin uyumlu STRM dosyaları oluşturan güçlü bir masaüstü uygulaması.**

[🇹🇷 Türkçe](README.tr.md) | [🇬🇧 English](README.md)

---

</div>

## 📋 İçindekiler

- [✨ Özellikler](#-özellikler)
- [🎯 Ne İşe Yarar?](#-ne-işe-yarar)
- [⚡ Hızlı Başlangıç](#-hızlı-başlangıç)
- [📦 Kurulum](#-kurulum)
- [🚀 Kullanım](#-kullanım)
- [⚙️ Yapılandırma](#️-yapılandırma)
- [⏰ Zamanlama](#-zamanlama)
- [🌐 Çoklu Dil Desteği](#-çoklu-dil-desteği)
- [📁 Çıktı Yapısı](#-çıktı-yapısı)
- [🔧 Teknik Detaylar](#-teknik-detaylar)
- [📄 Lisans](#-lisans)

---

## ✨ Özellikler

| Özellik | Açıklama |
|---------|----------|
| 🔄 **Otomatik Ayrıştırma** | M3U playlistlerinden içeriği otomatik çıkarır ve kategorize eder |
| 📺 **Canlı TV Desteği** | Canlı TV kanalları için temiz M3U playlistleri oluşturur |
| 🎬 **Film İşleme** | Filmler için doğru adlandırılmış STRM dosyaları oluşturur |
| 📺 **Dizi Organizasyonu** | TV dizilerini şov ve sezona göre düzenler |
| ⏰ **Zamanlanmış İşleme** | Otomatik güncellemeler ayarlayın (saatlik, günlük, haftalık, aylık) |
| 🌓 **Karanlık/Aydınlık Tema** | Tema değiştirme özellikli güzel arayüz |
| 🌐 **Çoklu Dil** | Türkçe ve İngilizce tam destek |
| 📊 **Gerçek Zamanlı İlerleme** | Detaylı günlüklerle canlı ilerleme takibi |
| 🔧 **Kimlik Bilgisi Otomatik Algılama** | URL'lerden kullanıcı adı/şifre otomatik çıkarır |

---

## 🎯 Ne İşe Yarar?

IPTV İşleyici, IPTV içeriğini **Jellyfin**, **Plex** veya **Emby** gibi medya sunucularıyla entegre etme zorluğunu çözer.

### Problem
- IPTV sağlayıcıları binlerce giriş içeren tek bir M3U dosyası verir
- Her şey karışık halde (canlı TV, filmler, diziler)
- Medya sunucuları bu içeriği düzgün kategorize edemez
- Manuel organizasyon saatler sürer

### Çözüm
IPTV İşleyici otomatik olarak:
1. M3U playlistinizi **indirir**
2. Her girişi **ayrıştırır** ve analiz eder
3. İçeriği Canlı TV, Filmler ve Diziler olarak **kategorize eder**
4. Düzgün formatlanmış STRM dosyaları **oluşturur**
5. Her şeyi medya sunucunuzun anlayacağı klasör yapısında **düzenler**

```
📁 Önce                             📁 Sonra
└── playlist.m3u (10.000+ giriş)    ├── 📺 CanliTV/
                                    │   └── playlist.m3u (temiz)
                                    ├── 🎬 Filmler/
                                    │   ├── Avatar (2009).strm
                                    │   ├── Başlangıç (2010).strm
                                    │   └── ...
                                    └── 📺 Diziler/
                                        ├── Kurtlar Vadisi/
                                        │   ├── Sezon 01/
                                        │   │   ├── S01E01.strm
                                        │   │   └── ...
                                        └── ...
```

---

## ⚡ Hızlı Başlangıç

```bash
# Depoyu klonlayın
git clone https://github.com/mustimutlu5524/jellyfinm3uconverter.git

# Dizine gidin
cd jellyfinm3uconverter

# Bağımlılıkları yükleyin
npm install

# Uygulamayı başlatın
npm start
```

---

## 📦 Kurulum

### Gereksinimler

- **Node.js** 18.x veya üzeri
- **npm** 9.x veya üzeri
- Windows 10/11, macOS veya Linux

### Adım Adım Kurulum

1. **Kaynak kodunu indirin:**
   ```bash
   git clone https://github.com/mustimutlu5524/jellyfinm3uconverter.git
   cd jellyfinm3uconverter
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Uygulamayı çalıştırın:**
   ```bash
   npm start
   ```

### Üretim için Derleme

```bash
# Windows için derle
npm run build:win

# macOS için derle
npm run build:mac

# Linux için derle
npm run build:linux
```

---

## 🚀 Kullanım

### Adım 1: M3U URL'nizi Girin

IPTV sağlayıcınızın M3U playlist URL'sini giriş alanına yapıştırın.

```
https://provider.com/get.php?username=XXX&password=XXX&type=m3u
```

> 💡 **İpucu:** Kullanıcı adı ve şifre URL'den otomatik algılanır!

### Adım 2: Çıktı Yollarını Yapılandırın

Çıktı dizinlerini seçmek için **Gözat** butonuna tıklayın:

| İçerik Türü | Açıklama |
|-------------|----------|
| 📺 **Canlı TV** | Temiz M3U playlistinin kaydedileceği yer |
| 🎬 **Filmler** | Film STRM dosyalarının oluşturulacağı yer |
| 📺 **Diziler** | TV dizi klasörlerinin düzenleneceği yer |

### Adım 3: Çıktı Formatını Seçin

- **TS** (Transport Stream) - Varsayılan, geniş uyumluluk
- **M3U8** (HLS) - HTTP Canlı Yayın için

### Adım 4: İşlemeyi Başlatın

**İşlemeyi Başlat** butonuna tıklayın ve gerçek zamanlı ilerlemeyi izleyin:

1. ⬇️ **İndirme** - Playlist getiriliyor
2. 🔍 **Ayrıştırma** - Girişler analiz ediliyor
3. 📂 **Kategorilendirme** - İçerik sıralanıyor
4. 📺 **Canlı TV** - Temiz playlist oluşturuluyor
5. 🎬 **Filmler** - STRM dosyaları oluşturuluyor
6. 📺 **Diziler** - Sezona göre düzenleniyor

---

## ⚙️ Yapılandırma

### Şablonlar

Önceden yapılandırılmış şablonlardan seçin:

| Şablon | En İyi Kullanım |
|--------|-----------------|
| **Varsayılan** | Standart M3U playlistleri |
| **Xtream Codes** | Xtream tabanlı sağlayıcılar |
| **Türk IPTV** | Türk içerik sağlayıcıları |

### Yapılandırma Dosyası

Ayarlar `config.json` dosyasına kaydedilir:

```json
{
  "m3uUrl": "https://your-provider.com/playlist.m3u",
  "username": "kullanici_adiniz",
  "password": "sifreniz",
  "outputFormat": "ts",
  "paths": {
    "liveTV": "C:/Medya/CanliTV",
    "movies": "C:/Medya/Filmler",
    "series": "C:/Medya/Diziler"
  },
  "schedule": {
    "enabled": true,
    "frequency": "daily",
    "time": "03:00"
  }
}
```

---

## ⏰ Zamanlama

Kütüphanenizi otomatik olarak güncel tutun!

### Mevcut Sıklıklar

| Sıklık | Açıklama |
|--------|----------|
| ⏰ **Saatlik** | Her saat |
| 📅 **Günlük** | Belirtilen saatte günde bir kez |
| 📆 **Haftalık** | Belirtilen günde haftada bir kez |
| 🗓️ **Aylık** | Belirtilen tarihte ayda bir kez |

### Zamanlama Ayarlama

1. **"Zamanlanmış İşlemeyi Etkinleştir"** seçeneğini aktifleştirin
2. Sıklık seçin (Günlük, Haftalık, vb.)
3. Saati seçin
4. Yapılandırmayı kaydedin

> ⚠️ **Not:** Zamanlanmış görevlerin çalışması için uygulamanın açık olması gerekir.

---

## 🌐 Çoklu Dil Desteği

Başlıktaki bayrak açılır menüsünü kullanarak diller arasında anında geçiş yapın.

| Dil | Bayrak |
|-----|--------|
| Türkçe | 🇹🇷 |
| English | 🇬🇧 |

Tüm arayüz öğeleri, etiketler ve mesajlar çevrilmiştir.

---

## 📁 Çıktı Yapısı

### Filmler
```
Filmler/
├── Aksiyon/
│   ├── Zor Ölüm (1988).strm
│   └── Çılgın Max Öfkeli Yollar (2015).strm
├── Komedi/
│   └── Felekten Bir Gece (2009).strm
└── Drama/
    └── Esaretin Bedeli (1994).strm
```

### Diziler
```
Diziler/
├── Kurtlar Vadisi/
│   ├── Sezon 01/
│   │   ├── S01E01 - Pilot.strm
│   │   ├── S01E02 - İkinci Bölüm.strm
│   │   └── ...
│   └── Sezon 02/
│       └── ...
└── Ezel/
    └── ...
```

### Canlı TV
```
CanliTV/
└── playlist.m3u
```

---

## 🔧 Teknik Detaylar

### Teknoloji Yığını

- **Ön Yüz:** HTML5, CSS3, Vanilla JavaScript
- **Arka Uç:** Node.js, Express.js
- **Masaüstü:** Electron
- **Gerçek Zamanlı:** Socket.IO
- **Zamanlama:** node-cron

### API Uç Noktaları

| Metot | Uç Nokta | Açıklama |
|-------|----------|----------|
| GET | `/api/config` | Mevcut yapılandırmayı al |
| POST | `/api/config` | Yapılandırmayı kaydet |
| POST | `/api/process` | İşlemeyi başlat |
| GET | `/api/test-url` | M3U URL'sini test et |

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen Pull Request göndermekten çekinmeyin.

1. Depoyu forklayın
2. Özellik dalınızı oluşturun (`git checkout -b ozellik/HarikaOzellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Harika özellik eklendi'`)
4. Dalı push edin (`git push origin ozellik/HarikaOzellik`)
5. Pull Request açın

---

## 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

<div align="center">

### Jellyfin kullanıcıları için ❤️ ile yapıldı

**[⬆ Başa Dön](#-iptv-i̇şleyici)**

</div>
