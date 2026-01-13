// Função principal para mostrar as categorias
function trocarCategoria(idCategoria) {
    const vitrines = document.querySelectorAll('.aba-conteudo');
    const mensagemErro = document.getElementById('mensagem-erro');

    // 1. Esconde a mensagem de erro sempre que trocar de categoria
    if (mensagemErro) mensagemErro.style.display = 'none';

    // 2. Lógica de visibilidade
    vitrines.forEach(vitrine => {
        if (idCategoria === 'vitrine-todos') {
            // Se clicar em 'Todos', mostra todas as seções
            vitrine.style.display = 'grid';
        } else {
            // Se clicar em uma específica, verifica se o ID bate
            if (vitrine.id === idCategoria) {
                vitrine.style.display = 'grid';
            } else {
                vitrine.style.display = 'none';
            }
        }
    });
}

// 3. Sistema de Busca (Filtro por nome)
document.getElementById('inputBusca').addEventListener('input', function() {
    const termoBusca = this.value.toLowerCase();
    const cards = document.querySelectorAll('.produto-card');
    const mensagemErro = document.getElementById('mensagem-erro');
    const vitrines = document.querySelectorAll('.aba-conteudo');
    let encontrouAlgo = false;

    if (termoBusca === "") {
        mensagemErro.style.display = 'none';
        trocarCategoria('vitrine-todos'); // Se apagar a busca, volta a mostrar tudo
        return;
    }

    // Mostra as vitrines para poder filtrar os cards dentro delas
    vitrines.forEach(v => v.style.display = 'grid');

    cards.forEach(card => {
        const nomeProduto = card.querySelector('h3').innerText.toLowerCase();
        if (nomeProduto.includes(termoBusca)) {
            card.style.display = 'block';
            encontrouAlgo = true;
        } else {
            card.style.display = 'none';
        }
    });

    mensagemErro.style.display = encontrouAlgo ? 'none' : 'block';
});

// 4. ESTADO INICIAL: Quando o site abre, mostra tudo ou só celulares?
// Se quiser que comece mostrando TUDO, use:
window.onload = () => trocarCategoria('vitrine-todos');