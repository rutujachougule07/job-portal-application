import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { I18nProvider } from "../lib/i18n";
import { Toaster } from "../components/ui/sonner";

if (typeof Node === 'function' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (this: Node, child: Node) {
    if (child.parentNode !== this) {
      if (console) console.warn('Cannot remove a child from a different parent', child, this);
      return child;
    }
    return originalRemoveChild.apply(this, arguments as any);
  } as any;

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (this: Node, newNode: Node, referenceNode: Node | null) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (console) console.warn('Cannot insert before a reference node from a different parent', referenceNode, this);
      return newNode;
    }
    return originalInsertBefore.apply(this, arguments as any);
  } as any;
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error as Error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "REAL JOB — India's Trusted Blue-Collar & Industrial Job Portal" },
      {
        name: "description",
        content:
          "Right Person, Right Job, Right Opportunity. Search verified factory jobs, skilled technicians, attendance tracking & E-Salary slips on REAL JOB.",
      },
      { name: "author", content: "REAL JOB (Expertskill Technology)" },
      { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      { property: "og:site_name", content: "REAL JOB" },
      { property: "og:title", content: "REAL JOB — India's Trusted Blue-Collar & Industrial Job Portal" },
      {
        property: "og:description",
        content:
          "Find verified factory, driver, ITI, welder and technical jobs across Maharashtra and India. Hire skilled candidates with automated payroll.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://realjob.online" },
      { property: "og:image", content: "https://realjob.online/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "REAL JOB — Find Work | Find Workers" },
      {
        name: "twitter:description",
        content: "India's verified industrial recruitment, attendance management and E-Salary platform.",
      },
      { name: "twitter:image", content: "https://realjob.online/logo.png" },
    ],
    links: [
      { rel: "canonical", href: "https://realjob.online" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Manrope:wght@400;500;600;700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "shortcut icon", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "REAL JOB",
    legalName: "Expertskill Technology",
    url: "https://realjob.online",
    logo: "https://realjob.online/logo.png",
    description:
      "India's trusted digital blue-collar recruitment, industrial workforce staffing and automated payroll platform.",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-9964216090",
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi", "Marathi"],
      },
    ],
    sameAs: ["https://realjob.online"],
  };

  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "REAL JOB",
    url: "https://realjob.online",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://realjob.online/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="mr" translate="no" className="notranslate">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
      </head>
      <body className="overscroll-y-none notranslate" translate="no">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    // Clear any obsolete googtrans cookies to prevent external translate interference
    if (typeof window !== 'undefined') {
      try {
        document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = `googtrans=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      } catch {}
    }

    const handleWheel = (e: WheelEvent) => {
      if (document.activeElement instanceof HTMLInputElement && document.activeElement.type === "number") {
        document.activeElement.blur();
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <I18nProvider>
        <Outlet />
        <Toaster />
      </I18nProvider>
    </QueryClientProvider>
  );
}
