"use client";

import { useEffect, useState } from "react";
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

export default function DiscoverPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

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

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  }

  const filteredTransfers = transfers.filter((transfer) => {
    const searchText = search
      .toLocaleLowerCase("tr-TR")
      .trim();

    if (!searchText) {
      return true;
    }

    return (
      transfer.title
        .toLocaleLowerCase("tr-TR")
        .includes(searchText) ||
      (transfer.description || "")
        .toLocaleLowerCase("tr-TR")
        .includes(searchText)
    );
  });

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-5 py-8 text-[#111]">
      <div className="mx-auto max-w-6xl">

        <header className="mb-10 flex items-center justify-between">
          <a
            href="/"
            className="text-xl font-bold tracking-[-0.05em]"
          >
            HAK<span className="font-normal">DEVRİ</span>
          </a>

          <div className="flex items-center gap-3">

            <a
              href="/rights"
              className="hidden rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium sm:block"
            >
              Haklarım
            </a>

            <a
              href="/transfers"
              className="hidden rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium sm:block"
            >
              İlanlarım
            </a>

            <a
              href="/profile"
              className="rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white"
            >
              Profilim
            </a>

          </div>
        </header>

        <section className="mb-8">
          <p className="text-xs font-medium tracking-[0.2em] text-black/35">
            HAKDEVRİ PAZARYERİ
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
            Hakları Keşfet
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/50">
            Kullanmak istediğin hakları keşfet,
            ilanları incele ve uygun olanı bul.
          </p>
        </section>

        <div className="mb-8">
          <div className="relative">

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Hak, ilan veya açıklama ara..."
              className="w-full rounded-2xl border border-black/10 bg-white px-5 py-4 pl-12 text-sm outline-none shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
            />

            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30">
              ⌕
            </span>

          </div>
        </div>

        {loading && (
          <div className="rounded-3xl border border-black/10 bg-white p-10 text-center">
            <p className="text-sm text-black/40">
              Yayındaki haklar yükleniyor...
            </p>
          </div>
        )}

        {!loading && message && (
          <div className="rounded-3xl border border-red-200 bg-white p-10 text-center">

            <p className="text-sm text-red-600">
              {message}
            </p>

            <button
              type="button"
              onClick={loadTransfers}
              className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
            >
              Tekrar Dene
            </button>

          </div>
        )}

        {!loading &&
          !message &&
          filteredTransfers.length === 0 && (
            <div className="rounded-3xl border border-black/10 bg-white p-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f7f5] text-lg">
                —
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                İlan bulunamadı
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/45">
                Şu anda aradığın kriterlere uygun
                yayında bir hak bulunmuyor.
              </p>

            </div>
          )}

        {!loading &&
          !message &&
          filteredTransfers.length > 0 && (
            <>
              <div className="mb-5 flex items-center justify-between">

                <p className="text-sm text-black/45">
                  {filteredTransfers.length} ilan bulundu
                </p>

                <span className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs text-black/45">
                  Yayında
                </span>

              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                {filteredTransfers.map((transfer) => (
                  <article
                    key={transfer.id}
                    className="group overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_15px_45px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
                  >

                    <div className="h-36 bg-[#ecece8] p-5">

                      <div className="flex items-start justify-between">

                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium">
                          Hak Devri
                        </span>

                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                          Yayında
                        </span>

                      </div>

                    </div>

                    <div className="p-6">

                      <h2 className="text-xl font-semibold tracking-[-0.03em]">
                        {transfer.title}
                      </h2>

                      {transfer.description && (
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/50">
                          {transfer.description}
                        </p>
                      )}

                      <div className="mt-5">

                        <p className="text-xs text-black/40">
                          Devir fiyatı
                        </p>

                        <p className="mt-1 text-2xl font-semibold tracking-[-0.03em]">
                          {formatPrice(transfer.asking_price)}
                        </p>

                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs text-black/40">

                        <span>
                          Yayın tarihi
                        </span>

                        <span>
                          {formatDate(transfer.created_at)}
                        </span>

                      </div>

                      <a
                        href={"/discover/" + transfer.id}
                        className="mt-5 block w-full rounded-xl bg-black px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-black/80"
                      >
                        Hakkı İncele
                      </a>

                    </div>

                  </article>
                ))}

              </div>
            </>
          )}

      </div>
    </main>
  );
}