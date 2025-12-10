export default function DashboardHome() {
  const welcomeMessage = "Bem-vindo! Aqui você encontrará as funções do sistema."

  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center overflow-hidden">
      {/* Logo Background - Subtle and Transparent */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="text-9xl font-bold text-slate-900">D</div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">{welcomeMessage}</h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Utilize o menu lateral para acessar os formulários e relatórios do sistema.
        </p>
      </div>
    </div>
  )
}
