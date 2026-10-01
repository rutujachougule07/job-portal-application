import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  Globe,
  HardHat,
  HeartHandshake,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { PublicHeader } from "@/components/portal/PublicHeader";
import { PublicFooter } from "@/components/portal/PublicFooter";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — REAL JOB | Find Work | Find Workers" },
      { name: "description", content: "Learn about REAL JOB — India's trusted digital workforce & recruitment platform connecting verified workers with top employers." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t, n } = useI18n();

  return (
    <>
      <PublicHeader />
      <main className="bg-[#F5F8FC] min-h-screen">
        {/* Banner Section */}
        <section className="bg-hero-overlay text-white py-16 sm:py-24 relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FFC400] backdrop-blur-md mb-4">
                <Sparkles className="size-4" />
                {t("aboutHeroEyebrow")}
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-white">
                {t("heroTitleLine1")} {t("heroTitleLine2")} <br />
                <span className="text-[#FFC400]">{t("heroTitleLine3")}</span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl font-medium text-white/90 leading-relaxed">
                {t("aboutHeroSub")}
              </p>
            </div>
          </div>
        </section>

        {/* Core Stats Bar */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-2xl p-6 shadow-xl border border-[#DCE5F0]">
            <div className="text-center p-3 border-r border-[#DCE5F0] last:border-0">
              <span className="text-3xl sm:text-4xl font-black text-[#063B78]">{n("50,000+")}</span>
              <span className="block text-xs font-bold text-[#5B6B7F] mt-1">{t("statWorkers")}</span>
            </div>
            <div className="text-center p-3 border-r border-[#DCE5F0] last:border-0">
              <span className="text-3xl sm:text-4xl font-black text-[#125BB5]">{n("10,000+")}</span>
              <span className="block text-xs font-bold text-[#5B6B7F] mt-1">{t("statEmployers")}</span>
            </div>
            <div className="text-center p-3 border-r border-[#DCE5F0] last:border-0">
              <span className="text-3xl sm:text-4xl font-black text-[#063B78]">{n("1,50,000+")}</span>
              <span className="block text-xs font-bold text-[#5B6B7F] mt-1">{t("statJobs")}</span>
            </div>
            <div className="text-center p-3">
              <span className="text-3xl sm:text-4xl font-black text-[#FFC400] text-[#082F63] px-2 py-0.5 rounded bg-[#FFC400]">{n("100%")}</span>
              <span className="block text-xs font-bold text-[#5B6B7F] mt-1">{t("statContact")}</span>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              <div className="card-realjob p-8 flex flex-col justify-between">
                <div>
                  <div className="size-14 rounded-2xl bg-[#063B78]/10 text-[#063B78] flex items-center justify-center mb-6">
                    <Target className="size-8" />
                  </div>
                  <h2 className="text-2xl font-black text-[#10233F]">{t("ourMission")}</h2>
                  <p className="mt-4 text-sm font-semibold text-[#5B6B7F] leading-relaxed">
                    {t("ourMissionDesc")}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#DCE5F0] flex items-center gap-2 text-xs font-extrabold text-[#063B78]">
                  <CheckCircle2 className="size-4 text-[#FFC400]" />
                  {t("trustCommission")} • {t("trustPhone")}
                </div>
              </div>

              <div className="card-realjob p-8 flex flex-col justify-between">
                <div>
                  <div className="size-14 rounded-2xl bg-[#125BB5]/10 text-[#125BB5] flex items-center justify-center mb-6">
                    <Globe className="size-8" />
                  </div>
                  <h2 className="text-2xl font-black text-[#10233F]">{t("ourVision")}</h2>
                  <p className="mt-4 text-sm font-semibold text-[#5B6B7F] leading-relaxed">
                    {t("ourVisionDesc")}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#DCE5F0] flex items-center gap-2 text-xs font-extrabold text-[#125BB5]">
                  <CheckCircle2 className="size-4 text-[#FFC400]" />
                  {t("trustVerified")}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How REAL JOB Works */}
        <section className="py-16 bg-white border-y border-[#DCE5F0]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-black uppercase tracking-wider text-[#125BB5] bg-[#EBF1F8] px-3 py-1 rounded-full">
                {t("howWorksSimple")}
              </span>
              <h2 className="mt-3 text-3xl font-black text-[#10233F] sm:text-4xl">
                {t("howWorks")}
              </h2>
              <p className="mt-3 text-base font-semibold text-[#5B6B7F]">
                {t("howWorksSubtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* For Workers */}
              <div className="bg-[#F5F8FC] p-8 rounded-2xl border border-[#DCE5F0]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-10 rounded-xl bg-[#FFC400] text-[#082F63] flex items-center justify-center font-black">
                    <HardHat className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#10233F]">{t("forWorkersTitle")}</h3>
                    <span className="text-xs font-bold text-[#125BB5]">{t("seekerDesc")}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <span className="size-8 rounded-full bg-[#063B78] text-white font-black text-xs flex items-center justify-center shrink-0">{n(1)}</span>
                    <div>
                      <h4 className="font-extrabold text-[#10233F] text-sm">{t("forWorkersStep1Title")}</h4>
                      <p className="text-xs text-[#5B6B7F] mt-1 font-semibold">{t("forWorkersStep1Desc")}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="size-8 rounded-full bg-[#063B78] text-white font-black text-xs flex items-center justify-center shrink-0">{n(2)}</span>
                    <div>
                      <h4 className="font-extrabold text-[#10233F] text-sm">{t("forWorkersStep2Title")}</h4>
                      <p className="text-xs text-[#5B6B7F] mt-1 font-semibold">{t("forWorkersStep2Desc")}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="size-8 rounded-full bg-[#063B78] text-white font-black text-xs flex items-center justify-center shrink-0">{n(3)}</span>
                    <div>
                      <h4 className="font-extrabold text-[#10233F] text-sm">{t("forWorkersStep3Title")}</h4>
                      <p className="text-xs text-[#5B6B7F] mt-1 font-semibold">{t("forWorkersStep3Desc")}</p>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full mt-8 btn-yellow font-extrabold text-sm py-3">
                  <Link to="/jobs">{t("jobs")}</Link>
                </Button>
              </div>

              {/* For Employers */}
              <div className="bg-[#F5F8FC] p-8 rounded-2xl border border-[#DCE5F0]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-10 rounded-xl bg-[#063B78] text-white flex items-center justify-center font-black">
                    <Building2 className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#10233F]">{t("forEmployersTitle")}</h3>
                    <span className="text-xs font-bold text-[#125BB5]">{t("employerDesc")}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <span className="size-8 rounded-full bg-[#125BB5] text-white font-black text-xs flex items-center justify-center shrink-0">{n(1)}</span>
                    <div>
                      <h4 className="font-extrabold text-[#10233F] text-sm">{t("forEmployersStep1Title")}</h4>
                      <p className="text-xs text-[#5B6B7F] mt-1 font-semibold">{t("forEmployersStep1Desc")}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="size-8 rounded-full bg-[#125BB5] text-white font-black text-xs flex items-center justify-center shrink-0">{n(2)}</span>
                    <div>
                      <h4 className="font-extrabold text-[#10233F] text-sm">{t("forEmployersStep2Title")}</h4>
                      <p className="text-xs text-[#5B6B7F] mt-1 font-semibold">{t("forEmployersStep2Desc")}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="size-8 rounded-full bg-[#125BB5] text-white font-black text-xs flex items-center justify-center shrink-0">{n(3)}</span>
                    <div>
                      <h4 className="font-extrabold text-[#10233F] text-sm">{t("forEmployersStep3Title")}</h4>
                      <p className="text-xs text-[#5B6B7F] mt-1 font-semibold">{t("forEmployersStep3Desc")}</p>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full mt-8 btn-navy font-extrabold text-sm py-3">
                  <Link to="/workers">{t("workers")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl font-black text-[#10233F] sm:text-4xl">
                {t("whyChooseTitle")}
              </h2>
              <p className="mt-3 text-base font-semibold text-[#5B6B7F]">
                {t("whyUsSubtitle")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card-realjob p-6 text-center">
                <div className="size-12 rounded-full bg-[#063B78]/10 text-[#063B78] mx-auto flex items-center justify-center mb-4">
                  <ShieldCheck className="size-6" />
                </div>
                <h3 className="font-black text-base text-[#10233F]">{t("verifiedUsersTitle")}</h3>
                <p className="text-xs font-semibold text-[#5B6B7F] mt-2">
                  {t("verifiedUsersDesc")}
                </p>
              </div>

              <div className="card-realjob p-6 text-center">
                <div className="size-12 rounded-full bg-[#FFC400]/20 text-[#082F63] mx-auto flex items-center justify-center mb-4">
                  <HeartHandshake className="size-6" />
                </div>
                <h3 className="font-black text-base text-[#10233F]">{t("zeroFeesTitle")}</h3>
                <p className="text-xs font-semibold text-[#5B6B7F] mt-2">
                  {t("zeroFeesDesc")}
                </p>
              </div>

              <div className="card-realjob p-6 text-center">
                <div className="size-12 rounded-full bg-[#125BB5]/10 text-[#125BB5] mx-auto flex items-center justify-center mb-4">
                  <Globe className="size-6" />
                </div>
                <h3 className="font-black text-base text-[#10233F]">{t("regionalLangTitle")}</h3>
                <p className="text-xs font-semibold text-[#5B6B7F] mt-2">
                  {t("regionalLangDesc")}
                </p>
              </div>

              <div className="card-realjob p-6 text-center">
                <div className="size-12 rounded-full bg-[#063B78]/10 text-[#063B78] mx-auto flex items-center justify-center mb-4">
                  <Zap className="size-6" />
                </div>
                <h3 className="font-black text-base text-[#10233F]">{t("instantHiringTitle")}</h3>
                <p className="text-xs font-semibold text-[#5B6B7F] mt-2">
                  {t("instantHiringDesc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-hero-overlay text-white py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-black sm:text-4xl text-white">
              {t("joinBannerTitle")}
            </h2>
            <p className="mt-3 text-base text-white/90 max-w-xl mx-auto font-medium">
              {t("joinBannerSub")}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild className="btn-yellow font-extrabold text-sm px-8 py-3.5 h-auto">
                <Link to="/auth" search={{ mode: "register", role: "worker" }}>
                  {t("seeker")}
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-white font-extrabold text-sm px-8 py-3.5 h-auto hover:bg-white hover:text-[#063B78]">
                <Link to="/auth" search={{ mode: "register", role: "employer" }}>
                  {t("employer")}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
