"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Right = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  transfer_price: number | null;
  status: string;
};

export default function TransferPage() {
  const [rights, setRights] = useState<Right[]>([]);
  const [selectedRight, setSelectedRight] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadRights();
  }, []);

  async function loadRights() {
    setLoading(true);

    const userResult = await supabase.auth.getUser();
    const user = userResult.data.user;

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    const rightsResult = await supabase
      .from("rights")
      .select(
        "id, title, description, category, transfer_price, status"
      )
      .eq("owner_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (rightsResult.error) {
      console.error(rightsResult.error);
      setMessage("Haklar yüklenirken bir hata oluştu.");
      setLoading(false);
      return;
    }

    setRights(rightsResult.data || []);
    setLoading(false);
  }

  function selectRight(rightId: string) {
    setSelectedRight(rightId);

    const selected = rights.find(
      (right) => right.id === rightId
    );

    if (!selected) {
      return;
    }

    setTitle(selected.title);
    setDescription(selected.description || "");

    if (selected.transfer_price !== null) {
      setPrice(String(selected.transfer_price));
    } else {
      setPrice("");
    }

    setMessage("");
  }

  async function createTransfer(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");

    if (!selectedRight) {
      setMessage("Lütfen devretmek istediğiniz hakkı seçin.");
      return;
    }

    if (!title.trim()) {
      setMessage("Lütfen ilan başlığını girin.");
      return;
    }

    if (!price || Number(price) <= 0) {
      setMessage("Lütfen geçerli bir devir fiyatı girin.");
      return;
    }

    setSaving(true);

    const userResult = await supabase.auth.getUser();
    const user = userResult.data.user;

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    const insertResult = await supabase
      .from("transfers")
      .insert({
        right_id: selectedRight,
        seller_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        asking_price: Number(price),
        status: "listed",
      });

    if (insertResult.error) {
      console.error(insertResult.error);

      setMessage(
        "Devir ilanı oluşturulamadı: " +
          insertResult.error.message
      );

      setSaving(false);
      return;
    }

    setMessage(
      "Devir ilanınız başarıyla oluşturuldu."
    );

    setSelectedRight("");
    setTitle("");
    setDescription("");
    setPrice("");

    setSaving(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5]">
        <p className="text-sm text-black/40">
          Hakların yükleniyor...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-5 py-8 text-[#111]">
      <div className="mx-auto max-w-3xl">

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
              className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium"
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

        <section className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.05)] md:p-10">

          <p className="text-xs font-medium tracking-[0.2em] text-black/35">
            HAK DEVİR SİSTEMİ
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
            Hakkını Devret
          </h1>

          <p className="mt-3 text-sm leading-6 text-black/50">
            Kullanmadığın aktif hakkını HakDevri üzerinde
            devredilebilir bir ilana dönüştür.
          </p>

          {rights.length === 0 ? (
            <div className="mt-8 rounded-2xl bg-[#f7f7f5] p-6 text-center">

              <p className="font-medium">
                Devredilebilir aktif hakkın bulunmuyor.
              </p>

              <p className="mt-2 text-sm text-black/45">
                Önce hesabına aktif bir hak eklemen gerekiyor.
              </p>

              <a
                href="/rights"
                className="mt-5 inline-block rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
              >
                Haklarımı Gör
              </a>

            </div>
          ) : (
            <form
              onSubmit={createTransfer}
              className="mt-8 space-y-6"
            >

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Devretmek istediğin hak
                </label>

                <select
                  value={selectedRight}
                  onChange={(event) =>
                    selectRight(event.target.value)
                  }
                  className="w-full rounded-xl border border-black/10 bg-[#f7f7f5] px-4 py-3 text-sm outline-none"
                  required
                >
                  <option value="">
                    Hak seçin
                  </option>

                  {rights.map((right) => (
                    <option
                      key={right.id}
                      value={right.id}
                    >
                      {right.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  İlan başlığı
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Örn. 2 Gece Bodrum Konaklama Hakkı"
                  className="w-full rounded-xl border border-black/10 bg-[#f7f7f5] px-4 py-3 text-sm outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Açıklama
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Hakkınız hakkında bilgi verin..."
                  rows={5}
                  className="w-full resize-none rounded-xl border border-black/10 bg-[#f7f7f5] px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Devir fiyatı
                </label>

                <div className="relative">

                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={price}
                    onChange={(event) =>
                      setPrice(event.target.value)
                    }
                    placeholder="3500"
                    className="w-full rounded-xl border border-black/10 bg-[#f7f7f5] px-4 py-3 pr-14 text-sm outline-none"
                    required
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-black/40">
                    TL
                  </span>

                </div>
              </div>

              {message && (
                <div
                  className={`rounded-xl p-4 text-sm leading-6 ${
                    message.includes("başarıyla")
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-black px-5 py-3.5 text-sm font-medium text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "İlan oluşturuluyor..."
                  : "Devir İlanı Oluştur"}
              </button>

            </form>
          )}

        </section>

      </div>
    </main>
  );
}