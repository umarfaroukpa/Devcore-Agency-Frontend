import { notFound } from 'next/navigation';
import ProjectClient from './[id]/ProjectClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProjectClient projectId={id} />;
}