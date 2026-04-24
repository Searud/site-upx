// Função para limpar número do CSV
function limparNumero(valor) {
  if (!valor) return 0;
  return parseFloat(valor.replace(/"/g, '').replace(',', '.'));
}

// Valor de referência: custo por MWh
const custoPorMWh = 500; // R$ 500 por MWh

// ================= Cemig =================
fetch('Dados/consumo_energia_interno_2024.csv')
  .then(res => res.text())
  .then(texto => {
    const linhas = texto.trim().split('\n').map(l => l.split(','));
    let renovavel = 0;
    let naoRenovavel = 0;

    linhas.slice(1).forEach(l => {
      const fonte = l[1].replace(/"/g, '');
      const consumoMWh = limparNumero(l[2]);
      if (fonte === 'Renovável') {
        renovavel += consumoMWh;
      } else {
        naoRenovavel += consumoMWh;
      }
    });

    const total = renovavel + naoRenovavel;
    const percRenovavel = total ? (renovavel / total * 100).toFixed(2) : 0;
    const percNaoRenovavel = total ? (naoRenovavel / total * 100).toFixed(2) : 0;
    const custoTotal = total * custoPorMWh;

    // Gráfico Cemig
    new Chart(document.getElementById('graficoCemig').getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Renovável', 'Não Renovável'],
        datasets: [{
          data: [renovavel, naoRenovavel],
          backgroundColor: ['#4CAF50', '#E53935'] // cores fortes
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Consumo de Energia - Cemig',
            font: { size: 16 }
          },
          legend: { position: 'bottom' }
        }
      }
    });

    // Painel Cemig
    document.getElementById('consumoTotal').textContent = `${total.toFixed(2)} MWh`;
    document.getElementById('percentRenovavel').textContent = `${percRenovavel}%`;
    document.getElementById('percentNaoRenovavel').textContent = `${percNaoRenovavel}%`;
    document.getElementById('custoTotal').textContent = `R$ ${custoTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
  });

// ================= IEPT (dados ficticios) =================
let renovavelIEPT = 4200;   // MWh fictício
let naoRenovavelIEPT = 6900; // MWh fictício
let totalIEPT = renovavelIEPT + naoRenovavelIEPT;
let percRenovavelIEPT = (renovavelIEPT / totalIEPT * 100).toFixed(2);
let percNaoRenovavelIEPT = (naoRenovavelIEPT / totalIEPT * 100).toFixed(2);
let custoTotalIEPT = totalIEPT * custoPorMWh;

// Gráfico IEPT
new Chart(document.getElementById('graficoIEPT').getContext('2d'), {
  type: 'doughnut',
  data: {
    labels: ['Renovável', 'Não Renovável'],
    datasets: [{
      data: [renovavelIEPT, naoRenovavelIEPT],
      backgroundColor: ['#4CAF50', '#E53935'] // cores fortes
    }]
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: 'Consumo de Energia - IEPT',
        font: { size: 16 }
      },
      legend: { position: 'bottom' }
    }
  }
});

// Painel IEPT
document.getElementById('consumoTotalIEPT').textContent = `${totalIEPT.toFixed(2)} MWh`;
document.getElementById('percentRenovavelIEPT').textContent = `${percRenovavelIEPT}%`;
document.getElementById('percentNaoRenovavelIEPT').textContent = `${percNaoRenovavelIEPT}%`;
document.getElementById('custoTotalIEPT').textContent = `R$ ${custoTotalIEPT.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;

// ================= Comparativo de Consumo Energético =================

// Function para ler CSV (Ano,Classe,MWh)
function lerCSVComparativo(caminho) {
  return fetch(caminho)
    .then(res => res.text())
    .then(texto => {
      const linhas = texto.trim().split('\n').map(l => l.split(','));
      const dados = {};
      linhas.slice(1).forEach(l => {
        const classe = l[1].replace(/"/g, '');
        const consumo = limparNumero(l[2]);
        dados[classe] = consumo;
      });
      return dados;
    });
}

// Le os dois CSVs em paralelo
Promise.all([
  lerCSVComparativo('Dados/cemig_2.csv'),
  lerCSVComparativo('Dados/IEPT_2.csv')
]).then(([cemigDados, ieptDados]) => {
  const setores = ['Residencial', 'Industrial', 'Comércio, Serviços e outros', 'Rural'];

  const cemigSetores = setores.map(s => cemigDados[s] || 0);
  const ieptSetores = setores.map(s => ieptDados[s] || 0);

  new Chart(document.getElementById('graficoComparativo').getContext('2d'), {
    type: 'bar',
    data: {
      labels: setores,
      datasets: [
        {
          label: 'CEMIG',
          data: cemigSetores,
          backgroundColor: '#1E88E5' // azul forte
        },
        {
          label: 'IEPT',
          data: ieptSetores,
          backgroundColor: '#43A047' // verde forte
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Comparativo de Consumo Energético por Setor',
          font: { size: 18 }
        },
        legend: { position: 'top' }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Consumo (MWh)' }
        }
      }
    }
  });
});

// ================= Emissões de CO₂ por Escopo =================

// Function para ler CSV (Ano,Escopo,Emissões)
function lerCSVEmissoes(caminho) {
  return fetch(caminho)
    .then(res => res.text())
    .then(texto => {
      const linhas = texto.trim().split('\n').map(l => l.split(','));
      const dados = {};
      linhas.slice(1).forEach(l => {
        const ano = l[0];
        const escopo = l[1];
        const emissao = parseFloat(l[2]);
        if (!dados[ano]) dados[ano] = {};
        dados[ano][escopo] = emissao;
      });
      return dados;
    });
}

// Le os dois CSVs em paralelo
Promise.all([
  lerCSVEmissoes('Dados/cemig_emissoes.csv'),
  lerCSVEmissoes('Dados/iept_emissoes.csv')
]).then(([cemigDados, ieptDados]) => {
  
  const escopos = ['Escopo 1', 'Escopo 2', 'Escopo 3'];

  const cemig2024 = escopos.map(s => cemigDados['2024'][s] || 0);
  const iept2024 = escopos.map(s => ieptDados['2024'][s] || 0);

  new Chart(document.getElementById('graficoCO2').getContext('2d'), {
    type: 'bar',
    data: {
      labels: escopos,
      datasets: [
        {
          label: 'CEMIG',
          data: cemig2024,
          backgroundColor: '#1E88E5' // azul forte
        },
        {
          label: 'IEPT',
          data: iept2024,
          backgroundColor: '#43A047' // verde forte
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Emissões de CO₂ por Escopo',
          font: { size: 18 }
        },
        legend: { position: 'top' }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Emissões (tCO₂e)' }
        }
      }
    }
  });
});
