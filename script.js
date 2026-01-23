// ==========================================
// 1. SISTEMA DE CATEGORIAS E BUSCA
// ==========================================

function trocarCategoria(idCategoria) {
    const vitrines = document.querySelectorAll('.aba-conteudo');
    const mensagemErro = document.getElementById('mensagem-erro');

    if (mensagemErro) mensagemErro.style.display = 'none';

    vitrines.forEach(vitrine => {
        if (idCategoria === 'vitrine-todos') {
            vitrine.style.display = 'grid';
        } else {
            vitrine.style.display = (vitrine.id === idCategoria) ? 'grid' : 'none';
        }

        const cards = vitrine.querySelectorAll('.produto-card');
        cards.forEach(card => card.style.display = 'flex');
    });
}

document.getElementById('inputBusca')?.addEventListener('input', function() {
    const termoBusca = this.value.toLowerCase().trim();
    const mensagemErro = document.getElementById('mensagem-erro');
    const vitrines = document.querySelectorAll('.aba-conteudo');
    let encontrouAlgoTotal = false;

    if (termoBusca === "") {
        if (mensagemErro) mensagemErro.style.display = 'none';
        trocarCategoria('vitrine-todos'); 
        return;
    }

    vitrines.forEach(vitrine => {
        let encontrouNaVitrine = false;
        const cardsDaVitrine = vitrine.querySelectorAll('.produto-card');

        cardsDaVitrine.forEach(card => {
            const nomeProduto = card.querySelector('h3').innerText.toLowerCase();
            if (nomeProduto.includes(termoBusca)) {
                card.style.display = 'flex'; 
                encontrouNaVitrine = true;
                encontrouAlgoTotal = true;
            } else {
                card.style.display = 'none';
            }
        });
        vitrine.style.display = encontrouNaVitrine ? 'grid' : 'none';
    });

    if (mensagemErro) {
        if (encontrouAlgoTotal) {
            mensagemErro.style.display = 'none';
        } else {
            mensagemErro.style.display = 'block';
            mensagemErro.innerHTML = `
                <div style="padding: 50px; text-align: center;">
                    <h2>🔍 Produto não encontrado</h2>
                    <p>Não encontramos resultados para "<strong>${this.value}</strong>".</p>
                </div>`;
        }
    }
});

// ==========================================
// 2. SISTEMA DO CARRINHO (CART)
// ==========================================

let cartItem = null;

// Abrir e Fechar Carrinho
const cartSidebar = document.querySelector('.cart-sidebar');
const cartOverlay = document.querySelector('.cart-overlay');
const closeBtn = document.querySelector('.close-cart-btn');

function abrirCarrinho() {
    cartSidebar.classList.add('active');
    cartOverlay.style.display = 'block';
}

function fecharCarrinho() {
    cartSidebar.classList.remove('active');
    cartOverlay.style.display = 'none';
}

// Eventos para fechar
closeBtn?.addEventListener('click', fecharCarrinho);
cartOverlay?.addEventListener('click', fecharCarrinho);

// Adicionar Produto
function adicionarAoCarrinho(nome, preco, imagem) {
    cartItem = { nome, preco, imagem };
    atualizarInterfaceCarrinho();
    abrirCarrinho();
}

function removerItem() {
    cartItem = null;
    atualizarInterfaceCarrinho();
}

function atualizarInterfaceCarrinho() {
    const container = document.querySelector('.cart-items');
    const subtotalEl = document.querySelector('.summary-line:not(.total) span:last-child');
    const totalEl = document.querySelector('.summary-line.total span:last-child');
    
    if (cartItem) {
        container.innerHTML = `
            <div class="cart-item">
                <img src="${cartItem.imagem}" alt="${cartItem.nome}">
                <div class="cart-item-info">
                    <span class="cart-item-name">${cartItem.nome}</span>
                    <span class="cart-item-price">R$ ${cartItem.preco}</span>
                </div>
                <button onclick="removerItem()" class="remove-item">&times;</button>
            </div>
        `;
        if (subtotalEl) subtotalEl.innerText = `R$ ${cartItem.preco}`;
        if (totalEl) totalEl.innerText = `R$ ${cartItem.preco}`;
    } else {
        container.innerHTML = '<p class="empty-cart">Seu carrinho está vazio.</p>';
        if (subtotalEl) subtotalEl.innerText = `R$ 0,00`;
        if (totalEl) totalEl.innerText = `R$ 0,00`;
    }
}

// ==========================================
// 3. ALTERNAR ENTREGA / RETIRADA
// ==========================================

document.querySelectorAll('.delivery-btn').forEach(button => {
    button.addEventListener('click', () => {
        const option = button.getAttribute('data-option');
        
        document.querySelectorAll('.delivery-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const deliveryForm = document.getElementById('delivery-form-container');
        const pickupForm = document.getElementById('pickup-form-container');

        if (option === 'delivery') {
            deliveryForm.style.display = 'block';
            pickupForm.style.display = 'none';
        } else {
            deliveryForm.style.display = 'none';
            pickupForm.style.display = 'block';
        }
    });
});

// ==========================================
// 4. FINALIZAR PEDIDO (WHATSAPP)
// ==========================================

document.querySelector('.finish-order-btn')?.addEventListener('click', () => {
    if (!cartItem) {
        alert("Adicione um produto antes de finalizar!");
        return;
    }

    const isDelivery = document.querySelector('.delivery-btn.active').getAttribute('data-option') === 'delivery';
    let mensagem = `*NOVO PEDIDO*%0A%0A`;
    mensagem += `*Produto:* ${cartItem.nome}%0A`;
    mensagem += `*Valor:* R$ ${cartItem.preco}%0A`;
    mensagem += `--------------------------%0A`;

    if (isDelivery) {
        const nome = document.querySelector('#delivery-form-container input[placeholder*="Silva"]')?.value;
        const tel = document.querySelector('#delivery-form-container input[placeholder*="0000"]')?.value;
        const end = document.querySelector('#delivery-form-container input[placeholder*="Rua"]')?.value;
        const cep = document.querySelector('#delivery-form-container input[placeholder*="00000-000"]')?.value;

        if(!nome || !end) return alert("Preencha seu nome e endereço!");

        mensagem += `*Tipo:* Entrega%0A*Cliente:* ${nome}%0A*WhatsApp:* ${tel}%0A*Endereço:* ${end}%0A*CEP:* ${cep}`;
    } else {
        const nome = document.querySelector('#pickup-form-container input[placeholder*="buscar"]')?.value;
        const data = document.querySelector('#pickup-form-container input[type="date"]')?.value;
        const hora = document.querySelector('#pickup-form-container select')?.value;

        if(!nome || !data) return alert("Preencha o nome e a data da retirada!");

        mensagem += `*Tipo:* Retirada%0A*Nome:* ${nome}%0A*Data:* ${data}%0A*Horário:* ${hora}`;
    }

    const radioPagamento = document.querySelector('input[name="pay"]:checked');
    const pagamento = radioPagamento ? radioPagamento.parentElement.innerText.trim() : "Não informado";
    
    mensagem += `%0A*Pagamento:* ${pagamento}`;

    const seuNumero = "55119XXXXXXXX"; // <-- COLOQUE SEU NÚMERO AQUI
    window.open(`https://wa.me/${seuNumero}?text=${mensagem}`, '_blank');
});

// ==========================================
// 5. ESTADO INICIAL
// ==========================================
window.onload = () => {
    trocarCategoria('vitrine-todos');
};