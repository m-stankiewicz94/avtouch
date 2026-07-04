import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import BrandMarquee from "@/components/BrandMarquee";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import MoreThanAv from "@/components/MoreThanAv";
import Process from "@/components/Process";
import Work from "@/components/Work";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SiteMotion from "@/components/SiteMotion";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <Nav dict={dict} locale={locale} />
      <main>
        <Hero dict={dict} />
        <About dict={dict} />
        <BrandMarquee />
        <Stats dict={dict} />
        <Services dict={dict} />
        <MoreThanAv dict={dict} />
        <Process dict={dict} />
        <Work dict={dict} />
        <Contact dict={dict} />
      </main>
      <Footer dict={dict} />
      <SiteMotion />
    </>
  );
}
