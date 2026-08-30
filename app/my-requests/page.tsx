"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type PurchaseRequest = {
  id: string;
  transfer_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  status: string;
  created_at: string;
  transfers:
    | {
        title: string;
        description: string | null;
      }
    | null;
};

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    const { data, error } = await supabase
      .from("purchase_requests")
      .select(
        `
        id,
        transfer_id,
        buyer_id,
        seller_id,
        amount,
        status,
        created_at,
        transfers (
          title,
          description
        )
      `
      )
      .eq("buyer_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);

      setMessage(
        "Talepleriniz yüklenemedi: " +
          error.message
      );

      setLoading(false);
      return;
    }

    setRequests(
      (data || []) as unknown as PurchaseRequest[]
    );

    setLoading(false);
  }

  function formatPrice(amount: number) {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  function statusText(status: string) {
    if (status === "pending") {
      return "Satıcı onayı bekleniyor";
    }

    if (status === "accepted") {
      return "Talep kabul edildi";
    }

    if (status === "rejected") {
      return "Talep reddedildi";
    }

    if (status === "cancelled") {
      return "Talep iptal edildi";
    }

    if (status === "completed") {
      return "İşlem tamamlandı";
    }

    return status;
  }

  function statusClass(status: string) {
    if (status === "pending") {
      return "bg-yellow-50 text-yellow-700";
    }

    if (status === "accepted") {
      return "bg-green-50 text-green-700";
    }

    if (status === "rejected") {
      return "bg-red-50 text-red-700";
    }

    if (status === "completed") {
      return "bg-blue-50 text-blue-700";
    }

    return "bg-black/5 text-black/50";
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-5 py-8 text-[#111]">

      <div className="mx-auto max-w-5xl">

        <header className="mb-10 flex items-center justify-between">

          <a
            href="/"
            className="text-xl font-bold tracking-[-0.05em]"
          >
            HAK<span className="font-normal">DEVRİ</span>
          </a>

          <div className="flex items-center gap-3">

            <a
              href="/discover"
              className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium"
            >
              Keşfet
            </a>

            <a
              href="/requests"
              className="hidden rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium sm:block"
            >
              Gelen Talepler
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
            ALIM YÖNETİMİ
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
            Taleplerim
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/50">
            Satın almak istediğin haklar için
            oluşturduğun talepleri buradan takip
            edebilirsin.
          </p>

        </section>

        {loading && (
          <div className="rounded-3xl border border-black/10 bg-white p-10 text-center">

            <p className="text-sm text-black/40">
              Talepler yükleniyor...
            </p>

          </div>
        )}

        {!loading && message && (
          <div className="rounded-3xl border border-red-200 bg-white p-6">

            <p className="text-sm text-red-600">
              {message}
            </p>

          </div>
        )}

        {!loading &&
          !message &&
          requests.length === 0 && (
            <div className="rounded-3xl border border-black/10 bg-white p-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f7f5]">
                —
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                Henüz satın alma talebin yok
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/45">
                Keşfet bölümünden ilgilendiğin
                bir ilana girerek satın alma talebi
                oluşturabilirsin.
              </p>

              <a
                href="/discover"
                className="mt-6 inline-block rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
              >
                Hakları Keşfet
              </a>

            </div>
          )}

        {!loading &&
          !message &&
          requests.length > 0 && (
            <div className="grid gap-5">

              {requests.map((request) => {

                const title =
                  request.transfers?.title ||
                  "Devir ilanı";

                return (
                  <article
                    key={request.id}
                    className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_15px_45px_rgba(0,0,0,0.04)]"
                  >

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                      <div>

                        <p className="text-xs font-medium tracking-[0.15em] text-black/35">
                          SATIN ALMA TALEBİ
                        </p>

                        <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                          {title}
                        </h2>

                        <p className="mt-2 text-xs text-black/40">
                          Talep tarihi:{" "}
                          {formatDate(
                            request.created_at
                          )}
                        </p>

                      </div>

                      <span
                        className={
                          "w-fit rounded-full px-4 py-2 text-xs font-medium " +
                          statusClass(request.status)
                        }
                      >
                        {statusText(request.status)}
                      </span>

                    </div>

                    {request.transfers?.description && (
                      <p className="mt-5 text-sm leading-6 text-black/50">
                        {request.transfers.description}
                      </p>
                    )}

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">

                      <div className="rounded-2xl bg-[#f7f7f5] p-5">

                        <p className="text-xs text-black/40">
                          Talep tutarı
                        </p>

                        <p className="mt-1 text-2xl font-semibold">
                          {formatPrice(
                            request.amount
                          )}
                        </p>

                      </div>

                      <div className="rounded-2xl bg-[#f7f7f5] p-5">

                        <p className="text-xs text-black/40">
                          Durum
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {statusText(
                            request.status
                          )}
                        </p>

                      </div>

                    </div>

                    {request.status === "pending" && (
                      <div className="mt-5 rounded-2xl bg-yellow-50 p-5">

                        <p className="text-sm font-medium text-yellow-800">
                          Satıcının onayı bekleniyor.
                        </p>

                        <p className="mt-1 text-xs leading-5 text-yellow-700">
                          Satıcı talebi kabul ettiğinde
                          ödeme ve devir aşamasına
                          geçebileceğiz.
                        </p>

                      </div>
                    )}

                    {request.status === "accepted" && (
                      <div className="mt-5 rounded-2xl bg-green-50 p-5">

                        <p className="text-sm font-medium text-green-800">
                          🎉 Talebin kabul edildi.
                        </p>

                        <p className="mt-1 text-xs leading-5 text-green-700">
                          Bir sonraki aşamada güvenli
                          ödeme ve devir işlemlerini
                          başlatacağız.
                        </p>

                      </div>
                    )}

                    {request.status === "rejected" && (
                      <div className="mt-5 rounded-2xl bg-red-50 p-5">

                        <p className="text-sm font-medium text-red-800">
                          Bu satın alma talebi satıcı
                          tarafından reddedildi.
                        </p>

                      </div>
                    )}

                    {request.status === "completed" && (
                      <div className="mt-5 rounded-2xl bg-blue-50 p-5">

                        <p className="text-sm font-medium text-blue-800">
                          İşlem tamamlandı.
                        </p>

                        <p className="mt-1 text-xs leading-5 text-blue-700">
                          Hak devri başarıyla
                          tamamlandı.
                        </p>

                      </div>
                    )}

                  </article>
                );
              })}

            </div>
          )}

      </div>

    </main>
  );
}