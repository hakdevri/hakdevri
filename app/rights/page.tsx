"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Right = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  purchase_price: number | null;
  transfer_price: number | null;
  valid_from: string | null;
  valid_until: string | null;
};

export default function RightsPage() {
  const [rights, setRights] = useState<Right[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadRights();
  }, []);

  async function loadRights() {
    setLoading(true);
    setErrorMessage("");

    const userResult = await supabase.auth.getUser();
    const user = userResult.data.user;

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    const rightsResult = await supabase
      .from("rights")
      .select(
        "id, title, description, category, status, purchase_price, transfer_price, valid_from, valid_until"
      )
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (rightsResult.error) {
      console.error(rightsResult.error);
      setErrorMessage(
        "Haklar yüklenirken bir hata oluştu."
      );
      setLoading(false);
      return;
    }

    setRights(rightsResult.data || []);
    setLoading(false);
  }

  function formatPrice(price: number | null) {
    if (price === null) {
      return "Belirtilmemiş";
    }

    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(price);
  }

  function formatDate(date: string | null) {
    if (!date) {
      return "Belirtilmemiş";
    }

    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  }

  function getStatusText(status: string) {
    if (status === "active") {
      return "Aktif";
    }

    if (status === "used") {
      return "Kullanıldı";
    }

    if (status === "transferred") {
      return "Devredildi";
    }

    if (status === "cancelled") {
      return "İptal";
    }

    return status;
  }

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
              href="/profile"
              className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium"
            >
              Profilim
            </a>

            <a
              href="/"
              className="hidden rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white sm:block"
            >
              Ana Sayfa
            </a>
          </div>
        </header>

        <section className="mb-10">
          <p className="text-xs font-medium tracking-[0.2em] text-black/35">
            DİJİTAL CÜZDAN
          </p>

          <div className="mt-2 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-semibold tracking-[-0.05em]">
                Haklarım
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-black/50">
                Sahip olduğun tüm hakları tek bir yerde görüntüle,
                kullanım tarihlerini takip et ve uygun haklarını
                devretmeye hazırla.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white px-5 py-4">
              <p className="text-xs text-black/40">
                Toplam Hak
              </p>

              <p className="mt-1 text-2xl font-semibold">
                {rights.length}
              </p>
            </div>
          </div>
        </section>

        {loading && (
          <div className="rounded-3xl border border-black/10 bg-white p-10 text-center">
            <p className="text-sm text-black/40">
              Hakların yükleniyor...
            </p>
          </div>
        )}

        {!loading && errorMessage && (
          <div className="rounded-3xl border border-red-200 bg-white p-10 text-center">
            <p className="text-sm text-red-600">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={loadRights}
              className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {!loading && !errorMessage && rights.length === 0 && (
          <div className="rounded-3xl border border-black/10 bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f7f5] text-lg">
              +
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              Henüz bir hakkın yok
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/45">
              HakDevri üzerinden yeni hakları keşfetmeye
              başladığında burada görüntülenecek.
            </p>

            <a
              href="/"
              className="mt-6 inline-block rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
            >
              Hakları Keşfet
            </a>
          </div>
        )}

        {!loading && !errorMessage && rights.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">

            {rights.map((right) => (
              <article
                key={right.id}
                className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_15px_45px_rgba(0,0,0,0.04)]"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <span className="inline-flex rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                      {right.category}
                    </span>

                    <h2 className="mt-4 text-xl font-semibold tracking-[-0.03em]">
                      {right.title}
                    </h2>
                  </div>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    {getStatusText(right.status)}
                  </span>

                </div>

                {right.description && (
                  <p className="mt-4 text-sm leading-6 text-black/50">
                    {right.description}
                  </p>
                )}

                <div className="mt-6 grid grid-cols-2 gap-3">

                  <div className="rounded-2xl bg-[#f7f7f5] p-4">
                    <p className="text-xs text-black/40">
                      Alış Değeri
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {formatPrice(right.purchase_price)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#f7f7f5] p-4">
                    <p className="text-xs text-black/40">
                      Devir Değeri
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {formatPrice(right.transfer_price)}
                    </p>
                  </div>

                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">

                  <div className="rounded-2xl border border-black/10 p-4">
                    <p className="text-xs text-black/40">
                      Başlangıç
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {formatDate(right.valid_from)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-black/10 p-4">
                    <p className="text-xs text-black/40">
                      Son Kullanım
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {formatDate(right.valid_until)}
                    </p>
                  </div>

                </div>

                {right.status === "active" && (
                  <button
                    type="button"
                    className="mt-5 w-full rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80"
                  >
                    Bu Hakkı Devret
                  </button>
                )}

              </article>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}