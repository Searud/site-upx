#  Dashboard de Energias Renováveis

Este projeto é um site simples feito em **HTML, CSS e JavaScript** que apresenta informações sobre energias renováveis e uma segunda página com gráficos interativos de consumo e emissões.

---

## Estrutura

- **HTML.html** → página inicial com introdução sobre energias renováveis  
- **HTML2.html** → página de gráficos interativos  
- **CSS.css / CSS2.css** → estilos das páginas  
- **JS.js / JS2.js** → scripts das páginas  
- **img/** → imagens da página inicial (ex: `mundo.jpg`)  
- **img2/** → imagens da página de gráficos (ex: `BG_2.png`)  
- **Dados2/** → arquivos CSV usados nos gráficos (`cemig_consumo.csv`, `iept_consumo.csv`, etc.)

---

### Como rodar

1. Clone o repositório
   Abra a pasta no VS Code.

Instale a extensão Live Server (se ainda não tiver):

    Vá em Extensions → procure por Live Server → instale.

Clique com o botão direito no arquivo HTML.html → Open with Live Server.

O site vai abrir em http://localhost:5500 no navegador.

    A primeira página mostra a introdução.

    O botão Saiba Mais leva para a segunda página com os gráficos.
.
     Observações
    O projeto não está hospedado online, então precisa do Live Server ou de qualquer servidor local para funcionar corretamente.
    Abrir direto no navegador até carrega o fundo, mas os gráficos que usam fetch() para ler CSVs só funcionam via servidor.
    Certifique-se de que os nomes dos arquivos e pastas batem exatamente com os que estão referenciados no HTML, CSS e JS.
