'use client';

import { useState } from 'react';

interface DadosRecibo {
  pagadorNome: string;
  pagadorCpfCnpj: string;
  recebedorNome: string;
  recebedorCpfCnpj: string;
  valor: string;
  valorExtenso: string;
  referente: string;
  formaPagamento: string;
  cidade: string;
}

const initialData: DadosRecibo = {
  pagadorNome: '',
  pagadorCpfCnpj: '',
  recebedorNome: '',
  recebedorCpfCnpj: '',
  valor: '',
  valorExtenso: '',
  referente: '',
  formaPagamento: 'PIX',
  cidade: '',
};

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function numeroParaExtenso(valor: number): string {
  if (valor === 0) return 'zero reais';
  const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const especiais = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  const parteInteira = Math.floor(valor);
  const centavos = Math.round((valor - parteInteira) * 100);
  let resultado = '';

  if (parteInteira === 0) resultado = '';
  else if (parteInteira === 100) resultado = 'cem';
  else if (parteInteira < 10) resultado = unidades[parteInteira];
  else if (parteInteira < 20) resultado = especiais[parteInteira - 10];
  else if (parteInteira < 100) {
    const d = Math.floor(parteInteira / 10), u = parteInteira % 10;
    resultado = dezenas[d] + (u > 0 ? ' e ' + unidades[u] : '');
  } else if (parteInteira < 1000) {
    const c = Math.floor(parteInteira / 100), r = parteInteira % 100;
    if (r === 0) resultado = parteInteira === 100 ? 'cem' : centenas[c];
    else if (r < 10) resultado = centenas[c] + ' e ' + unidades[r];
    else if (r < 20) resultado = centenas[c] + ' e ' + especiais[r - 10];
    else { const d = Math.floor(r / 10), u = r % 10; resultado = centenas[c] + ' e ' + dezenas[d] + (u > 0 ? ' e ' + unidades[u] : ''); }
  } else if (parteInteira < 1000000) {
    const m = Math.floor(parteInteira / 1000), r = parteInteira % 1000;
    const mExt = m === 1 ? 'mil' : numeroParaExtenso(m).replace(' reais', '').replace(' real', '') + ' mil';
    resultado = r === 0 ? mExt : mExt + ' ' + (r < 100 ? 'e ' : '') + numeroParaExtenso(r).replace(' reais', '').replace(' real', '');
  } else resultado = valor.toLocaleString('pt-BR');

  if (parteInteira === 1) resultado += ' real';
  else if (parteInteira > 0) resultado += ' reais';

  if (centavos > 0) {
    if (parteInteira > 0) resultado += ' e ';
    if (centavos < 10) resultado += unidades[centavos];
    else if (centavos < 20) resultado += especiais[centavos - 10];
    else { const d = Math.floor(centavos / 10), u = centavos % 10; resultado += dezenas[d] + (u > 0 ? ' e ' + unidades[u] : ''); }
    resultado += centavos === 1 ? ' centavo' : ' centavos';
  }
  return resultado || 'zero reais';
}

export default function Home() {
  const [dados, setDados] = useState<DadosRecibo>(initialData);
  const [showPreview, setShowPreview] = useState(false);
  const [numeroRecibo] = useState(() => Math.floor(Math.random() * 9000) + 1000);

  const updateField = (field: keyof DadosRecibo, value: string) => {
    setDados((prev) => ({ ...prev, [field]: value }));
    if (field === 'valor') {
      const numValue = parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
      setDados((prev) => ({ ...prev, [field]: value, valorExtenso: numeroParaExtenso(numValue) }));
    }
  };

  const formasPagamento = ['PIX', 'Dinheiro', 'Transferência', 'Cartão Crédito', 'Cartão Débito', 'Boleto'];

  return (
    <>
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #receipt-preview, #receipt-preview * { visibility: visible; }
          #receipt-preview { position: absolute; left: 0; top: 0; width: 100%; padding: 50px; background: white !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      <main className="min-h-screen bg-[#f8f9fa] relative">
        {/* Subtle gradient background */}
        <div className="fixed inset-0 bg-gradient-to-br from-[#e8f5e9]/50 via-transparent to-[#e0f2f1]/50 pointer-events-none" />

        {/* Header */}
        <header className="relative z-10 pt-16 pb-12 px-6 no-print">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00897b] to-[#004d40] flex items-center justify-center shadow-lg shadow-[#00897b]/20">
                <span className="text-white text-2xl">📃</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1a1a1a] tracking-tight">
                  Gerador de Recibos
                </h1>
                <p className="text-[#666] text-sm">Rápido, simples, profissional</p>
              </div>
            </div>
          </div>
        </header>

        <div className="relative z-10 max-w-2xl mx-auto px-6 pb-20">
          {!showPreview ? (
            <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-black/5 overflow-hidden no-print">
              {/* Recibo number banner */}
              <div className="bg-gradient-to-r from-[#00897b] to-[#26a69a] px-8 py-4 flex justify-between items-center">
                <span className="text-white/80 text-sm">Recibo de Pagamento</span>
                <span className="text-white font-mono font-bold">Nº {numeroRecibo}</span>
              </div>

              <div className="p-8 space-y-8">
                {/* Value - Hero section */}
                <div className="text-center py-6">
                  <label className="block text-[#999] text-xs uppercase tracking-widest mb-3">Valor Recebido</label>
                  <div className="relative inline-block">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#00897b] text-3xl font-light">R$</span>
                    <input
                      type="text"
                      value={dados.valor}
                      onChange={(e) => updateField('valor', e.target.value)}
                      placeholder="0,00"
                      className="pl-14 pr-4 py-2 text-5xl font-bold text-center bg-transparent border-b-2 border-[#e0e0e0] focus:border-[#00897b] outline-none transition-colors w-64"
                    />
                  </div>
                  {dados.valorExtenso && (
                    <p className="mt-3 text-[#666] text-sm italic">({dados.valorExtenso})</p>
                  )}
                </div>

                {/* Payment method pills */}
                <div>
                  <label className="block text-[#999] text-xs uppercase tracking-widest mb-3">Forma de Pagamento</label>
                  <div className="flex flex-wrap gap-2">
                    {formasPagamento.map((forma) => (
                      <button
                        key={forma}
                        onClick={() => updateField('formaPagamento', forma)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          dados.formaPagamento === forma
                            ? 'bg-[#00897b] text-white shadow-md'
                            : 'bg-[#f5f5f5] text-[#666] hover:bg-[#eeeeee]'
                        }`}
                      >
                        {forma}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Two columns */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Receiver */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#00897b]">
                      <span className="w-6 h-6 rounded-full bg-[#e0f2f1] flex items-center justify-center text-xs font-bold">R</span>
                      <span className="text-sm font-semibold uppercase tracking-wide">Recebedor</span>
                    </div>
                    <input
                      type="text"
                      value={dados.recebedorNome}
                      onChange={(e) => updateField('recebedorNome', e.target.value)}
                      placeholder="Seu nome"
                      className="w-full px-4 py-3 bg-[#fafafa] rounded-xl border border-transparent focus:border-[#00897b] focus:bg-white outline-none transition-all"
                    />
                    <input
                      type="text"
                      value={dados.recebedorCpfCnpj}
                      onChange={(e) => updateField('recebedorCpfCnpj', e.target.value)}
                      placeholder="CPF / CNPJ"
                      className="w-full px-4 py-3 bg-[#fafafa] rounded-xl border border-transparent focus:border-[#00897b] focus:bg-white outline-none transition-all"
                    />
                  </div>

                  {/* Payer */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#ff7043]">
                      <span className="w-6 h-6 rounded-full bg-[#fbe9e7] flex items-center justify-center text-xs font-bold">P</span>
                      <span className="text-sm font-semibold uppercase tracking-wide">Pagador</span>
                    </div>
                    <input
                      type="text"
                      value={dados.pagadorNome}
                      onChange={(e) => updateField('pagadorNome', e.target.value)}
                      placeholder="Nome do cliente"
                      className="w-full px-4 py-3 bg-[#fafafa] rounded-xl border border-transparent focus:border-[#ff7043] focus:bg-white outline-none transition-all"
                    />
                    <input
                      type="text"
                      value={dados.pagadorCpfCnpj}
                      onChange={(e) => updateField('pagadorCpfCnpj', e.target.value)}
                      placeholder="CPF / CNPJ"
                      className="w-full px-4 py-3 bg-[#fafafa] rounded-xl border border-transparent focus:border-[#ff7043] focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Reference */}
                <div>
                  <label className="block text-[#999] text-xs uppercase tracking-widest mb-3">Referente a</label>
                  <textarea
                    value={dados.referente}
                    onChange={(e) => updateField('referente', e.target.value)}
                    rows={2}
                    placeholder="Descreva o serviço ou produto..."
                    className="w-full px-4 py-3 bg-[#fafafa] rounded-xl border border-transparent focus:border-[#00897b] focus:bg-white outline-none transition-all resize-none"
                  />
                </div>

                {/* City */}
                <div>
                  <input
                    type="text"
                    value={dados.cidade}
                    onChange={(e) => updateField('cidade', e.target.value)}
                    placeholder="Cidade - UF"
                    className="w-full px-4 py-3 bg-[#fafafa] rounded-xl border border-transparent focus:border-[#00897b] focus:bg-white outline-none transition-all"
                  />
                </div>

                <button
                  onClick={() => setShowPreview(true)}
                  className="w-full bg-gradient-to-r from-[#00897b] to-[#26a69a] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#00897b]/30 transition-all"
                >
                  Gerar Recibo
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Preview Actions */}
              <div className="flex gap-3 mb-6 no-print">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-5 py-2.5 bg-white border border-[#e0e0e0] rounded-xl hover:bg-[#fafafa] transition-colors font-medium text-[#666]"
                >
                  ← Editar
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-[#00897b] text-white rounded-xl hover:bg-[#00796b] transition-colors font-medium"
                >
                  Imprimir / PDF
                </button>
              </div>

              {/* Receipt Preview */}
              <div
                id="receipt-preview"
                className="bg-white rounded-3xl shadow-xl p-10 border-2 border-dashed border-[#e0e0e0] max-w-lg mx-auto"
              >
                <div className="text-center border-b-2 border-[#1a1a1a] pb-4 mb-8">
                  <h1 className="text-4xl font-black tracking-tight text-[#1a1a1a]">RECIBO</h1>
                  <p className="text-[#999] font-mono mt-1">Nº {numeroRecibo}</p>
                </div>

                <div className="text-center mb-8">
                  <span className="text-5xl font-black text-[#00897b]">
                    R$ {dados.valor || '0,00'}
                  </span>
                </div>

                <p className="text-[#333] leading-relaxed text-justify mb-6">
                  Recebi de <strong>{dados.pagadorNome || '[Pagador]'}</strong>
                  {dados.pagadorCpfCnpj && ` (${dados.pagadorCpfCnpj})`} a importância de{' '}
                  <strong>R$ {dados.valor || '0,00'}</strong> ({dados.valorExtenso || 'zero reais'}), 
                  referente a <strong>{dados.referente || '[descrição]'}</strong>.
                </p>

                <p className="text-[#666] text-sm mb-8">
                  Forma de pagamento: <strong>{dados.formaPagamento}</strong>
                </p>

                <p className="text-center text-[#666] mb-12">
                  {dados.cidade || '[Cidade]'}, {formatDate(new Date())}
                </p>

                <div className="border-t-2 border-[#1a1a1a] pt-4 text-center max-w-xs mx-auto">
                  <p className="font-semibold text-[#1a1a1a]">{dados.recebedorNome || '[Recebedor]'}</p>
                  {dados.recebedorCpfCnpj && <p className="text-[#666] text-sm">{dados.recebedorCpfCnpj}</p>}
                </div>
              </div>
            </>
          )}
        </div>

        {/* CTA Banner */}
        <div className="relative z-10 max-w-2xl mx-auto px-6 no-print">
          <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-black/5 p-8 text-center mb-8">
            <p className="text-2xl mb-2">🤖</p>
            <p className="text-[#1a1a1a] text-lg font-semibold mb-1">
              Quer automatizar seu trabalho com IA?
            </p>
            <p className="text-[#666] mb-4 text-sm max-w-md mx-auto">
              Conheça o Kit Primeiro Agente — guia completo pra criar seu assistente de IA pessoal do zero.
            </p>
            <a
              href="https://pay.kiwify.com.br/sCqZ6r1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#00897b] to-[#26a69a] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#00897b]/30 transition-all"
            >
              Conhecer o Kit →
            </a>
            <p className="text-[#ccc] text-xs mt-3">Ferramentas gratuitas por Claudio Tools</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 text-center py-8 no-print">
          <p className="text-[#999] text-sm">
            Gerador de Recibos © 2026 • Não substitui nota fiscal
          </p>
        </footer>
      </main>
    </>
  );
}
