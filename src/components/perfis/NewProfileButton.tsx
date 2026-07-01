"use client";

import { useRouter } from "next/navigation";
import { Button, type ButtonProps } from "@/components/ui/Button";
import { PlusIcon } from "@/components/ui/icons";
import { useCreateProfile } from "@/lib/query/hooks";

/** Creates a draft profile then navigates to its builder (Montagem). */
export function NewProfileButton({
  label = "Novo perfil",
  ...props
}: { label?: string } & Omit<ButtonProps, "onClick" | "children">) {
  const router = useRouter();
  const createProfile = useCreateProfile();

  const handleClick = async () => {
    const profile = await createProfile.mutateAsync({
      name: "Novo perfil",
      isPublic: false,
    });
    router.push(`/perfis/${profile.id}`);
  };

  return (
    <Button onClick={handleClick} disabled={createProfile.isPending} {...props}>
      <PlusIcon className="h-4 w-4" />
      {createProfile.isPending ? "Criando…" : label}
    </Button>
  );
}
