"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Transaction = {
  id: string;
  purchase_request_id: string;
  transfer_id: string;
  buyer_id: string;
  seller_id: string;
  sale_price: number;
  platform_fee: number;
  total_amount: number;
  payment_status: string;
  transfer_status: string;
  status: string;
  created_at: string;
  transfers: {
    title: string;
  } | null;
};

export default function PaymentPage() {
  const [transaction, setTransaction] =
    useState<Transaction | null>(null);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadTransaction();
  }, []);

  async function loadTransaction() {
    setLoading(true);
    setMessage("");

    const result = await supabase.auth.getUser();
    const user = result.data.user;

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    const resultQuery = await supabase
      .from("transactions")
      .select(
        "id, purchase_request_id, transfer_id, buyer_id, seller_id, sale_price, platform_fee, total_amount, payment_status, transfer_status, status, created_at, transfers(title)"
      )
      .eq("buyer_id", user.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(1);

    if (resultQuery.error) {
      console.error(resultQuery.error);

      setMessage(
        "İşlem bilgileri yüklenemedi: " +
          resultQuery.error.message
      );

      setLoading(false);
      return;
    }

    const rows =
      (resultQuery.data || []) as unknown as Transaction[];

    if (rows.length === 0) {
      setMessage(
        "Ödeme bekleyen bir işlem bulunamadı."
      );

      setLoading(false);
      return;
    }

    setTransaction(rows[0]);
    setLoading(false);
  }

  async function startPayment() {
    if (!transaction) {
      return;
    }

    setProcessing(true);
    setMessage("");
    setSuccess(false);

    const { data, error } = await supabase.rpc(
      "start_transaction_payment",
      {
        transaction_id: transaction.id,
      }
    );

    if (error) {
      console.error(error);

      setMessage(
        "Ödeme başlatılamadı: " +
          error.message
      );

      setProcessing(false);
      return;
    }

    if (data !== true) {
      setMessage(
        "Ödeme işlemi başlatılamadı."
      );

      setProcessing(false);
      return;
    }

    setTransaction({
      ...transaction,
      status: "payment_processing",
      payment_status: "pending",
    });

    setSuccess(true);
    setProcessing(false);
  }

  function formatPrice(amount: number) {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] px-5 py-8 text-[#111]">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-black/10 bg-white p-10 text-center">
            <p className="text-sm text-black/40">
              İşlem hazırlanıyor...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!transaction) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] px-5 py-8 text-[#111]">
        <div className="mx-auto max-w-3xl">

          <header className="mb-10">
            <a
              href="/"
              className="text-xl font-bold tracking-[-0.05em]"
            >
              HAK<span className="font-normal">
                DEVRİ
              </span>
            </a>
          </header>

          <div className="rounded-3xl border border-black/10 bg-white p-10 text-center">

            <h1 className="text-2xl font-semibold">
              İşlem bulunamadı
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/45">
              Ödeme bekleyen bir işleminiz
              bulunmuyor.
            </p>

            <a
              href="/transactions"
              className="mt-6 inline-block rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
            >
              İşlemlerime Dön
            </a>

          </div>

        </div>
      </main>
    );
  }

  const title =
    transaction.transfers &&
    transaction.transfers.title
      ? transaction.transfers.title
      : "Devir işlemi";

  const paymentStarted =
    transaction.status ===
    "payment_processing";

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-5 py-8 text-[#111]">

      <div className="mx-auto max-w-3xl">

        <header className="mb-10 flex items-center justify-between">

          <a
            href="/"
            className="text-xl font-bold tracking-[-0.05em]"
          >
            HAK<span className="font-normal">
              DEVRİ
            </span>
          </a>

          <a
            href="/transactions"
            className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium"
          >
            İşlemlerim
          </a>

        </header>

        <section className="mb-8">

          <p className="text-xs font-medium tracking-[0.2em] text-black/35">
            HAKDEVRI GÜVENLİ ÖDEME
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
            Ödeme
          </h1>

          <p className="mt-3 text-sm leading-6 text-black/50">
            İşlem bilgilerini kontrol ederek
            ödeme aşamasına geçebilirsin.
          </p>

        </section>

        {message !== "" && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-white p-5">

            <p className="text-sm text-red-600">
              {message}
            </p>

          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5">

            <p className="text-sm font-semibold text-green-800">
              Ödeme işlemi başlatıldı.
            </p>

            <p className="mt-1 text-xs leading-5 text-green-700">
              Bir sonraki aşamada güvenli ödeme
              kuruluşuna yönlendirme yapılacak.
            </p>

          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_15px_45px_rgba(0,0,0,0.04)]">

          <div className="border-b border-black/10 p-6">

            <p className="text-xs font-medium tracking-[0.15em] text-black/35">
              İŞLEM DOSYASI
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
              {title}
            </h2>

            <p className="mt-2 break-all text-xs text-black/40">
              İşlem No: {transaction.id}
            </p>

          </div>

          <div className="space-y-4 p-6">

            <div className="flex items-center justify-between">

              <span className="text-sm text-black/50">
                Satış bedeli
              </span>

              <span className="text-sm font-medium">
                {formatPrice(
                  Number(transaction.sale_price)
                )}
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-sm text-black/50">
                Platform hizmet bedeli
              </span>

              <span className="text-sm font-medium">
                {formatPrice(
                  Number(
                    transaction.platform_fee
                  )
                )}
              </span>

            </div>

            <div className="my-5 border-t border-black/10" />

            <div className="flex items-center justify-between">

              <span className="text-base font-semibold">
                Ödenecek toplam
              </span>

              <span className="text-2xl font-semibold">
                {formatPrice(
                  Number(
                    transaction.total_amount
                  )
                )}
              </span>

            </div>

          </div>

          <div className="border-t border-black/10 bg-[#f7f7f5] p-6">

            <div className="flex gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-lg">
                🔒
              </div>

              <div>

                <p className="text-sm font-semibold">
                  Güvenli ödeme
                </p>

                <p className="mt-1 text-xs leading-5 text-black/45">
                  Ödeme işleminiz yetkili ödeme
                  kuruluşu altyapısı üzerinden
                  gerçekleştirilecektir.
                </p>

              </div>

            </div>

          </div>

          <div className="p-6">

            {!paymentStarted && (
              <>
                <button
                  type="button"
                  onClick={startPayment}
                  disabled={processing}
                  className="w-full rounded-2xl bg-black px-5 py-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processing
                    ? "Ödeme hazırlanıyor..."
                    : "Güvenli Ödemeye Geç"}
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-black/35">
                  Devam ettiğinizde ödeme işlemi
                  başlatılacaktır.
                </p>
              </>
            )}

            {paymentStarted && (
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">

                <p className="text-sm font-semibold text-blue-800">
                  Ödeme işlemi hazırlanıyor
                </p>

                <p className="mt-2 text-xs leading-5 text-blue-700">
                  Güvenli ödeme kuruluşuna
                  yönlendirme için sistem hazır.
                </p>

                <div className="mt-4 rounded-xl bg-white p-4">

                  <div className="flex items-center justify-between">

                    <span className="text-xs text-black/40">
                      Ödeme durumu
                    </span>

                    <span className="text-xs font-semibold text-blue-700">
                      İŞLENİYOR
                    </span>

                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

        <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5">

          <p className="text-xs leading-5 text-black/45">
            HakDevri ödeme sürecinde kart
            bilgilerini kendi sisteminde
            saklamamalıdır. Gerçek ödeme
            entegrasyonunda kart ve ödeme
            verileri yetkili ödeme kuruluşu
            tarafından işlenecektir.
          </p>

        </div>

      </div>

    </main>
  );
}