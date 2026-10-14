# Popular Job Categories (Infinite Marquee) - Full Feature Code
# लोकप्रिय नोकरी श्रेणी (पॉप्युलर जॉब कॅटेगरीज) संपूर्ण कोड

या पॅकेजमध्ये लँडिंग पेजवरील **Popular Job Categories (Infinite Marquee Scroller)** आणि **Super Admin Management Section** चा संपूर्ण चालू कोड दिलेला आहे.

---

## 📁 या झिप फाईलमध्ये असलेल्या फाईल्स (Files Included):

1. **`PopularJobCategories_Marquee.tsx`**:
   - मुख्य लँडिंग पेजवरील रिस्पॉन्सिव्ह Infinite Auto-Scroller component.
   - दोन्ही बाजूंना ब्लेंड होणारे ग्रेडियंट मास्क, ग्लास मॉर्फिझम कार्ड्स, चमकणारे ॲम्बियंट ग्लो, आणि **कोणत्याही केटेगरीवर क्लिक केल्यास थेट Seeker Login Page (`/auth?mode=login&role=worker`) उघडणारा कोड**.

2. **`PopularJobCategories_Admin_Section.tsx`**:
   - Super Admin किंवा Sub Admin पॅनेलमध्ये केटेगरीज मॅनेज करण्यासाठीचा UI घटक.
   - `+ Add Category` पर्याय, आयकॉन निवडण्याचा ड्रॉपडाऊन (Factory, Electrician, Construction, Transport, Office इत्यादी), नाव बदलणे आणि `Remove` (Delete) पर्याय.

3. **`types.ts`**:
   - `JobCategory` चा TypeScript Interface, `CATEGORY_ICONS` मॅपिंग, `DEFAULT_JOB_CATEGORIES` आणि व्हायब्रंट कलर पॅलेट्स (`CATEGORY_PALETTES`).

4. **`marquee.css`**:
   - स्मूथ आणि अखंड (Infinite) हॉरिझॉन्टल स्क्रोलिंगसाठी लागणारे CSS Keyframes व `.animate-marquee-slow` क्लास.

5. **`reference/index.tsx`**:
   - तुमच्या प्रोजेक्टमधील मुख्य लँडिंग पेजचा संपूर्ण अपडेटेड कोड.

6. **`reference/superadmin.tsx`**:
   - तुमच्या प्रोजेक्टमधील Super Admin डॅशबोर्डचा संपूर्ण अपडेटेड कोड.

---

## 🚀 हा कोड नवीन प्रोजेक्टमध्ये कसा वापरायचा (How to Integrate):

### १. CSS ॲड करणे:
तुमच्या मुख्य `styles.css` किंवा `globals.css` फाईलमध्ये `marquee.css` मधील कोड जोडा:
```css
@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

.animate-marquee-slow {
  display: flex;
  width: max-content;
  animation: marquee 30s linear infinite;
}

.animate-marquee-slow:hover {
  animation-play-state: paused;
}
```

### २. लँडिंग पेजवर वापरणे (Landing Page Usage):
```tsx
import { useState, useEffect } from "react";
import { PopularJobCategoriesMarquee } from "./PopularJobCategories_Marquee";
import { DEFAULT_JOB_CATEGORIES } from "./types";

export function LandingPage() {
  const [categories, setCategories] = useState(DEFAULT_JOB_CATEGORIES);

  useEffect(() => {
    const saved = localStorage.getItem("cms_categories");
    if (saved) {
      try {
        setCategories(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  return (
    <div>
      <PopularJobCategoriesMarquee categories={categories} />
    </div>
  );
}
```

### ३. Super Admin मध्ये वापरणे (Admin Panel Usage):
```tsx
import { useState } from "react";
import { PopularJobCategoriesAdminSection } from "./PopularJobCategories_Admin_Section";
import { DEFAULT_JOB_CATEGORIES } from "./types";

export function AdminCMS() {
  const [categories, setCategories] = useState(DEFAULT_JOB_CATEGORIES);

  const handleSave = () => {
    localStorage.setItem("cms_categories", JSON.stringify(categories));
    alert("Categories saved successfully!");
  };

  return (
    <div>
      <PopularJobCategoriesAdminSection
        categories={categories}
        onChange={setCategories}
      />
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
}
```

---

## ✨ प्रमुख वैशिष्ट्ये (Key Features):
- **Seeker Login Redirect**: कोणत्याही केटेगरीवर क्लिक करताच युझर लगेच Job Seeker Login पेजवर जातो.
- **Infinite Smooth Scroll**: ३० सेकंदांचे संतत आणि अखंड स्क्रोलिंग जे माउस फिरवल्यास आपोआप थांबते (Pause on Hover).
- **Superadmin Dynamic Control**: Admin मधून नवीन केटेगरी जोडणे, काढून टाकणे, आणि आयकॉन बदलणे शक्य.
- **No Limit**: ५ ची मर्यादा काढून टाकली आहे, जितक्या केटेगरी जोडाल तितक्या सर्व व्यवस्थित दिसतील.
