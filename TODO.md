# Beyanhane Auth - Headless Geliştirme Yol Haritası

Bu dosya, projenin tamamen modüler ve her türlü framework'e (Next.js, Express vb.) entegre edilebilecek "headless" bir yapıda olması için gereken adımları içerir.

## 📦 1. Mimarlık ve Paketleme (Headless Core)
- [x] **Agnostic Logic**: `core` paketinin Request/Response'u karşılayan, her türlü ortama uygun bir motor haline getirilmesi.
- [ ] **Interface Standartlaştırma**: `AuthAdapter` ve `AuthProvider` yapılarını, herhangi bir veritabanı veya sağlayıcıyla çalışacak şekilde sadeleştirmek.
- [ ] **Mono-repo Organizasyonu**:
    - `packages/adapters`: Veritabanı entegrasyonları için arayüzler.
    - `packages/providers`: Kimlik sağlayıcı (Google, GitHub, Credentials vb.) modülleri.
    - `packages/react`: `SessionProvider`, `useSession` gibi temel client-side logic.

## 🛠 2. Core Motoru Geliştirmeleri
- [ ] **AuthHandler İşleyicisi**: Kullanıcının kendi API rotasında (`/api/auth/[...path]`) çağırabileceği merkezi işleyici.
- [x] **Gelişmiş Callbacks Sistemi**: `signIn`, `jwt`, `session` gibi kritik aşamalar için kullanıcıya müdahale şansı.
- [x] **CSRF & Security Helpers**: CSRF token üretimi, cookie ayarları ve Cross-Origin güvenliği için yardımcı araçlar.

## 🔐 3. Güvenlik ve Protokoller
- [ ] **OAuth PKCE & State**: OAuth 2.0 akışları için standart güvenlik katmanları.
- [ ] **Account Linking**: Farklı hesapların tek bir kullanıcı profiline bağlanması yönetimi.
- [ ] **Logger**: Hata ayıklama ve loglama için esnek bir arayüz.

## 🎨 4. Client-Side (React) Katmanı
- [ ] **Headless Auth Hooks**: UI'dan bağımsız `useSession`, `signIn`, `signOut` hook'ları.
- [ ] **Session State Management**: Fetch tabanlı, lightweight bir session takip mekanizması.
