# 🚀 Baskent-Lab Vercel Dağıtım Rehberi

Mevcut sistemi bozmamak için bu laboratuvar ortamında yaptığımız değişiklikleri yeni bir Vercel projesine aktaracağız.

### 1. Yeni Vercel Projesi Oluşturma
* Vercel Dashboard üzerinden yeni bir proje oluşturun.
* Repo olarak bu laboratuvar ortamını (veya size vereceğim ZIP içeriğini) bağlayın.

### 2. Ortam Değişkenleri (Environment Variables)
Yeni Vercel projesinde şu değişkenleri ayarlamanız gerekecektir:

| Değişken | Açıklama |
| :--- | :--- |
| `DATABASE_URL` | Yeni (test) bir Neon PostgreSQL bağlantı adresi. |
| `AUTH_SECRET` | En az 32 karakterlik rastgele bir metin. |
| `ADMIN_SETUP_KEY` | `quba-setup-2026` yerine kendi güvenli anahtarınız. |
| `NEXT_PUBLIC_APP_URL` | Vercel tarafından verilen test URL'i. |

### 3. İlk Kurulum (Bootstrap)
Dağıtım tamamlandıktan sonra, veritabanı şemasını oluşturmak için şu adresi bir kez ziyaret etmeniz yeterlidir:
`https://yeni-proje.vercel.app/api/setup?key=ADMIN_SETUP_KEY`

---
*Not: Ben şema üzerindeki kritik (Meta ve Health) uyumsuzlukları düzelttim. Artık `system-health` ve `admin/tenants` uçları hata vermeden çalışacaktır.*
