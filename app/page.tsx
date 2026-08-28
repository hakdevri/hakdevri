const categories = [
  { icon: "🏨", name: "Konaklama" },
  { icon: "🚗", name: "Otomotiv" },
  { icon: "🍽️", name: "Restoran" },
  { icon: "🛥️", name: "Tekne" },
  { icon: "🎟️", name: "Etkinlik" },
];

const featuredRights = [
  {
    category: "KONAKLAMA",
    title: "1 Gece Bodrum Konaklama",
    location: "Bodrum, Muğla",
    normalPrice: "8.000 TL",
    rightPrice: "5.000 TL",
    transferPrice: "750 TL",
  },
  {
    category: "OTOMOTİV",
    title: "Premium Oto Bakım Paketi",
    location: "İstanbul",
    normalPrice: "20.000 TL",
    rightPrice: "12.000 TL",
    transferPrice: "1.250 TL",
  },
  {
    category: "DENEYİM",
    title: "Özel Tekne Kullanım Hakkı",
    location: "Çeşme, İzmir",
    normalPrice: "15.000 TL",
    rightPrice: "9.500 TL",
    transferPrice: "900 TL",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#111111]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f7f7f5]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <div>
            <div className="text-xl font-bold tracking-[-0.04em]">
              HAK<span className="font-normal">DEVRİ</span>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm md:flex">
            <a href="#" className="font-medium">
              Keşfet
            </a>
            <a href="#" className="text-black/55">
              Nasıl Çalışır?
            </a>
            <a href="#" className="text-black/55">
              İşletmeler
            </a>
          </div>

          <button className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black/80">
            Giriş Yap
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-14 md:px-8 md:pb-20 md:pt-24">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-medium tracking-wide">
            YENİ NESİL HAK PAZARYERİ
          </div>

          <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.06em] md:text-7xl">
            Hakkını al.
            <br />
            Kullan.
            <br />
            <span className="text-black/35">Devret.</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-black/55 md:text-lg">
            Gerçek ürün ve hizmetlere bağlı avantajları keşfet.
            Hakkını kullan veya şartları uygunsa başka birine devret.
          </p>

          {/* SEARCH */}
          <div className="mt-9 flex max-w-2xl items-center rounded-2xl border border-black/10 bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="flex flex-1 items-center gap-3 px-3">
              <span className="text-lg text-black/35">⌕</span>
              <input
                type="text"
                placeholder="Otel, restoran, tekne, otomotiv..."
                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-black/30"
              />
            </div>

            <button className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white">
              Ara
            </button>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium tracking-widest text-black/35">
              KATEGORİLER
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              Neye ihtiyacın var?
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {categories.map((category) => (
            <button
              key={category.name}
              className="group rounded-2xl border border-black/8 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="text-2xl">{category.icon}</div>
              <div className="mt-6 text-sm font-medium">{category.name}</div>
              <div className="mt-1 text-xs text-black/35">Keşfet →</div>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-medium tracking-widest text-black/35">
                ÖNE ÇIKAN HAKLAR
              </p>
              <h2 className="mt-1 text-3xl font-semibold tracking-[-0.03em]">
                Bugünün fırsatları
              </h2>
            </div>

            <button className="hidden text-sm font-medium md:block">
              Tümünü gör →
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {featuredRights.map((right) => (
              <article
                key={right.title}
                className="overflow-hidden rounded-3xl border border-black/8 bg-[#f7f7f5] transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-44 items-end bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-300 p-5">
                  <span className="rounded-full bg-white/85 px-3 py-1.5 text-[10px] font-semibold tracking-widest backdrop-blur">
                    {right.category}
                  </span>
                </div>

                <div className="p-5">
                  <p className="text-xs text-black/40">{right.location}</p>

                  <h3 className="mt-2 text-lg font-semibold tracking-tight">
                    {right.title}
                  </h3>

                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-black/35">Normal fiyat</p>
                      <p className="text-sm text-black/40 line-through">
                        {right.normalPrice}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-black/35">
                        Hak sahibine özel
                      </p>
                      <p className="text-xl font-semibold">
                        {right.rightPrice}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-black/8 pt-4">
                    <span className="text-xs text-black/45">
                      Devir bedeli
                    </span>
                    <span className="text-sm font-semibold">
                      {right.transferPrice}
                    </span>
                  </div>

                  <button className="mt-4 w-full rounded-xl bg-black py-3 text-sm font-medium text-white transition hover:bg-black/80">
                    Hakkı İncele
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-widest text-black/35">
            NASIL ÇALIŞIR?
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
            Bir hak. Üç basit adım.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["01", "Keşfet", "İhtiyacın olan ürün veya hizmete bağlı hakları keşfet."],
            ["02", "Al & Kullan", "Hakkı edin ve zamanı geldiğinde güvenli QR ile kullan."],
            ["03", "Devret", "Kullanmak istemiyorsan şartları uygunsa başka birine devret."],
          ].map(([number, title, description]) => (
            <div
              key={number}
              className="rounded-3xl border border-black/8 bg-white p-7"
            >
              <span className="text-xs font-semibold text-black/30">
                {number}
              </span>

              <h3 className="mt-14 text-xl font-semibold">{title}</h3>

              <p className="mt-3 text-sm leading-6 text-black/50">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-10 md:px-8">
        <div className="rounded-[2rem] bg-black px-7 py-12 text-white md:px-12 md:py-16">
          <p className="text-xs font-medium tracking-widest text-white/40">
            İŞLETMELER İÇİN
          </p>

          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
            Gelecekteki kapasiteni bugünden değerlendir.
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-6 text-white/55">
            Ürün ve hizmetlerine bağlı haklar oluştur, yeni müşterilere ulaş
            ve satışlarını dijital olarak yönet.
          </p>

          <button className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-medium text-black">
            İşletme başvurusu
          </button>
        </div>
      </section>

      {/* MOBILE NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 bg-white/95 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around">
          {[
            ["⌂", "Ana Sayfa"],
            ["⌕", "Pazar"],
            ["🎫", "Haklarım"],
            ["●", "Profil"],
          ].map(([icon, label], index) => (
            <button
              key={label}
              className={`flex flex-col items-center gap-1 text-[10px] ${
                index === 0 ? "font-semibold" : "text-black/40"
              }`}
            >
              <span className="text-lg">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* FOOTER */}
      <footer className="border-t border-black/5 bg-[#f7f7f5] px-5 py-10 pb-28 md:px-8 md:pb-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row">
          <div>
            <div className="text-lg font-bold tracking-[-0.04em]">
              HAK<span className="font-normal">DEVRİ</span>
            </div>
            <p className="mt-2 text-xs text-black/35">
              Al. Kullan. Devret.
            </p>
          </div>

          <p className="text-xs text-black/35">
            © 2026 HakDevri. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </main>
  );
}