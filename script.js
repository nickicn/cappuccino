document.addEventListener('DOMContentLoaded', function() {
    const categoriaContainer = document.getElementById('categoria-botoes');
    const itensContainer = document.getElementById('itens');
    const botaoLivros = document.getElementById('botao-livros');
    const botaoCafe = document.getElementById('botao-cafe');

    // Inicializa a página carregando a seção de livros
    carregarConteudo('livros');

    botaoLivros.addEventListener('click', () => carregarConteudo('livros'));
    botaoCafe.addEventListener('click', () => carregarConteudo('produtos'));

    function carregarConteudo(tipo) {
        categoriaContainer.innerHTML = '';  // Limpa categorias anteriores
        itensContainer.innerHTML = '';       // Limpa itens anteriores
        let categoriaUrl = tipo === 'livros' ? 'livros_categorias' : 'produtos_categorias';
        fetch(`http://localhost:3000/${categoriaUrl}`)
            .then(response => response.json())
            .then(categorias => {
                categorias.forEach(categoria => {
                    const btn = document.createElement('button');
                    btn.textContent = categoria.nome_categoria;
                    btn.onclick = () => carregarItens(tipo, categoria.id_categoria_livro || categoria.id_categoria_produto);
                    categoriaContainer.appendChild(btn);
                });
            });
        carregarItens(tipo);  // Carrega todos os itens inicialmente
    }

    function carregarItens(tipo, id_categoria = '') {
        let url = `http://localhost:3000/${tipo}`;
        if (id_categoria) {
            url += `?categoria=${id_categoria}`; // Uso uniforme do parâmetro 'categoria' para livros e produtos
        }
        fetch(url)
            .then(response => response.json())
            .then(itens => mostrarItens(itens, tipo))
            .catch(error => console.error('Erro ao carregar itens:', error));
    }

    function mostrarItens(itens, tipo) {
        itensContainer.innerHTML = '';
        itens.forEach(item => {
            const div = document.createElement('div');
            div.className = `item`;
            let imgPath = tipo === 'livros' ? `img/livros/${item.livrosID}.png` : `img/produtos/${item.produtoID}.png`;
            let infoHtml = tipo === 'livros' ?
                `<h3>${item.livroNome}</h3>
                 <p>Faixa Etária: ${item.livroFaixaEtaria}</p>
                 <p>Preço: R$${item.livroPreco}</p>` :
                `<h3>${item.produtoNome}</h3>
                 <p>Preço: R$${item.produtoPreco}</p>`;
            div.innerHTML = `<img src="${imgPath}" alt="${item.livroNome || item.produtoNome}">
                             ${infoHtml}`;
            itensContainer.appendChild(div);
        });
    }
});
