"use client";
import { useState, useRef } from "react";

import Link from "next/link";

// UI
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Aceternity
import { GlowingEffect } from "@/components/ui/glowing-effect";

// Motion
import * as motion from "motion/react-client"

// Form
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";

type ContactField = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [token, setToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [formData, setFormData] = useState<ContactField>({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldError, setFieldError] = useState<{ [key: string]: string }>({});
  const [formSuccess, setFormSuccess] = useState("");

  const validateField = (name: string, value: string) => {
    setFormSuccess("");
    let errorMsg = "";
    const minLengthFields = ["fullName", "subject", "message"];
    if (minLengthFields.includes(name) && value.length < 2) errorMsg = `${name} must be at least 2 characters`;
    if (name === "fullName" && !value) errorMsg = "Full name is required";
    if (name === "email") {
      if (!value) errorMsg = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errorMsg = "Hmm... That doesn't look like Email";
    }
    if (name === "subject" && !value) errorMsg = "Subject is required";
    if (name === "message" && !value) errorMsg = "Message is required";
    setFieldError(prev => ({ ...prev, [name]: errorMsg }));
    return errorMsg;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const allValid = Object.entries(formData).every(
      ([field, value]) => !validateField(field, value)
    );

    if (!allValid) return;

    if (!token) return setFormError("Please complete the CAPTCHA before submitting");

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          token,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      turnstileRef.current?.reset();
      setToken(null);
      setFormError("");
      setFormSuccess("Thank you! I'll get back to you as soon as possible.");
    } catch (err) {
      console.error(err);
      setFormSuccess("");
      setFormError("Something went wrong! Please check the fields");
    } finally {
      turnstileRef.current?.reset();
      setToken(null);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[992px] flex flex-wrap gap-10 md:gap-[20px] m-auto">
      <div className="w-full max-w-full md:max-w-[calc(100%-400px-20px)] px-3 md:px-0">
        <div className="flex flex-wrap gap-4">
          <h1 className="w-full text-3xl font-bold pe-6">Contact Form</h1>
          <p className="max-w-sm">Please reach out through the Google form or just drop your enquiry/feedback/request here!</p>
          <div className="w-full mt-3 pe-6">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
              }}
            >
              <Link href={"https://docs.google.com/forms/d/e/1FAIpQLSdz8UOfmMk0fFkIJpKb9Tu6dfj4EamHgvHIK4fR0OM4AFK4ow/viewform?usp=header"} target="_blank" className="w-fit block text-sm font-medium text-white rounded-sm px-6 py-2 dark:text-black  bg-black dark:bg-white/80 transition ease-in active:bg-black/50 active:dark:bg-white/60 hover:bg-black/75 hover:dark:bg-white">Google Form</Link>
            </motion.div>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          scale: { type: "spring", visualDuration: 0.4, bounce: 0.5, delay: 0.25 },
        }}
        className="w-full max-w-full md:max-w-[400px]"
      >
        <form onSubmit={handleSubmit}>
          <Card className="relative gap-3 pb-7">
            <GlowingEffect
              blur={0}
              borderWidth={1}
              spread={80}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    onBlur={(e) => validateField("fullName", e.target.value)}
                    placeholder="John Doe"
                    required
                    className={`mb-2 ${fieldError.fullName ? "border-red-600 focus-visible:border-red-600 focus-visible:ring-red-600/50" : ""}`}
                  />
                  {fieldError.fullName && <p className="-mt-2 mb-1 text-sm text-red-600">{fieldError.fullName}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={(e) => { validateField("email", e.target.value) }}
                    placeholder="m@example.com"
                    required
                    className={`mb-2 ${fieldError.email ? "border-red-600 focus-visible:border-red-600 focus-visible:ring-red-600/50" : ""}`}
                  />
                  {fieldError.email && <p className="-mt-2 mb-1 text-sm text-red-600">{fieldError.email}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    onBlur={(e) => { validateField("subject", e.target.value) }}
                    placeholder="Spill the tea ☕ (subject pls)"
                    required
                    className={`mb-2 ${fieldError.subject ? "border-red-600 focus-visible:border-red-600 focus-visible:ring-red-600/50" : ""}`}
                  />
                  {fieldError.subject && <p className="-mt-2 mb-1 text-sm text-red-600">{fieldError.subject}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    onChange={handleInputChange}
                    value={formData.message}
                    onBlur={(e) => { validateField("message", e.target.value) }}
                    placeholder="Type your message here."
                    required
                    className={`mb-2 ${fieldError.message ? "border-red-600 focus-visible:border-red-600 focus-visible:ring-red-600/50" : ""}`}
                  />
                  {fieldError.message && <p className="-mt-2 mb-1 text-sm text-red-600">{fieldError.message}</p>}
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  scale: { type: "spring", visualDuration: 0.4, bounce: 0.5, delay: 1 },
                }}
              >
                <Turnstile
                  ref={turnstileRef}
                  className="relative my-2 text-center max-[375px]:left-[-24px]"
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                  onSuccess={(t) => { setToken(t || null); setFormError(""); }}
                  onError={() => setFormError("CAPTCHA failed. Please try again")}
                  onExpire={() => { setToken(null); setFormError("CAPTCHA expired. Please verify again"); }}
                />
              </motion.div>
              {formError && <p className="-mt-2 mb-1 text-sm text-red-600">{formError}</p>}
            </CardContent>
            <CardFooter className="items-start flex-col gap-2">
              <Button
                disabled={loading}
                type="submit"
                className={`w-full disabled:pointer-events-auto cursor-pointer bg-black dark:bg-white/80 transition ease-in hover:bg-black/75 hover:dark:bg-white active:bg-black/50 active:dark:bg-white/60 ${loading && "cursor-not-allowed bg-black/50 dark:bg-white/50 hover:bg-black/50 hover:dark:bg-white/50 active:bg-black/50 active:dark:bg-white/50"}`}
              >
                {loading ? (
                  <>
                    <svg className="mr-1 -ml-1 size-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="animate-pulse">Sending...</span>
                  </>
                ) : (
                  <>
                    Send
                  </>
                )}
              </Button>
              {formSuccess && <p className="text-sm text-green-600">{formSuccess}</p>}
            </CardFooter>
          </Card>
        </form>
      </motion.div>
    </div>
  )
}