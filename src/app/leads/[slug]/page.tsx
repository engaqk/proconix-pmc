import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function LeadsSlugRedirect({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = (resolvedParams?.slug || '').toLowerCase();
  redirect(`/r/${slug}`);
}

