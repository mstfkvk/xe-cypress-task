# XE.com Cypress E2E Test Otomasyon Projesi

Bu proje, [xe.com](https://www.xe.com) web sitesinin temel kullanıcı akışlarını test etmek için [Cypress](https://www.cypress.io/) kullanılarak oluşturulmuş bir E2E (Uçtan Uca) test otomasyon paketidir.

##  Test Edilen Özellikler

Bu otomasyon projesi aşağıdaki senaryoları kapsamaktadır:

-   **Ana Sayfa Para Birimi Dönüşümü:** Ana sayfadaki dönüştürücü aracını kullanarak EUR'dan USD'ye belirli bir miktar para çevirme ve sonucun doğruluğunu kontrol etme.
-   **Canlı Kur Tablosuna Para Birimi Ekleme:** Ana sayfadaki "Canlı Kurlar" tablosuna yeni bir para birimi (TRY) ekleme ve tablonun güncellendiğini doğrulama.
-   **Mobil Görünümde Gezinme:** Tarayıcıyı mobil görünüme (iPhone-X) geçirerek "İşletme" (Business) sayfasına gitme ve URL'nin doğru olduğunu doğrulama.
-   **Kullanıcı Girişi (Sign-in):** Kayıtlı bir kullanıcı hesabıyla giriş yapma işlemini test etme. Giriş sonrası sistemin 2FA (İki Faktörlü Kimlik Doğrulama) veya Captcha istediğini doğrulama.
-   **Para Gönderme (Send Money) Akışı:** "Para Gönder" akışını başlatma, farklı para birimleri (NZD'den USD'ye) seçerek teklif alma ve kullanıcıyı kayıt/giriş sayfasına yönlendirdiğini doğrulama.
-   **API Testi (Örnek):** Proje içerisinde API testlerinin nasıl yapılabileceğine dair yorum satırı olarak bırakılmış bir örnek bulunmaktadır.

---

## Kurulum ve Başlangıç

Bu projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### Ön Gereksinimler

-   [Node.js](https://nodejs.org/en/) (v16 veya üstü önerilir)
-   [Git](https://git-scm.com/)

### Kurulum Adımları

1.  **Projeyi Klonlayın:**
    Projeyi GitHub'dan yerel makinenize klonlayın.

    ```bash
    git clone <projenizin-github-linki>
    ```

2.  **Proje Dizinine Gidin:**

    ```bash
    cd <proje-klasorunun-adi>
    ```

3.  **Gerekli Paketleri Yükleyin:**
    Projenin bağımlılıklarını `npm` kullanarak yükleyin.

    ```bash
    npm install
    ```

### Ortam Değişkenlerini Ayarlama (ÇOK ÖNEMLİ)

Testler, kullanıcı girişi gibi senaryolar için hassas veriler (e-posta, şifre) kullanmaktadır. Bu bilgileri doğrudan koda yazmak yerine ortam değişkenleri (environment variables) kullanmak en iyi pratiktir.

1.  Projenin ana dizininde `cypress.env.json` adında bir dosya oluşturun.

2.  Bu dosyanın içeriğini aşağıdaki şablonu kullanarak doldurun ve kendi `xe.com` hesap bilgilerinizle güncelleyin.

    ```json
    {
      "email": "sizin_hesap_emailiniz@example.com",
      "password": "sizin_hesap_sifreniz",
      "XE_API_KEY": "eger_kullanacaksaniz_api_anahtariniz"
    }
    ```

> **Not:** `cypress.env.json` dosyası, hassas bilgiler içerdiği için `.gitignore` dosyasına eklenmiştir ve kesinlikle Git deposuna gönderilmemelidir.

---

## Testleri Çalıştırma

Testleri iki farklı modda çalıştırabilirsiniz:

### 1. Cypress Test Runner ile (Etkileşimli Mod)

Bu mod, testleri yazarken veya hataları ayıklarken kullanmak için idealdir. Testleri görsel bir arayüzde adım adım çalıştırır.

```bash
npx cypress open
```

Bu komutu çalıştırdıktan sonra Cypress arayüzü açılacaktır. Buradan çalıştırmak istediğiniz test dosyasını (`.cy.js`) seçebilirsiniz.

### 2. Headless Modda (Komut Satırından)

Bu mod, tüm testleri arka planda, tarayıcı arayüzü olmadan çalıştırır. Genellikle CI/CD (Sürekli Entegrasyon/Dağıtım) süreçlerinde kullanılır.

```bash
npx cypress run
```

Eğer testleri sadece belirli bir tarayıcıda çalıştırmak isterseniz:

```bash
# Sadece Chrome'da çalıştırmak için
npx cypress run --browser chrome

# Sadece Firefox'ta çalıştırmak için
npx cypress run --browser firefox
```

---

## Proje Yapısı

```
.
├── cypress/
│   ├── e2e/
│   │   └── home_page_tests.cy.js  # Test senaryolarının bulunduğu dosya
│   ├── support/
│   │   ├── commands.js            # Özel Cypress komutları
│   │   └── e2e.js                 # Her testten önce çalışan global ayarlar
│   └── fixtures/
│       └── example.json           # Test verileri için
├── node_modules/                  # Proje bağımlılıkları (gitignore'da)
├── .gitignore                     # Git'e gönderilmeyecek dosyalar
├── cypress.config.js              # Cypress ana yapılandırma dosyası
├── cypress.env.json               # Ortam değişkenleri (gitignore'da)
├── package.json                   # Proje bilgileri ve bağımlılıklar
└── README.md                      # Bu dosya
```