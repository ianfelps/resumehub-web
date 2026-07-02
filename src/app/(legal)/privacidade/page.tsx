import type { Metadata } from "next";
import Link from "next/link";
import { Bullets, DocTitle, Section } from "@/components/marketing/legal";

export const metadata: Metadata = {
  title: "Política de Privacidade — ResumeHub",
  description: "Como o ResumeHub coleta, usa e protege seus dados.",
};

export default function PrivacidadePage() {
  return (
    <article>
      <DocTitle title="Política de Privacidade" updatedAt="julho de 2026" />

      <p className="mt-6 text-[14.5px] leading-[1.7] text-text2">
        Esta Política explica como o ResumeHub coleta, usa e protege seus dados
        pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD).
        Ao usar o Serviço, você concorda com as práticas aqui descritas.
      </p>

      <Section title="1. Dados que coletamos">
        <Bullets
          items={[
            "Dados de conta: nome e e-mail informados no cadastro.",
            "Conteúdo do cofre: experiências, projetos, formação, habilidades e demais informações que você insere.",
            "Dados de uso: registros técnicos como endereço IP, tipo de dispositivo e ações na plataforma, para segurança e melhoria do Serviço.",
          ]}
        />
      </Section>

      <Section title="2. Como usamos os dados">
        <p>Usamos seus dados para:</p>
        <Bullets
          items={[
            "Operar o Serviço — autenticar sua conta, montar perfis e gerar PDFs.",
            "Publicar seu portfólio online, quando e enquanto você optar por isso.",
            "Garantir segurança, prevenir fraudes e cumprir obrigações legais.",
            "Comunicar avisos importantes sobre a sua conta e o Serviço.",
          ]}
        />
      </Section>

      <Section title="3. Compartilhamento">
        <p>
          Não vendemos seus dados. Compartilhamos informações apenas com
          provedores de infraestrutura necessários para operar o Serviço (como
          hospedagem e envio de e-mail), sob obrigações de confidencialidade, ou
          quando exigido por lei. Seu portfólio só fica público se você o
          publicar deliberadamente.
        </p>
      </Section>

      <Section title="4. Seus direitos">
        <p>Nos termos da LGPD, você pode a qualquer momento:</p>
        <Bullets
          items={[
            "Acessar, corrigir ou atualizar seus dados.",
            "Exportar o conteúdo do seu cofre.",
            "Solicitar a exclusão da sua conta e dos dados associados.",
            "Revogar consentimentos e opor-se a determinados tratamentos.",
          ]}
        />
      </Section>

      <Section title="5. Retenção e segurança">
        <p>
          Mantemos seus dados enquanto sua conta estiver ativa ou conforme
          necessário para cumprir obrigações legais. Adotamos medidas técnicas e
          organizacionais para proteger seus dados, incluindo criptografia em
          trânsito e controle de acesso.
        </p>
      </Section>

      <Section title="6. Contato do encarregado">
        <p>
          Para exercer seus direitos ou tirar dúvidas sobre esta Política,
          escreva para{" "}
          <a
            href="mailto:privacidade@resumehub.io"
            className="text-accent-text hover:underline"
          >
            privacidade@resumehub.io
          </a>
          . Consulte também os nossos{" "}
          <Link href="/termos" className="text-accent-text hover:underline">
            Termos de Uso
          </Link>
          .
        </p>
      </Section>
    </article>
  );
}
