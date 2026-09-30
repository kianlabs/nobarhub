import { redirect } from "next/navigation";

interface SearchPageProps {
  searchParams?: Promise<{
    q?: string;
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const q = typeof resolvedParams?.q === "string" ? resolvedParams.q.trim() : "";

  if (q) {
    redirect(`/cari?q=${encodeURIComponent(q)}`);
  }

  redirect("/cari");
}
