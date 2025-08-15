# Deployment ke Cloudflare Pages

## Persiapan

1. **Install Wrangler CLI** (jika belum):
```bash
npm install -g wrangler
```

2. **Login ke Cloudflare**:
```bash
wrangler login
```

## Langkah-Langkah Deployment

### 1. Build Aplikasi
```bash
npm run build
```

### 2. Deploy ke Cloudflare Pages

#### Opsi A: Manual Upload
1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Pilih "Pages" dari sidebar
3. Klik "Create a project"
4. Pilih "Upload assets"
5. Upload folder `dist/public` yang telah di-build

#### Opsi B: Menggunakan Wrangler (Direkomendasikan)
```bash
wrangler pages deploy dist/public --project-name=raxnet-prime
```

### 3. Setup Domain (Opsional)
1. Di Cloudflare Dashboard → Pages → Project Settings
2. Tambahkan custom domain jika diperlukan

### 4. Konfigurasi Environment Variables
Di Cloudflare Dashboard → Pages → Settings → Environment variables:

```
NODE_ENV=production
```

## Struktur File untuk Cloudflare Pages

```
dist/public/          # Build output dari Vite
├── index.html        # Entry point aplikasi
├── assets/           # CSS, JS, images
├── _headers          # CORS configuration
└── functions/        # Cloudflare Functions (API routes)
    └── api/
        └── [[route]].ts
```

## Fitur yang Didukung

✅ **Static Site Hosting**: React SPA dengan routing client-side
✅ **Cloudflare Functions**: API endpoints untuk backend
✅ **Automatic HTTPS**: SSL/TLS otomatis
✅ **Global CDN**: Performa tinggi di seluruh dunia
✅ **Custom Domains**: Domain kustom supported

## API Endpoints

- `GET /api/categories` - Daftar kategori berita
- `GET /api/articles` - Daftar artikel
- `GET /api/articles/:id` - Detail artikel
- `POST /api/admin/login` - Login admin
- `GET /api/articles/:id/comments` - Komentar artikel
- `POST /api/articles/:id/comments` - Tambah komentar

## Monitoring dan Analytics

Cloudflare Pages memberikan:
- Real-time analytics
- Performance monitoring
- Error tracking
- Bandwidth usage statistics

## Troubleshooting

### Build Errors
```bash
# Clear cache dan rebuild
rm -rf dist/
npm run build
```

### Function Errors
- Check Cloudflare Functions logs di dashboard
- Pastikan CORS headers sudah benar di `_headers`

### Domain Issues
- Pastikan DNS sudah pointing ke Cloudflare
- Check SSL/TLS settings di Cloudflare Dashboard