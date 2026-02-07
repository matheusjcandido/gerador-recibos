'use client';

import { useState } from 'react';

interface DadosRecibo {
  // Pagador
  pagadorNome: string;
  pagadorCpfCnpj: string;
  pagadorEndereco: string;
  // Recebedor
  recebedorNome: string;
  recebedorCpfCnpj: string;
  recebedorEndereco: string;
  // Pagamento
  valor: string;
  valorExtenso: string;
  referente: string;
  formaPagamento: string;
  // Local
  cidade: string;
}

const initialData: DadosRecibo = {
  pagadorNome: '',
  pagadorCpfCnpj: '',
  pagadorEndereco: '',
  recebedorNome: '',
  recebedorCpfCnpj: '',
  recebedorEndereco: '',
  valor: '',
  valorExtenso: '',
  referente: '',
  formaPagamento: 'PIX',
  cidade: '',
};

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
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

  if (parteInteira === 0) {
    resultado = '';
  } else if (parteInteira === 100) {
    resultado = 'cem';
  } else if (parteInteira < 10) {
    resultado = unidades[parteInteira];
  } else if (parteInteira < 20) {
    resultado = especiais[parteInteira - 10];
  } else if (parteInteira < 100) {
    const dezena = Math.floor(parteInteira / 10);
    const unidade = parteInteira % 10;
    resultado = dezenas[dezena] + (unidade > 0 ? ' e ' + unidades[unidade] : '');
  } else if (parteInteira < 1000) {
    const centena = Math.floor(parteInteira / 100);
    const resto = parteInteira % 100;
    if (resto === 0) {
      resultado = parteInteira === 100 ? 'cem' : centenas[centena];
    } else if (resto < 10) {
      resultado = centenas[centena] + ' e ' + unidades[resto];
    } else if (resto < 20) {
      resultado = centenas[centena] + ' e ' + especiais[resto - 10];
    } else {
      const dezena = Math.floor(resto / 10);
      const unidade = resto % 10;
      resultado = centenas[centena] + ' e ' + dezenas[dezena] + (unidade > 0 ? ' e ' + unidades[unidade] : '');
    }
  } else if (parteInteira < 1000000) {
    const milhar = Math.floor(parteInteira / 1000);
    const resto = parteInteira % 1000;
    const milharExtenso = milhar === 1 ? 'mil' : numeroParaExtenso(milhar).replace(' reais', '').replace(' real', '') + ' mil';
    if (resto === 0) {
      resultado = milharExtenso;
    } else {
      resultado = milharExtenso + ' ' + (resto < 100 ? 'e ' : '') + numeroParaExtenso(resto).replace(' reais', '').replace(' real', '');
    }
  } else {
    resultado = valor.toLocaleString('pt-BR');
  }

  // Adiciona reais
  if (parteInteira === 1) {
    resultado += ' real';
  } else if (parteInteira > 0) {
    resultado += ' reais';
  }

  // Adiciona centavos
  if (centavos > 0) {
    if (parteInteira > 0) resultado += ' e ';
    if (centavos < 10) {
      resultado += unidades[centavos];
    } else if (centavos < 20) {
      resultado += especiais[centavos - 10];
    } else {
      const dezena = Math.floor(centavos / 10);
      const unidade = centavos % 10;
      resultado += dezenas[dezena] + (unidade > 0 ? ' e ' + unidades[unidade] : '');
    }
    resultado += centavos === 1 ? ' centavo' : ' centavos';
  }

  return resultado || 'zero reais';
}

export default function Home() {
  const [dados, setDados] = useState<DadosRecibo>(initialData);
  const [showPreview, setShowPreview] = useState(false);
  const [numeroRecibo, setNumeroRecibo] = useState(() => 
    Math.floor(Math.random() * 9000) + 1000
  );

  const updateField = (field: keyof DadosRecibo, value: string) => {
    setDados((prev) => ({ ...prev, [field]: value }));
    
    // Auto-generate valor por extenso
    if (field === 'valor') {
      const numValue = parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
      setDados((prev) => ({ 
        ...prev, 
        [field]: value,
        valorExtenso: numeroParaExtenso(numValue)
      }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formasPagamento = [
    'PIX',
    'Dinheiro',
    'Transferência Bancária',
    'Cartão de Crédito',
    'Cartão de Débito',
    'Boleto',
    'Cheque',
  ];

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-preview, #receipt-preview * {
            visibility: visible;
          }
          #receipt-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 40px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <main className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
        {/* Header */}
        <div className="bg-teal-600 text-white py-8 px-4 no-print">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              🧾 Gerador de Recibos
            </h1>
            <p className="text-teal-100 text-lg">
              Crie recibos profissionais em segundos - 100% grátis
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {!showPreview ? (
            <>
              {/* Formulário */}
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 no-print">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Preencha os dados do recibo
                  </h2>
                  <div className="text-sm text-gray-500">
                    Recibo nº <span className="font-mono font-bold">{numeroRecibo}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Recebedor */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-teal-600 border-b pb-2">
                      💰 QUEM RECEBE (Você)
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome completo / Razão Social
                      </label>
                      <input
                        type="text"
                        value={dados.recebedorNome}
                        onChange={(e) => updateField('recebedorNome', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Seu nome ou empresa"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CPF / CNPJ
                      </label>
                      <input
                        type="text"
                        value={dados.recebedorCpfCnpj}
                        onChange={(e) => updateField('recebedorCpfCnpj', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="000.000.000-00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Endereço (opcional)
                      </label>
                      <input
                        type="text"
                        value={dados.recebedorEndereco}
                        onChange={(e) => updateField('recebedorEndereco', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Rua, número, cidade"
                      />
                    </div>
                  </div>

                  {/* Pagador */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-teal-600 border-b pb-2">
                      👤 QUEM PAGA (Cliente)
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome completo / Razão Social
                      </label>
                      <input
                        type="text"
                        value={dados.pagadorNome}
                        onChange={(e) => updateField('pagadorNome', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Nome do cliente"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CPF / CNPJ
                      </label>
                      <input
                        type="text"
                        value={dados.pagadorCpfCnpj}
                        onChange={(e) => updateField('pagadorCpfCnpj', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="000.000.000-00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Endereço (opcional)
                      </label>
                      <input
                        type="text"
                        value={dados.pagadorEndereco}
                        onChange={(e) => updateField('pagadorEndereco', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Rua, número, cidade"
                      />
                    </div>
                  </div>
                </div>

                {/* Pagamento */}
                <div className="mt-8 space-y-4">
                  <h3 className="font-semibold text-teal-600 border-b pb-2">
                    💵 DADOS DO PAGAMENTO
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Valor (R$)
                      </label>
                      <input
                        type="text"
                        value={dados.valor}
                        onChange={(e) => updateField('valor', e.target.value)}
                        className="w-full px-4 py-3 text-xl font-bold border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="0,00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Forma de pagamento
                      </label>
                      <select
                        value={dados.formaPagamento}
                        onChange={(e) => updateField('formaPagamento', e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      >
                        {formasPagamento.map((forma) => (
                          <option key={forma} value={forma}>{forma}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor por extenso
                    </label>
                    <input
                      type="text"
                      value={dados.valorExtenso}
                      onChange={(e) => updateField('valorExtenso', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="(preenchido automaticamente)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Referente a
                    </label>
                    <textarea
                      value={dados.referente}
                      onChange={(e) => updateField('referente', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Descreva o serviço ou produto..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={dados.cidade}
                      onChange={(e) => updateField('cidade', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="São Paulo - SP"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setShowPreview(true)}
                  className="mt-8 w-full bg-teal-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-teal-700 transition-colors"
                >
                  🧾 Gerar Recibo
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Preview Actions */}
              <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex gap-4 no-print">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ← Voltar e Editar
                </button>
                <button
                  onClick={handlePrint}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  🖨️ Imprimir / Salvar PDF
                </button>
                <button
                  onClick={() => setNumeroRecibo(Math.floor(Math.random() * 9000) + 1000)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  🔄 Novo Número
                </button>
              </div>

              {/* Receipt Preview */}
              <div
                id="receipt-preview"
                className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl mx-auto border-2 border-dashed border-gray-300"
              >
                <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
                  <h1 className="text-3xl font-bold tracking-wider">RECIBO</h1>
                  <p className="text-gray-600 mt-1">Nº {numeroRecibo}</p>
                </div>

                <div className="space-y-6">
                  <div className="text-center">
                    <span className="text-4xl font-bold text-teal-600">
                      R$ {dados.valor || '0,00'}
                    </span>
                  </div>

                  <p className="text-lg leading-relaxed text-justify">
                    Recebi de <strong>{dados.pagadorNome || '[NOME DO PAGADOR]'}</strong>
                    {dados.pagadorCpfCnpj && `, CPF/CNPJ ${dados.pagadorCpfCnpj}`}
                    {dados.pagadorEndereco && `, ${dados.pagadorEndereco}`}
                    , a importância de <strong>R$ {dados.valor || '0,00'}</strong> ({dados.valorExtenso || 'zero reais'}), 
                    referente a <strong>{dados.referente || '[DESCRIÇÃO]'}</strong>.
                  </p>

                  <p className="text-gray-600">
                    Forma de pagamento: <strong>{dados.formaPagamento}</strong>
                  </p>

                  <p className="text-sm text-gray-500">
                    Para maior clareza, firmo o presente recibo para que produza os seus efeitos, 
                    dando plena, rasa e irrevogável quitação, pelo valor recebido.
                  </p>

                  <p className="text-center mt-8">
                    {dados.cidade || '[CIDADE]'}, {formatDate(new Date())}.
                  </p>

                  <div className="mt-12 pt-8">
                    <div className="border-t-2 border-gray-800 w-64 mx-auto pt-2 text-center">
                      <p className="font-semibold">{dados.recebedorNome || '[NOME DO RECEBEDOR]'}</p>
                      {dados.recebedorCpfCnpj && <p className="text-sm text-gray-600">CPF/CNPJ: {dados.recebedorCpfCnpj}</p>}
                      {dados.recebedorEndereco && <p className="text-sm text-gray-600">{dados.recebedorEndereco}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-r from-teal-600 to-green-600 rounded-2xl shadow-xl p-8 text-white text-center mt-8 no-print">
            <h3 className="text-2xl font-bold mb-3">
              📋 Precisa de um contrato também?
            </h3>
            <p className="text-teal-100 mb-6">
              Gere contratos de prestação de serviços, freelancer e NDA gratuitamente!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://curva-abc-app.vercel.app"
                target="_blank"
                className="bg-white text-teal-600 px-6 py-3 rounded-xl font-semibold hover:bg-teal-50 transition-colors"
              >
                🎯 Curva ABC
              </a>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center text-gray-500 text-sm no-print">
            <p>Gerador de Recibos © 2025</p>
            <p className="mt-1">
              Este recibo não substitui nota fiscal quando exigida por lei.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
