import { ProfileBuilder } from "@/components/perfis/ProfileBuilder";

export default async function ProfileBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProfileBuilder profileId={id} />;
}
