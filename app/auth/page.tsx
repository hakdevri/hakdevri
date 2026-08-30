"use client";

import { FormEvent, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    if (mode === "register") {
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });

      if (result.error) {
        setMessage(result.error.message);
      } else {
        setMessage("Hesabınız başarıyla oluşturuldu. Giriş yapabilirsiniz.");

        setMode("login");
        setFullName("");
        setPhone("");
        setEmail("");
        setPassword("");
      }

      setLoading(false);
      return;
    }

    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (result.error) {
      setMessage(result.error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/profile";
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-5 py-10 text-[#111]">
      <div className="mx-auto flex min-h-[90vh] max-w-md items-center">
        <div className="w-full">

          <a
            href="/"
            className="mb-10 inline-block text-lg font-bold tracking-[-0.04em]"
          >
            HAK<span className="font-normal">DEVRİ</span>
          </a>

          <div className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:p-9">

            <div className="mb-8">
              <p className="text-xs font-medium tracking-widest text-black/35">
                HAKDEVRİ HESABI
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                {mode === "login"
                  ? "Tekrar hoş geldin."
                  : "Hesabını oluştur."}
              </h1>

              <p className="mt-3 text-sm leading-6 text-black/50">
                Haklarını yönet, satın al, kullan ve uygun olanları devret.
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 rounded-xl bg-[#f7f7f5] p-1">

              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setMessage("");
                }}
                className={
                  mode === "login"
                    ? "rounded-lg bg-white py-2.5 text-sm font-medium shadow-sm"
                    : "rounded-lg py-2.5 text-sm font-medium text-black/40"
                }
              >
                Giriş Yap
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setMessage("");
                }}
                className={
                  mode === "register"
                    ? "rounded-lg bg-white py-2.5 text-sm font-medium shadow-sm"
                    : "rounded-lg py-2.5 text-sm font-medium text-black/40"
                }
              >
                Kayıt Ol
              </button>

            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {mode === "register" && (
                <>
                  <div>
                    <label className="mb-2 block text-xs font-medium">
                      Ad Soyad
                    </label>

                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(event) =>
                        setFullName(event.target.value)
                      }
                      placeholder="Adınız Soyadınız"
                      className="w-full rounded-xl border border-black/10 bg-[#f7f7f5] px-4 py-3 text-sm outline-none focus:border-black/30"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium">
                      Telefon
                    </label>

                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      placeholder="05XX XXX XX XX"
                      className="w-full rounded-xl border border-black/10 bg-[#f7f7f5] px-4 py-3 text-sm outline-none focus:border-black/30"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="mb-2 block text-xs font-medium">
                  E-posta
                </label>

                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="ornek@email.com"
                  className="w-full rounded-xl border border-black/10 bg-[#f7f7f5] px-4 py-3 text-sm outline-none focus:border-black/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium">
                  Şifre
                </label>

                <input
                  required
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="En az 6 karakter"
                  className="w-full rounded-xl border border-black/10 bg-[#f7f7f5] px-4 py-3 text-sm outline-none focus:border-black/30"
                />
              </div>

              {message && (
                <div className="rounded-xl bg-black/[0.04] p-3 text-sm leading-5 text-black/60">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-black py-3.5 text-sm font-medium text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Lütfen bekleyin..."
                  : mode === "login"
                  ? "Giriş Yap"
                  : "Hesap Oluştur"}
              </button>

            </form>

            <p className="mt-6 text-center text-xs leading-5 text-black/35">
              Hesap oluşturarak HakDevri kullanım koşullarını kabul etmiş
              olursunuz.
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}