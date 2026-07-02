import type { Metadata } from "next";
import Link from "next/link";
import { Bullets, DocTitle, Section } from "@/components/marketing/legal";

export const metadata: Metadata = {
  title: "Termos de Uso — ResumeHub",
  description: "Termos de Uso do ResumeHub.",
};

export default function TermosPage() {
  return (
    <article>
      <DocTitle title="Termos de Uso" updatedAt="julho de 2026" />

      <p className="mt-6 text-[14.5px] leading-[1.7] text-text2">
        Estes Termos de Uso regem o acesso e a utilização do ResumeHub
        (&quot;Serviço&quot;). Ao criar uma conta ou usar o Serviço, você
        concorda com estes Termos. Se não concordar, não utilize o Serviço.
      </p>

      <Section title="1. A conta">
        <p>
          Você é responsável por manter a confidencialidade das suas credenciais
          e por toda atividade realizada na sua conta. Informe dados verdadeiros
          no cadastro e mantenha-os atualizados. Você deve ter pelo menos 16
          anos para usar o Serviço.
        </p>
      </Section>

      <Section title="2. Uso do Serviço">
        <p>O ResumeHub permite cadastrar seu histórico profissional, montar
          perfis por vaga e exportar currículos em PDF. Você concorda em não:</p>
        <Bullets
          items={[
            "Usar o Serviço para fins ilegais ou que violem direitos de terceiros.",
            "Tentar acessar contas, dados ou sistemas sem autorização.",
            "Sobrecarregar, interferir ou comprometer a integridade da plataforma.",
            "Publicar conteúdo falso, ofensivo ou que não seja de sua autoria.",
          ]}
        />
      </Section>

      <Section title="3. Seu conteúdo">
        <p>
          Os dados que você insere no seu cofre permanecem seus. Você nos concede
          apenas a licença necessária para armazenar, processar e exibir esse
          conteúdo com o objetivo de operar o Serviço — por exemplo, gerar seu
          PDF ou publicar seu portfólio quando você optar por isso.
        </p>
      </Section>

      <Section title="4. Planos e pagamentos">
        <p>
          O plano gratuito oferece um conjunto de recursos sem custo. Recursos
          pagos, quando contratados, são cobrados de forma recorrente conforme
          apresentado no momento da assinatura. Você pode cancelar a qualquer
          momento; o acesso pago permanece até o fim do período já pago.
        </p>
      </Section>

      <Section title="5. Disponibilidade e alterações">
        <p>
          Buscamos manter o Serviço disponível, mas ele é fornecido &quot;como
          está&quot;, sem garantias de operação ininterrupta. Podemos alterar,
          suspender ou descontinuar recursos, e atualizar estes Termos. Mudanças
          relevantes serão comunicadas com antecedência razoável.
        </p>
      </Section>

      <Section title="6. Encerramento">
        <p>
          Você pode encerrar sua conta a qualquer momento. Podemos suspender ou
          encerrar contas que violem estes Termos. Após o encerramento, seus
          dados são tratados conforme a{" "}
          <Link href="/privacidade" className="text-accent-text hover:underline">
            Política de Privacidade
          </Link>
          .
        </p>
      </Section>

      <Section title="7. Contato">
        <p>
          Dúvidas sobre estes Termos podem ser enviadas para{" "}
          <a
            href="mailto:contato@resumehub.io"
            className="text-accent-text hover:underline"
          >
            contato@resumehub.io
          </a>
          .
        </p>
      </Section>
    </article>
  );
}
