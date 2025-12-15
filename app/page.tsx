import Image from "next/image"

export default function DashboardHome() {
  const appTitle = "Portal de Justificativa de Descontos - Temporário";
  const welcomeMessage = "Bem-vindo(a), Concessionário(a)!";
  
  // Informações chave para o usuário
  const purpose = "Esta plataforma temporária foi desenvolvida para a **Justificativa de Descontos em Peças Acima de 5%.";
  const instruction = "Utilize o botão abaixo para iniciar o registro da sua justificativa. Certifique-se de ter todos os dados necessários (Nº da OS, valor do desconto, dados da Nota Fiscal) em mãos antes de começar.";
  

  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 overflow-hidden bg-gray-50">
      
      {/* Logo Background - Sutil e Transparente */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        {/* Sugestão: Reduzir um pouco a opacidade para maior clareza do texto */}
        <Image 
          src={'/logohyundai.png'} 
          alt="Logo Hyundai" 
          width={1200} 
          height={1200} 
          className="object-cover" 
        />
      </div>

      {/* Conteúdo Principal Centralizado e em um Card */}
      <div className="relative z-10 w-full max-w-4xl p-8 mx-4 bg-white rounded-xl shadow-2xl border border-blue-100">
        
        {/* Título Principal */}
        <header className="mb-8 border-b pb-4 border-blue-500/30">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">{appTitle}</p>
          <h1 className="text-4xl font-extrabold text-slate-800 mt-1">{welcomeMessage}</h1>
        </header>

        {/* Seção de Propósito */}
        <section className="mb-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <h2 className="text-xl font-bold text-blue-800 mb-3">🛠️ Qual o objetivo desta ferramenta?</h2>
          <p className="text-lg text-slate-700 leading-relaxed font-medium">
            {purpose}
          </p>
        </section>

        {/* Seção de Instrução */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center">
            <span className="text-blue-500 mr-2">➡️</span> Próximos Passos
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {instruction}
          </p>
          <div className="mt-4 text-center">
             <a href="/dashboard/form-nf" className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                Acessar Formulário de Justificativa
             </a>
             <p className="text-sm text-slate-400 mt-2">(Utilize também o menu lateral)</p>
          </div>
        </section>

       

      </div>
    </div>
  )
}