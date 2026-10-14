# Company Pillars (Mission, Vision, Values, Belief) Dynamic Section Code
# कंपनी पिलर्स (ध्येय, व्हिजन, मूल्ये, विश्वास) डायनॅमिक सेक्शन कोड

या पॅकेजमध्ये Super Admin / Sub Admin पॅनेलमध्ये नुकताच तयार केलेला **Company Pillars (Add & Delete सह डायनॅमिक कार्ड्स)** कोड दिलेला आहे.

---

## 📁 या झिप फाईलमध्ये असलेल्या फाईल्स (Files Included):

1. **`CompanyPillars_Admin_Section.tsx`**:
   - Sub-Admin / Super-Admin मधील पूर्ण UI घटक.
   - यात `+ Add Pillar Card` बटन, प्रत्येक कार्डवर लाल रंगाचे `Remove` बटन, आणि फक्त `Title` व `Description` चे इनपुट्स समाविष्ट आहेत.

2. **`CompanyPillars_Landing_Display.tsx`**:
   - मुख्य Landing Page / Website वर हे कार्ड्स कसे सुंदर व रिस्पॉन्सिव्ह ग्रिडमध्ये दिसतात त्याचा कोड (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`).

3. **`types.ts`**:
   - `CompanyPillar` चा TypeScript Interface, `defaultCompanyPillars` (4 डिफॉल्ट कार्ड्स), आणि Lucide Icons ची लिस्ट.

4. **`reference/superadmin.tsx`**:
   - तुमच्या प्रोजेक्टमधील अपडेटेड `superadmin.tsx` फाईल.

5. **`reference/index.tsx`**:
   - तुमच्या प्रोजेक्टमधील अपडेटेड लँडिंग पेज `index.tsx` फाईल.

---

## 🚀 हा सेक्शन कसा वापरावा (How to Use in Any Panel):

### १. State तयार करणे (State Definition):
```typescript
import { useState, useEffect } from "react";
import { CompanyPillar, defaultCompanyPillars } from "./types";

// State
const [companyPillars, setCompanyPillars] = useState<CompanyPillar[]>(defaultCompanyPillars);

// LocalStorage मधून लोड करणे:
useEffect(() => {
  const savedPillars = localStorage.getItem("cms_companyPillars");
  if (savedPillars) {
    try {
      setCompanyPillars(JSON.parse(savedPillars));
    } catch (e) {
      console.error(e);
    }
  }
}, []);
```

### २. सेव्ह करणे (Saving Changes):
```typescript
const handleSave = () => {
  localStorage.setItem("cms_companyPillars", JSON.stringify(companyPillars));
  toast.success("Company Pillars saved successfully!");
};
```

### ३. ॲडमिन पॅनेलमध्ये दाखवणे (Admin UI):
```tsx
<CompanyPillarsAdminSection
  pillars={companyPillars}
  onChange={(updatedPillars) => setCompanyPillars(updatedPillars)}
/>
```

### ४. लँडिंग पेजवर दाखवणे (Landing Page UI):
```tsx
<CompanyPillarsLandingDisplay pillars={companyPillars} />
```

---

## 🌟 प्रमुख वैशिष्ट्ये (Key Features):
- **+ Add Pillar Card**: एका क्लिकवर नवीन कार्ड आपोआप ॲड होते व त्याला आपोआप नवीन आयकॉन मिळतो.
- **Remove Button**: नको असलेले कार्ड एका क्लिकवर डिलीट होते.
- **फक्त २ इनपुट्स**: प्रत्येक कार्डमध्ये केवळ `Title` आणि `Description` चे सोपे इनपुट्स ठेवले आहेत.
- **Responsive Layout**: मोबाइल, टॅबलेट आणि लॅपटॉपवर कार्ड्स आपोआप व्यवस्थित अड्जस्ट होतात.
