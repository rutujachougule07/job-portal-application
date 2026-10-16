import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export interface RazorpayPaymentOptions {
  amount: number; // in Rupees, e.g. 499
  planName: string;
  description?: string;
  user: {
    name?: string;
    email?: string;
    mobile?: string;
  };
  onSuccess: (paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }) => void;
  onFailure?: (error: any) => void;
}

/**
 * Dynamically loads the Razorpay checkout script
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector('script[src*="checkout.razorpay.com"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK");
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Initiates Razorpay payment popup with verified credentials
 */
export const initiateRazorpayCheckout = async (options: RazorpayPaymentOptions) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    toast.error("पेमेंट गेटवे लोड होऊ शकला नाही. कृपया इंटरनेट तपासा.");
    options.onFailure?.("Razorpay SDK could not be loaded");
    return;
  }

  // Verified Live Key ID
  const keyId =
    (import.meta as any).env?.VITE_RAZORPAY_KEY_ID ||
    "rzp_live_ToYUfQM1T3GlJh";

  const amountInPaise = Math.round(options.amount * 100);
  let orderId: string | undefined = undefined;

  // Try to create order via PHP backend endpoint if available
  try {
    const res = await fetch("/create-order.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: options.amount,
        amount_in_paise: false,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.id) {
        orderId = data.id;
      }
    }
  } catch (err) {
    console.warn("Backend order creation skipped or failed, using direct checkout:", err);
  }

  const checkoutOptions: any = {
    key: keyId,
    amount: amountInPaise,
    currency: "INR",
    name: "REAL JOB",
    description: options.description || `Payment for ${options.planName}`,
    image: "/logo.png",
    prefill: {
      name: options.user.name || "Customer",
      email: options.user.email || "realjobandhiring@realjob.online",
      contact: options.user.mobile || "9964216090",
    },
    theme: {
      color: "#063B78",
    },
    modal: {
      ondismiss: function () {
        toast.info("पेमेंट रद्द करण्यात आले.");
        options.onFailure?.("Payment dismissed by user");
      },
    },
    handler: function (response: any) {
      if (response && response.razorpay_payment_id) {
        options.onSuccess({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });
      } else {
        toast.error("पेमेंट व्हेरिफाय होऊ शकले नाही.");
        options.onFailure?.("Invalid payment response");
      }
    },
  };

  if (orderId) {
    checkoutOptions.order_id = orderId;
  }

  try {
    const rzp = new window.Razorpay(checkoutOptions);
    rzp.on("payment.failed", function (resp: any) {
      const reason = resp?.error?.description || "पेमेंट अयशस्वी झाले.";
      toast.error(`पेमेंट अयशस्वी: ${reason}`);
      options.onFailure?.(resp?.error);
    });
    rzp.open();
  } catch (err) {
    console.error("Razorpay open error:", err);
    toast.error("पेमेंट विंडो उघडण्यात अडचण आली.");
    options.onFailure?.(err);
  }
};
