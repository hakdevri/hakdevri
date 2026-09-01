"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

type Transfer = {
  id: string;
  right_id: string;
  seller_id: string;
  title: string;
  description: string | null;
  asking_price: number;
  status: string;
  created_at: string;
};

const categories = [
  {
    name: "Tümü",
    icon: "✦",
  },
  {
    name: "Konaklama",
    icon: "⌂",
  },
  {
    name: "Restoran",
    icon: "◉",
  },
  {
    name: "Etkinlik",
    icon: "◇",
  },
  {
    name: "Üyelik",
    icon: "○",
  },
];

const categoryImages = [
  {
    title: "Konaklama hakları",
    description:
      "Otel, tatil köyü ve seçkin konaklama deneyimlerini keşfet.",
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Restoran deneyimleri",
    description:
      "Özel restoran ve gastronomi haklarını tek yerde bul.",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Etkinlik ve deneyim",
    description:
      "Konserlerden özel etkinliklere kadar farklı deneyimleri keşfet.",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85",
  },
];

export default function DiscoverPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tümü");

  useEffect(() => {
    loadTransfers();
  }, []);

  async function loadTransfers() {
    setLoading(true);
    setMessage("");

    const userResult = await supabase.auth.getUser();

    if (!userResult.data.user) {
      window.location.href = "/auth";
      return;
    }

    const result = await supabase
      .from("transfers")
      .select(
        "id, right_id, seller_id, title, description, asking_price, status, created_at"
      )
      .eq("status", "listed")
      .order("created_at", {
        ascending: false,
      });

    if (result.error) {
      console.error(result.error);
      setMessage("İlanlar yüklenirken bir hata oluştu.");
      setLoading(false);
      return;
    }

    setTransfers(result.data || []);
    setLoading(false);
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(price);
  }

  const filteredTransfers = useMemo(() => {
    const searchText = search.toLocaleLowerCase("tr-TR").trim();

    return transfers.filter((transfer) => {
      if (!searchText) return true;

      return (
        transfer.title.toLocaleLowerCase("tr-TR").includes(searchText) ||
        (transfer.description || "")
          .toLocaleLowerCase("tr-TR")
          .includes(searchText)
      );
    });
  }, [transfers, search]);

  return (
    <main className="min-h-screen bg-[#f5f5f3] text-[#111]">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#f5f5f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">

          <a
            href="/"
            className="text-[21px] font-semibold tracking-[-0.055em]"
          >
            HAK<span className="font-normal">DEVRİ</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="/discover"
              className="text-sm font-medium text-black"
            >
              Pazaryeri
            </a>

            <a
              href="/rights"
              className="text-sm text-black/45 transition hover:text-black"
            >
              Haklarım
            </a>

            <a
              href="/my-requests"
              className="text-sm text-black/45 transition hover:text-black"
            >
              Taleplerim
            </a>

            <a
              href="/transactions"
              className="text-sm text-black/45 transition hover:text-black"
            >
              İşlemlerim
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="/transfers"
              className="hidden rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium transition hover:border-black/20 sm:block"
            >
              İlanlarım
            </a>

            <a
              href="/profile"
              className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/80"
            >
              Profilim
            </a>
          </div>

        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-black/[0.06] bg-[#f5f5f3]">

        <div className="mx-auto max-w-7xl px-5 pb-16 pt-16 lg:px-8 lg:pb-24 lg:pt-24">

          <div className="max-w-4xl">

            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-black/35">
              HAKDEVRİ PAZARYERİ
            </p>

            <h1 className="text-5xl font-semibold leading-[0.94] tracking-[-0.065em] sm:text-6xl lg:text-8xl">
              İhtiyacın olan
              <br />
              hakkı keşfet.
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-black/50 sm:text-lg">
              Kullanmadığın hakları güvenli şekilde devret,
              başkalarının sunduğu hakları keşfet ve sana uygun
              deneyimi tek bir dijital pazaryerinden satın al.
            </p>

          </div>

          {/* SEARCH */}
          <div className="mt-12 max-w-4xl">

            <div className="relative">

              <div className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-black/30">
                ⌕
              </div>

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Otel, restoran, etkinlik veya hak ara..."
                className="h-16 w-full rounded-2xl border border-black/10 bg-white px-14 text-sm shadow-[0_15px_50px_rgba(0,0,0,0.04)] outline-none transition placeholder:text-black/30 focus:border-black/20 focus:shadow-[0_20px_60px_rgba(0,0,0,0.07)]"
              />

            </div>

          </div>

        </div>

      </section>

      {/* CATEGORY */}
      <section className="border-b border-black/[0.06] bg-white">

        <div className="mx-auto max-w-7xl overflow-x-auto px-5 lg:px-8">

          <div className="flex min-w-max items-center gap-2 py-5">

            {categories.map((item) => {
              const active = category === item.name;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setCategory(item.name)}
                  className={
                    active
                      ? "rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white"
                      : "rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm text-black/50 transition hover:border-black/20 hover:text-black"
                  }
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </button>
              );
            })}

          </div>

        </div>

      </section>

      {/* EXPERIENCE CATEGORIES */}
      <section className="bg-white px-5 py-20 lg:px-8 lg:py-28">

        <div className="mx-auto max-w-7xl">

          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-black/30">
                KATEGORİLER
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] md:text-5xl">
                Bir hak, yeni bir deneyim.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-black/45">
              Konaklamadan gastronomiye, etkinliklerden üyeliklere kadar
              farklı hakları tek bir yerde keşfet.
            </p>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {categoryImages.map((item) => (
              <div
                key={item.title}
                className="group relative min-h-[420px] overflow-hidden rounded-[28px] bg-black"
              >

                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-7 text-white">

                  <h3 className="text-2xl font-semibold tracking-[-0.04em]">
                    {item.title}
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-white/70">
                    {item.description}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* LISTINGS */}
      <section className="px-5 py-20 lg:px-8 lg:py-28">

        <div className="mx-auto max-w-7xl">

          <div className="mb-10 flex items-end justify-between">

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-black/30">
                PAZARYERİ
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] md:text-5xl">
                Yayındaki haklar
              </h2>
            </div>

            {!loading && (
              <p className="hidden text-sm text-black/40 sm:block">
                {filteredTransfers.length} hak
              </p>
            )}

          </div>

          {loading && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-[470px] animate-pulse rounded-[28px] border border-black/10 bg-white"
                />
              ))}

            </div>
          )}

          {!loading && message && (
            <div className="rounded-[28px] border border-red-200 bg-white p-12 text-center">

              <p className="text-sm text-red-600">
                {message}
              </p>

              <button
                type="button"
                onClick={loadTransfers}
                className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
              >
                Tekrar Dene
              </button>

            </div>
          )}

          {!loading &&
            !message &&
            filteredTransfers.length === 0 && (
              <div className="rounded-[28px] border border-black/10 bg-white px-6 py-20 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f5f5f3] text-xl">
                  ✦
                </div>

                <h3 className="mt-6 text-2xl font-semibold tracking-[-0.04em]">
                  Henüz uygun bir hak yok.
                </h3>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/45">
                  Arama kriterlerini değiştirebilir veya daha sonra tekrar
                  kontrol edebilirsin.
                </p>

              </div>
            )}

          {!loading &&
            !message &&
            filteredTransfers.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                {filteredTransfers.map((transfer, index) => (

                  <article
                    key={transfer.id}
                    className="group overflow-hidden rounded-[28px] border border-black/10 bg-white transition duration-500 hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(0,0,0,0.08)]"
                  >

                    <div className="relative h-64 overflow-hidden bg-[#e9e9e5]">

                      <img
                        src={categoryImages[index % categoryImages.length].image}
                        alt={transfer.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                      <div className="absolute left-5 top-5">

                        <span className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-medium shadow-sm">
                          Hak Devri
                        </span>

                      </div>

                      <div className="absolute bottom-5 left-5">

                        <span className="rounded-full bg-black/70 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur">
                          Yayında
                        </span>

                      </div>

                    </div>

                    <div className="p-6">

                      <h3 className="text-xl font-semibold leading-tight tracking-[-0.035em]">
                        {transfer.title}
                      </h3>

                      {transfer.description && (
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-black/45">
                          {transfer.description}
                        </p>
                      )}

                      <div className="mt-7 flex items-end justify-between gap-4">

                        <div>

                          <p className="text-[11px] uppercase tracking-[0.15em] text-black/30">
                            Devir fiyatı
                          </p>

                          <p className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
                            {formatPrice(transfer.asking_price)}
                          </p>

                        </div>

                        <a
                          href={"/discover/" + transfer.id}
                          className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80"
                        >
                          İncele
                        </a>

                      </div>

                    </div>

                  </article>

                ))}

              </div>
            )}

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-black/[0.06] bg-white px-5 py-20 lg:px-8 lg:py-28">

        <div className="mx-auto max-w-7xl">

          <div className="max-w-3xl">

            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-black/30">
              NASIL ÇALIŞIR?
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              Hak sahibi olmanın
              <br />
              yeni yolu.
            </h2>

          </div>

          <div className="mt-16 grid gap-0 border-t border-black/10 md:grid-cols-3">

            <div className="border-b border-black/10 py-8 md:border-b-0 md:border-r md:pr-10">

              <span className="text-xs font-medium text-black/30">
                01
              </span>

              <h3 className="mt-6 text-xl font-semibold">
                Keşfet
              </h3>

              <p className="mt-3 text-sm leading-6 text-black/45">
                İhtiyacına uygun otel, restoran, etkinlik veya üyelik
                haklarını pazaryerinde keşfet.
              </p>

            </div>

            <div className="border-b border-black/10 py-8 md:border-b-0 md:border-r md:px-10">

              <span className="text-xs font-medium text-black/30">
                02
              </span>

              <h3 className="mt-6 text-xl font-semibold">
                Talep et
              </h3>

              <p className="mt-3 text-sm leading-6 text-black/45">
                Beğendiğin hak için satın alma talebi oluştur.
                Satıcının onayından sonra güvenli ödeme aşamasına geç.
              </p>

            </div>

            <div className="py-8 md:pl-10">

              <span className="text-xs font-medium text-black/30">
                03
              </span>

              <h3 className="mt-6 text-xl font-semibold">
                Kullan
              </h3>

              <p className="mt-3 text-sm leading-6 text-black/45">
                Devir tamamlandığında hakkın hesabına aktarılır.
                Kullanım zamanı geldiğinde dijital doğrulama ile kullan.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* SELL CTA */}
      <section className="bg-black px-5 py-24 text-white lg:px-8 lg:py-32">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-12 md:flex-row md:items-end">

          <div className="max-w-3xl">

            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/35">
              KULLANMADIĞIN HAK
            </p>

            <h2 className="mt-5 text-4xl font-semibold leading-[0.98] tracking-[-0.06em] md:text-6xl">
              Kullanmadığın hakkı
              <br />
              değerlendirmeye dönüştür.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/50">
              Sahip olduğun ve kullanmayacağın bir hakkı HakDevri
              pazaryerinde güvenli şekilde satışa sun.
            </p>

          </div>

          <a
            href="/rights/transfer"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-medium text-black transition hover:bg-white/90"
          >
            Hakkımı Devret
          </a>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-black px-5 pb-10 text-white lg:px-8">

        <div className="mx-auto max-w-7xl border-t border-white/10 pt-8">

          <div className="flex flex-col justify-between gap-4 text-sm md:flex-row">

            <p className="font-medium">
              HAK<span className="font-normal">DEVRİ</span>
            </p>

            <p className="text-white/35">
              Dijital hakların yeni adresi.
            </p>

            <p className="text-white/30">
              © 2026 HakDevri
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}