# Önder Balta

HTML ve CSS ile hazırlanmış statik kişisel portfolyo ve blog.

Tarayıcıda JavaScript çalıştırmaz. Framework, paket bağımlılığı, derleme adımı,
CDN, harici font, veritabanı veya uygulama sunucusu gerektirmez.
Fontlar ziyaretçinin cihazından kullanılır. Sayfalar normal HTML bağlantılarıyla açılır.

## Yerelde çalıştırma

```sh
node server.js
```

Tarayıcıda http://localhost:5500 adresini aç.
Sunucuyu durdurmak için terminalde Control + C kullan.

Node.js yalnızca bu yerel önizleme komutu için kullanılır; sitenin kendisi buna
bağımlı değildir. `index.html` dosyası doğrudan tarayıcıda da açılabilir.

## Dosyalar

- `index.html`: ana sayfa
- `projects.html`: projeler
- `blog.html`: blog
- `about.html`: hakkımda
- `styles.css`: tüm sayfaların ortak görünümü
- `server.js`: ek paket gerektirmeyen yerel önizleme sunucusu

Statik yayın için dört HTML dosyası ve `styles.css` yeterlidir.

Önceki site Git geçmişinde ve diğer branch’lerde korunur.
