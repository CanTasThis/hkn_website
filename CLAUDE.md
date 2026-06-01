# HKN.com — Hakan Üstün Kişisel Web Sitesi

## Altyapı & Sunucu

```bash
npm install          # bağımlılıkları kur
cp .env.example .env # env dosyasını oluştur ve düzenle
npm run dev          # geliştirme (nodemon)
npm start            # production
```

Sunucu: `http://localhost:3000`
API endpoint: `POST /api/contact`

---

## Proje Özeti

**Hakan Üstün** için hazırlanmış kişisel tanıtım ve online ders satış sitesi.
Hakan Üstün; Balanced Body (ABD) ve Baps Academy bünyesinde **Master Eğitmen** olarak görev yapan, İstanbul · Londra · Miami · New York'ta aktif bir **Master Reformer Pilates Eğitmeni**'dir.

---

## Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Markup | Saf HTML5 (`Hakan Üstün - Site.html`) |
| Stil | Saf CSS3 (`styles.css`) |
| Etkileşim | Vanilla JS IIFE (`app.js`) |
| Görsel Placeholder | Custom Web Component (`image-slot.js`) |
| Tasarım Paneli | React 18 + Babel (CDN) + JSX (`tweaks-panel.jsx`, `tweaks-app.jsx`) |

**Build sistemi yok.** Dosyalar doğrudan tarayıcıda açılır veya statik sunucu üzerinden servis edilir.

---

## Dosya Yapısı

```
HKN.com/
├── Hakan Üstün - Site.html   # Ana HTML — tüm bölümler burada
├── styles.css                # Tüm stiller (tokenler, bileşenler, responsive)
├── app.js                    # Etkileşim: galeri render, modal, FAQ, form, nav
├── image-slot.js             # <image-slot> custom element (sürükle-bırak görsel)
├── tweaks-panel.jsx          # TweaksPanel bileşen kütüphanesi (React)
├── tweaks-app.jsx            # Site-specific tweaks entegrasyonu
└── .image-slots.state.json   # Görsel persist sidecar (otomatik oluşur)
```

---

## Tasarım Sistemi

### Renk Tokenleri (CSS Variables)

| Token | Değer | Kullanım |
|-------|-------|----------|
| `--cream` | `#EFE9E1` | Ana arka plan |
| `--paper` | `#F5F1EA` | Kart/bölüm arka planı |
| `--sand` | `#E5DCCF` | İkincil arka plan |
| `--ink` | `#33302A` | Ana metin |
| `--ink-soft` | `#6E675B` | İkincil metin |
| `--noir` | `#211E19` | Koyu bölümler (hero, footer, metodoloji) |
| `--clay` | `#A8896B` | Vurgu rengi (accent) |
| `--clay-deep` | `#8C6E50` | Koyu vurgu |
| `--terra` | `#9A6B4F` | Hover vurgusu |

### Palet Temaları

Tweaks paneli üç paleti destekler:
- **earth** (varsayılan): Sıcak toprak tonları
- **olive**: Zeytinimsi yeşil tonlar
- **noir**: Sinematik koyu mod

### Tipografi

- **Display**: `Cormorant Garamond` (serif, başlıklar)
- **Body**: `Jost` (sans-serif, metin)
- Alternatif çiftler: `Marcellus + Hanken Grotesk`, `Tenor Sans + Outfit`

---

## Sayfa Bölümleri

| ID | Bölüm | Açıklama |
|----|-------|----------|
| `#top` | Hero | Tam ekran sinematik hero, isim animasyonu, şehirler |
| — | Marquee | Kayan slogan bandı |
| `#hakkimda` | About | Profil fotoğrafı, biyografi, stats (sayaç animasyonu) |
| `#metodoloji` | Methodology | 4 ilke (Kontrol · Konsantrasyon · Merkezleme · Kesinlik) |
| `#dersler` | Video Library | 6 ders kartı, satın alma modalı |
| `#referanslar` | Testimonials | 3 alıntı kartı |
| `#sss` | FAQ | 5 accordion soru-cevap |
| `#iletisim` | Contact | İletişim bilgileri + iletişim formu |
| — | Footer | Logo, navigasyon, sosyal medya |

---

## Video Kataloğu (Mock Data — `app.js`)

| ID | Başlık | Kategori | Seviye | Süre | Fiyat |
|----|--------|----------|--------|------|-------|
| v1 | Advanced Reformer Flow | Reformer | Advanced | 52 dk | ₺349 |
| v2 | Cadillac Mastery | Trapeze Table | Advanced | 64 dk | ₺399 |
| v3 | Wunda Chair Power | Wunda Chair | Intermediate | 41 dk | ₺299 |
| v4 | Clean Mat Series | Mat | Intermediate | 38 dk | ₺249 |
| v5 | Ladder Barrel & Mobility | Ladder Barrel | Advanced | 45 dk | ₺329 |
| v6 | Reformer Choreography | Reformer | Advanced | 58 dk | ₺379 |

---

## `<image-slot>` Custom Element

Görsel placeholder bileşeni. Sürükle-bırak ile görsel eklenir, `.image-slots.state.json` sidecar dosyasına persist edilir.

**Önemli attribute'lar:**
- `id` — persist için zorunlu (sayfa bazında benzersiz olmalı)
- `shape` — `rect | rounded | circle | pill`
- `placeholder` — boş durum metni
- `fit` — `cover | contain | fill`

---

## Tweaks Paneli

React tabanlı floating ayar paneli. Üç tweak:

| Tweak | Seçenekler | Etki |
|-------|-----------|------|
| `palette` | earth / olive / noir | `data-palette` attr → CSS var override |
| `font` | cormorant / marcellus / tenor | `data-font` attr → font-family override |
| `layout` | grid / two / list | `#gallery[data-layout]` → ders kartı dizilimi |

---

## Animasyon & Etkileşim

- **Scroll reveal**: `.r` class → `IntersectionObserver` → `.in` class ekler
- **Hero intro**: `setTimeout(90ms)` → `.hero.in` → CSS keyframe animasyonları
- **Stat count-up**: `data-count` attribute + `IntersectionObserver`
- **Marquee**: `animation: marq 30s linear infinite`, hover'da duraklatılır
- **Nav**: Scroll > %72 viewport yüksekliğinde `scrolled` class → glassmorphism efekti
- **Modal**: Ders kartına tıkla → veil + modal gösterilir, ESC ile kapatılır
- **FAQ accordion**: `max-height` animasyonu ile açılır/kapanır

---

## Responsive Kırılma Noktaları

| Breakpoint | Değişiklikler |
|-----------|---------------|
| ≤1040px | Galeri 3→2 kolon |
| ≤980px | Nav linkleri gizlenir, hamburger menü açılır |
| ≤860px | About/FAQ/Contact grid → tek kolon, pillars 4→2 kolon |
| ≤760px | Modal tek kolon, quotes tek kolon |
| ≤680px | Galeri 2→1 kolon |
| ≤560px | Shell padding 40px→22px |
| ≤400px | Hero font küçülür, şehirler wrap |

---

## Geliştirme Notları

- **Gerçek ödeme yok**: Modal "Ödemeyi Tamamla" butonu sadece success state'i gösterir (demo akışı).
- **Görsel yok**: Tüm `<image-slot>` bileşenler placeholder durumunda — gerçek görseller sürükle-bırak ile eklenir.
- **Form backend yok**: İletişim formu sadece success mesajı gösterir, e-posta göndermez.
- **CDN bağımlılıkları**: React 18.3.1, ReactDOM 18.3.1, Babel Standalone 7.29.0 (unpkg üzerinden, SRI hash'li).
- **Dil**: Türkçe arayüz, İngilizce teknik terimler.

---

## Sosyal & İletişim

- **Stüdyo**: Pilates Baps · Şaşkınbakkal
- **E-posta**: studio@hakanustun.com
- **Sosyal**: @hakanustun (Instagram, YouTube)
- **İş birlikleri**: Balanced Body, Baps Academy, Nike, Barçın
