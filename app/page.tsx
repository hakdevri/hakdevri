"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type User = {
  email?: string;
};

const categories = [
  {
    number: "01",
    title: "Konaklama",
    description:
      "Otel, resort, tatil köyü ve konaklama haklarını keşfet veya devret.",
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=85",
  },
  {
    number: "02",
    title: "Restoran",
    description:
      "Kullanamayacağın rezervasyon ve deneyimleri yeni sahipleriyle buluştur.",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85",
  },
  {
    number: "03",
    title: "Etkinlik",
    description:
      "Konser, festival, spor ve özel etkinlik haklarını güvenle devret.",
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=85",
  },
  {
    number: "04",
    title: "Üyelik",
    description:
      "Spor, kulüp, spa, golf ve özel üyelik haklarını dijital olarak yönet.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85",
  },
];

const steps = [
  {
    number: "01",
    title: "Hakkını keşfet",
    description:
      "Pazaryerindeki hakları kategori ve ihtiyaçlarına göre keşfet.",
  },
  {
    number: "02",
    title: "Satın alma talebi gönder",
    description:
      "İlgilendiğin hak için satıcıya dijital satın alma talebini gönder.",
  },
  {
    number: "03",
    title: "Talep kabul edilsin",
    description:
      "Satıcı talebi kabul ettiğinde işlem bir sonraki aşamaya geçer.",
  },
  {
    number: "04",
    title: "Ödeme sürecini başlat",
    description:
      "Güvenli ödeme sürecini başlat ve işlemin durumunu panelinden takip et.",
  },
  {
    number: "05",
    title: "Devir tamamlanır",
    description:
      "İşlem tamamlandığında hak yeni sahibine aktarılır.",
  },
];

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const authListener = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({
            email: session.user.email,
          });
        } else {
          setUser(null);
        }

        setLoading(false);
      }
    );

    return () => {
      authListener.data.subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    const result = await supabase.auth.getUser();

    if (result.data.user) {
      setUser({
        email: result.data.user.email,
      });
    } else {
      setUser(null);
    }

    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f5f7]">
        <p className="text-sm text-black/40">Yükleniyor...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#111]">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-5">

          <a
            href="/"
            className="text-[22px] font-semibold tracking-[-0.07em]"
          >
            HAK<span className="font-normal">DEVRİ</span>
          </a>

          <nav className="hidden items-center gap-8 text-[13px] md:flex">

            {/* PAZARYERİ */}
            <a
              href="/discover"
              className="font-medium text-black transition hover:text-black/60"
            >
              Pazaryeri
            </a>

            <a
              href="#nasil-calisir"
              className="text-black/55 transition hover:text-black"
            >
              Nasıl Çalışır?
            </a>

            <a
              href="#neden-hakdevri"
              className="text-black/55 transition hover:text-black"
            >
              Neden HakDevri?
            </a>

            {user && (
              <>
                <a
                  href="/my-requests"
                  className="text-black/55 transition hover:text-black"
                >
                  Taleplerim
                </a>

                <a
                  href="/transactions"
                  className="text-black/55 transition hover:text-black"
                >
                  İşlemlerim
                </a>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2">

            {user ? (
              <>
                {/* GİRİŞ YAPMIŞ KULLANICI - PAZARYERİ */}
                <a
                  href="/discover"
                  className="hidden rounded-full border border-black/10 bg-white px-5 py-2.5 text-[13px] font-medium transition hover:bg-black/5 sm:block"
                >
                  Pazaryeri
                </a>

                <a
                  href="/transfers"
                  className="hidden rounded-full bg-black px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-black/80 md:block"
                >
                  İlan Ver
                </a>

                <a
                  href="/profile"
                  className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-[13px] font-medium hover:bg-black/5"
                >
                  Profil
                </a>

                <button
                  type="button"
                  onClick={logout}
                  className="hidden px-2 text-[13px] text-black/40 hover:text-black lg:block"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <a
                  href="/auth"
                  className="hidden px-3 text-[13px] font-medium text-black/55 hover:text-black sm:block"
                >
                  Giriş Yap
                </a>

                <a
                  href="/auth"
                  className="rounded-full bg-black px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-black/80"
                >
                  Ücretsiz Başla
                </a>
              </>
            )}

          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-24 pt-20 md:pb-32 md:pt-32">

        <div className="absolute left-1/2 top-[-200px] -z-0 h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-white blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">

          <div className="mx-auto max-w-5xl text-center">

            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-[11px] font-medium tracking-wide text-black/50 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-black" />
              DİJİTAL HAK PAZARYERİ
            </div>

            <h1 className="text-6xl font-semibold leading-[0.9] tracking-[-0.08em] md:text-8xl lg:text-[104px]">
              Kullanmadığın hakkı
              <br />
              <span className="text-black/30">
                değere dönüştür.
              </span>
            </h1>

            <p className="mx-auto mt-9 max-w-2xl text-base leading-7 text-black/50 md:text-lg">
              HakDevri; konaklama, restoran, etkinlik, üyelik ve
              deneyim haklarını keşfetmeni, devretmeni ve güvenli
              şekilde yönetmeni sağlayan yeni nesil dijital
              pazaryeridir.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

              {/* ANA PAZARYERİ BUTONU */}
              <a
                href="/discover"
                className="rounded-full bg-black px-8 py-4 text-sm font-medium text-white shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:bg-black/80"
              >
                Pazaryerini Keşfet →
              </a>

              <a
                href={user ? "/transfers" : "/auth"}
                className="rounded-full border border-black/10 bg-white px-8 py-4 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:bg-black/5"
              >
                {user ? "Hakkını Devret" : "Ücretsiz Başla"}
              </a>

            </div>
          </div>

          {/* MARKETPLACE HERO */}
          <div className="mx-auto mt-20 max-w-6xl">

            <div className="overflow-hidden rounded-[34px] border border-black/[0.08] bg-white p-2 shadow-[0_40px_120px_rgba(0,0,0,0.12)]">

              <div
                className="relative h-[420px] overflow-hidden rounded-[28px] bg-cover bg-center md:h-[560px]"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2200&q=90)",
                }}
              >

                <div className="absolute inset-0 bg-black/25" />

                <div className="absolute bottom-7 left-7 right-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">

                  <div className="max-w-xl text-white">

                    <p className="text-[10px] font-medium tracking-[0.25em] text-white/60">
                      HAKDEVRİ MARKETPLACE
                    </p>

                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] md:text-5xl">
                      Hakların yeni sahipleriyle buluşsun.
                    </h2>

                  </div>

                  <a
                    href="/discover"
                    className="w-fit rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90"
                  >
                    Pazaryerini Keşfet →
                  </a>

                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-8 grid max-w-5xl gap-3 sm:grid-cols-3">

            <div className="rounded-2xl border border-black/[0.07] bg-white p-5">
              <p className="text-xs text-black/35">01</p>

              <p className="mt-4 text-sm font-semibold">
                Keşfet
              </p>

              <p className="mt-1 text-xs leading-5 text-black/45">
                İhtiyacın olan hakkı bul.
              </p>
            </div>

            <div className="rounded-2xl border border-black/[0.07] bg-white p-5">
              <p className="text-xs text-black/35">02</p>

              <p className="mt-4 text-sm font-semibold">
                Teklif Ver
              </p>

              <p className="mt-1 text-xs leading-5 text-black/45">
                Satıcıya satın alma talebi gönder.
              </p>
            </div>

            <div className="rounded-2xl bg-black p-5 text-white">
              <p className="text-xs text-white/35">03</p>

              <p className="mt-4 text-sm font-semibold">
                Devri Tamamla
              </p>

              <p className="mt-1 text-xs leading-5 text-white/45">
                Ödeme ve devir sürecini yönet.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* NEDEN HAKDEVRİ */}
      <section
        id="neden-hakdevri"
        className="border-y border-black/[0.07] bg-white px-5 py-24 md:py-32"
      >

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-16 md:grid-cols-2 md:items-end">

            <div>
              <p className="text-[11px] font-medium tracking-[0.2em] text-black/35">
                NEDEN HAKDEVRİ?
              </p>

              <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-[0.98] tracking-[-0.06em] md:text-6xl">
                Kullanılmayan hakların
                <br />
                bir değeri var.
              </h2>
            </div>

            <p className="max-w-xl text-base leading-7 text-black/50">
              Hayat planları değişir. Seyahatler iptal olur,
              rezervasyonlar kullanılamaz, etkinliklere gidilemez,
              üyelikler atıl kalır. HakDevri bu kullanılmayan
              değeri yeni bir kullanıcıyla buluşturur.
            </p>

          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-3">

            <div className="rounded-[28px] bg-[#f5f5f7] p-7">
              <p className="text-xs text-black/35">01</p>

              <h3 className="mt-16 text-2xl font-semibold tracking-[-0.04em]">
                Değerini koru
              </h3>

              <p className="mt-3 text-sm leading-6 text-black/45">
                Kullanamayacağın hakkı tamamen kaybetmek yerine
                yeni bir kullanıcıya devret.
              </p>
            </div>

            <div className="rounded-[28px] bg-[#f5f5f7] p-7">
              <p className="text-xs text-black/35">02</p>

              <h3 className="mt-16 text-2xl font-semibold tracking-[-0.04em]">
                Fırsatları keşfet
              </h3>

              <p className="mt-3 text-sm leading-6 text-black/45">
                Normal şartlarda ulaşamayacağın hakları
                pazaryerinde keşfet.
              </p>
            </div>

            <div className="rounded-[28px] bg-black p-7 text-white">
              <p className="text-xs text-white/35">03</p>

              <h3 className="mt-16 text-2xl font-semibold tracking-[-0.04em]">
                Tek platform
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/45">
                İlan, talep, ödeme ve devir süreçlerini
                tek bir dijital deneyimde yönet.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* KATEGORİLER */}
      <section className="px-5 py-24 md:py-32">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>
              <p className="text-[11px] font-medium tracking-[0.2em] text-black/35">
                HAK KATEGORİLERİ
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] md:text-6xl">
                Birçok farklı hak.
              </h2>
            </div>

            <a
              href="/discover"
              className="text-sm font-medium text-black/50 hover:text-black"
            >
              Tüm pazaryerini gör →
            </a>

          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">

            {categories.map((category) => (
              <a
                key={category.number}
                href="/discover"
                className="group relative min-h-[430px] overflow-hidden rounded-[30px] bg-black"
              >

                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: "url(" + category.image + ")",
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                <div className="relative flex h-full flex-col justify-between p-7 text-white">

                  <div className="flex items-center justify-between">

                    <span className="text-xs text-white/50">
                      {category.number}
                    </span>

                    <span className="text-white/50 transition group-hover:translate-x-1 group-hover:text-white">
                      ↗️
                    </span>

                  </div>

                  <div className="max-w-md">

                    <h3 className="text-3xl font-semibold tracking-[-0.05em]">
                      {category.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-white/60">
                      {category.description}
                    </p>

                  </div>

                </div>
              </a>
            ))}

          </div>

        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section
        id="nasil-calisir"
        className="border-y border-black/[0.07] bg-white px-5 py-24 md:py-32"
      >

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-16 md:grid-cols-[0.7fr_1.3fr]">

            <div>

              <p className="text-[11px] font-medium tracking-[0.2em] text-black/35">
                NASIL ÇALIŞIR?
              </p>

              <h2 className="mt-4 text-5xl font-semibold leading-[0.95] tracking-[-0.07em] md:text-7xl">
                Basit.
                <br />
                Şeffaf.
                <br />
                Dijital.
              </h2>

            </div>

            <div className="divide-y divide-black/[0.08]">

              {steps.map((step) => (
                <div
                  key={step.number}
                  className="grid gap-5 py-7 md:grid-cols-[70px_1fr]"
                >

                  <span className="text-sm text-black/30">
                    {step.number}
                  </span>

                  <div>

                    <h3 className="text-xl font-semibold tracking-[-0.03em]">
                      {step.title}
                    </h3>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-black/45">
                      {step.description}
                    </p>

                  </div>

                </div>
              ))}

            </div>

          </div>

        </div>
      </section>

      {/* DİJİTAL PANEL */}
      <section className="bg-[#f5f5f7] px-5 py-24 md:py-32">

        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-[11px] font-medium tracking-[0.2em] text-black/35">
              DİJİTAL PANEL
            </p>

            <h2 className="mt-4 text-4xl font-semibold leading-[0.98] tracking-[-0.06em] md:text-6xl">
              Bütün süreç.
              <br />
              Tek yerde.
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-black/50">
              İlanlarını, satın alma taleplerini ve devam eden
              işlemlerini tek bir panel üzerinden takip et.
            </p>

          </div>

          <div className="mx-auto mt-14 max-w-6xl rounded-[30px] border border-black/[0.08] bg-white p-3 shadow-[0_30px_100px_rgba(0,0,0,0.08)]">

            <div className="overflow-hidden rounded-[23px] bg-[#f5f5f7]">

              <div className="border-b border-black/[0.07] bg-white px-6 py-5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[11px] tracking-[0.15em] text-black/30">
                      HAKDEVRİ
                    </p>

                    <p className="mt-1 text-lg font-semibold tracking-[-0.03em]">
                      Yönetim Paneli
                    </p>

                  </div>

                  <div className="h-9 w-9 rounded-full bg-black" />

                </div>

              </div>

              <div className="grid gap-3 p-5 sm:grid-cols-3">

                <div className="rounded-2xl bg-white p-5">
                  <p className="text-xs text-black/35">
                    Aktif İlanlar
                  </p>

                  <p className="mt-4 text-3xl font-semibold">
                    12
                  </p>

                  <p className="mt-1 text-xs text-black/35">
                    Yayında
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-5">
                  <p className="text-xs text-black/35">
                    Talepler
                  </p>

                  <p className="mt-4 text-3xl font-semibold">
                    04
                  </p>

                  <p className="mt-1 text-xs text-black/35">
                    Bekleyen
                  </p>
                </div>

                <div className="rounded-2xl bg-black p-5 text-white">
                  <p className="text-xs text-white/40">
                    İşlemler
                  </p>

                  <p className="mt-4 text-3xl font-semibold">
                    02
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    Devam ediyor
                  </p>
                </div>

              </div>

              <div className="p-5 pt-0">

                <div className="rounded-2xl bg-white p-5">

                  <div className="flex items-center justify-between">

                    <p className="text-sm font-semibold">
                      Son işlemler
                    </p>

                    <a
                      href="/transactions"
                      className="text-xs text-black/35 transition hover:text-black"
                    >
                      Tümünü gör →
                    </a>

                  </div>

                  <div className="mt-5 space-y-3">

                    <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">

                      <div>
                        <p className="text-sm font-medium">
                          Konaklama Hakkı
                        </p>

                        <p className="mt-1 text-xs text-black/35">
                          Bodrum · 4 gece
                        </p>
                      </div>

                      <span className="text-sm font-medium">
                        18.500 TL
                      </span>

                    </div>

                    <div className="flex items-center justify-between">

                      <div>
                        <p className="text-sm font-medium">
                          Etkinlik Hakkı
                        </p>

                        <p className="mt-1 text-xs text-black/35">
                          İstanbul · 2 kişi
                        </p>
                      </div>

                      <span className="text-sm font-medium">
                        6.900 TL
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-black px-5 py-28 text-white md:py-36">

        <div className="mx-auto max-w-5xl text-center">

          <p className="text-[11px] font-medium tracking-[0.25em] text-white/35">
            HAKDEVRİ
          </p>

          <h2 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-[-0.07em] md:text-8xl">
            Hakların için
            <br />
            yeni bir adres.
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-white/45">
            Kullanmadığın hakkı değere dönüştür.
            İhtiyacın olan hakkı keşfet.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

            <a
              href="/discover"
              className="rounded-full bg-white px-8 py-4 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Pazaryerini Keşfet →
            </a>

            <a
              href={user ? "/transfers" : "/auth"}
              className="rounded-full border border-white/15 px-8 py-4 text-sm font-medium text-white transition hover:bg-white/10"
            >
              {user ? "Hakkını Devret" : "Ücretsiz Başla"}
            </a>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-black px-5 pb-10 text-white">

        <div className="mx-auto max-w-7xl border-t border-white/10 pt-8">

          <div className="flex flex-col justify-between gap-8 md:flex-row">

            <div>

              <p className="text-lg font-semibold tracking-[-0.05em]">
                HAK<span className="font-normal">DEVRİ</span>
              </p>

              <p className="mt-2 text-xs text-white/30">
                Dijital hakların yeni adresi.
              </p>

            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs text-white/35">

              <a href="/discover" className="hover:text-white">
                Pazaryeri
              </a>

              <a href="#nasil-calisir" className="hover:text-white">
                Nasıl Çalışır?
              </a>

              <a href="#neden-hakdevri" className="hover:text-white">
                Neden HakDevri?
              </a>

              {user && (
                <>
                  <a href="/transfers" className="hover:text-white">
                    İlan Ver
                  </a>

                  <a href="/my-requests" className="hover:text-white">
                    Taleplerim
                  </a>

                  <a href="/transactions" className="hover:text-white">
                    İşlemlerim
                  </a>

                  <a href="/profile" className="hover:text-white">
                    Profil
                  </a>
                </>
              )}

            </div>

          </div>

          <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-[11px] text-white/25 sm:flex-row">

            <p>© 2026 HakDevri</p>

            <p>
              Dijital hakların yeni nesil pazaryeri.
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}