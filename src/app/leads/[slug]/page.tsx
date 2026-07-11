import { redirect } from 'next/navigation';

export default function LeadsSlugRedirect({ params }: { params: { slug: string } }) {
  redirect(`/r/${params.slug}`);
}
