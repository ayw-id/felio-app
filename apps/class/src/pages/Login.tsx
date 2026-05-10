import { useState, useEffect } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import {
  loginSchema,
  verifyOtpSchema,
  passwordSubmitSchema,
} from "@/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LogIn } from "lucide-react";
import { storageNames } from "/src/utils/constants";
import { useAuth } from "@/hooks/useAuth";

const OTP_EXP = 90_000; // 90 sec in ms
const OTP_KEY = "RESTO_OTP_EXPIRES"; // localStorage key
const EMAIL_KEY = "RESTO_EMAIL_EXPIRES";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remaining, setRemaining] = useState<number>(() => {
    const exp = Number(localStorage.getItem(OTP_KEY) || 0);
    return Math.max(exp - Date.now(), 0);
  });
  const [step, setStep] = useState<
    "email" | "otp" | "password" | "setPassword" | "done"
  >("email");
  const [successMsg, setSuccessMsg] = useState("");

  const { authMutation } = useAuth();

  useEffect(() => {
    const exp = Number(localStorage.getItem(OTP_KEY) || 0);
    const email = localStorage.getItem(EMAIL_KEY);
    if (Date.now() < exp) {
      setStep("otp");
      setEmail(email);
    }
  }, []);

  /* Tick every second when in OTP step */
  useEffect(() => {
    if (step !== "otp") return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1000) {
          localStorage.removeItem(OTP_KEY);
          localStorage.removeItem(EMAIL_KEY);
          clearInterval(id);
          return 0;
        }
        return r - 1000;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [step]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = loginSchema.safeParse({ email });
    if (!parsed.success) {
      alert("Email tidak valid");
      return;
    }

    setLoading(true);

    authMutation(
      {
        path: "login",
        payload: { email },
      },
      {
        onSuccess: async (data: any) => {
          setLoading(false);
          if (data?.submitOTP) {
            // persist 90‑second window
            const expires = Date.now() + OTP_EXP;
            localStorage.setItem(OTP_KEY, String(expires));
            localStorage.setItem(EMAIL_KEY, email);
            setRemaining(OTP_EXP);
            setStep("otp");
          } else if (
            data?.isAdmin === undefined &&
            data?.submitOTP === undefined
          ) {
            setStep("password");
          } else if (data?.isAdmin === true) {
            window.location.href = import.meta.env.VITE_APP;
          }
        },
        onError: (error: any) => {
          setLoading(false);
          alert(error.message || "Gagal login");
        },
      }
    );
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = verifyOtpSchema.safeParse({ email, otp });
    if (!parsed.success) {
      alert("OTP tidak valid");
      return;
    }

    setLoading(true);

    authMutation(
      {
        path: "verifyOTP",
        payload: { email, otp },
      },
      {
        onSuccess: async (data: any) => {
          setLoading(false);
          localStorage.removeItem(OTP_KEY); // done with OTP
          localStorage.removeItem(EMAIL_KEY); // done with OTP
          setStep("setPassword");
        },
        onError: (error: any) => {
          setLoading(false);
          alert(error.message);
        },
      }
    );
  };

  const handleRegisterPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = passwordSubmitSchema.safeParse({ email, password });
    if (!parsed.success) {
      alert("Kata sandi minimal 6 karakter");
      return;
    }

    setLoading(true);

    authMutation(
      {
        path: "registerPassword",
        payload: { email, password },
      },
      {
        onSuccess: async (data: any) => {
          setLoading(false);
          setSuccessMsg("Kata sandi berhasil disetel");
          setStep("done");
        },
        onError: (error: any) => {
          setLoading(false);
          alert(error.message);
        },
      }
    );
  };

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = passwordSubmitSchema.safeParse({ email, password });
    if (!parsed.success) {
      alert("Kata sandi tidak valid");
      return;
    }

    setLoading(true);

    authMutation(
      {
        path: "verifyPassword",
        payload: { email, password },
      },
      {
        onSuccess: async (data: any) => {
          setLoading(false);
          localStorage.setItem(
            storageNames.restoToken,
            JSON.stringify(data.token)
          );
          window.location.href = import.meta.env.BASE_URL;
        },
        onError: (error: any) => {
          setLoading(false);
          alert(error.message);
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <LogIn className="w-6 h-6 text-blue-600" />
            Masuk Karyawan
          </CardTitle>
          <CardDescription>Masukkan kredensial Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={
              step === "email"
                ? handleEmailSubmit
                : step === "otp"
                ? handleOtpSubmit
                : step === "setPassword"
                ? handleRegisterPassword
                : step === "password"
                ? handleVerifyPassword
                : (e) => e.preventDefault()
            }
          >
            {/* email field always disabled once OTP/password stage */}
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled={step !== "email"}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {step === "otp" && (
              <>
                <Label htmlFor="otp">Kode OTP</Label>
                <Input
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Masukkan kode OTP"
                  required
                />
                <p className="text-sm text-gray-500 my-4">
                  Kirim ulang dalam {Math.ceil(remaining / 1000)} detik
                </p>
              </>
            )}

            {step === "setPassword" && (
              <>
                <Label htmlFor="password">Kata Sandi</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Label htmlFor="confirm">Ulangi Kata Sandi</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </>
            )}

            {step === "password" && (
              <>
                <Label htmlFor="password">Kata Sandi</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </>
            )}

            {step === "done" && (
              <div className="text-center space-y-4">
                <p className="text-green-600 font-medium">{successMsg}</p>
                <Button
                  onClick={() => {
                    localStorage.removeItem(OTP_KEY);
                    setEmail("");
                    setPassword("");
                    setOtp("");
                    setConfirmPassword("");
                    setStep("email");
                  }}
                >
                  Masuk ulang
                </Button>
              </div>
            )}

            {step !== "done" && (
              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading
                  ? "Loading ..."
                  : step === "email"
                  ? "Masuk"
                  : step === "otp"
                  ? "Verifikasi OTP"
                  : "Masukkan Kata Sandi"}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
