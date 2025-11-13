// pages/_app.tsx
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import Layout from "@/components/Layout/Layout";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Exemplo: página de login sem layout completo
  const noLayoutRoutes = ["/login"];
  const isBarePage = noLayoutRoutes.includes(router.pathname);

  if (isBarePage) {
    return (
      <>
        <Component {...pageProps} />
      </>
    );
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}