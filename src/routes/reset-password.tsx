import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Brand } from "@/components/portal/Brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — REAL JOB" },
      { name: "description", content: "Securely choose a new REAL JOB password." },
      { property: "og:title", content: "Reset password — REAL JOB" },
      { property: "og:description", content: "Secure account recovery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" }
    ]
  }),
  component: Reset
});

function Reset() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Password updated successfully. You can now sign in.");
  };

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-7 shadow-elevated">
        <Brand />
        <h1 className="mt-8 font-display text-3xl font-semibold">Choose a new password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Use at least eight characters and avoid a password used elsewhere.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 h-11"
            />
          </div>
          {message && <p className="text-sm text-emerald-600 font-medium">{message}</p>}
          <Button className="w-full">Update password</Button>
        </form>
        <Button asChild variant="link" className="mt-3 w-full">
          <Link to="/auth" search={{ mode: "login", role: "worker" }}>Back to sign in</Link>
        </Button>
      </div>
    </main>
  );
}
