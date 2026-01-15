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

let cartItems = [];

// Abrir e Fechar Carrinho
const cartSidebar = document.querySelector('.cart-sidebar');
const cartOverlay = document.querySelector('.cart-overlay');
const closeBtn = document.querySelector('.close-cart-btn');
const openCartBtn = document.getElementById('open-cart');

function abrirCarrinho() {
    cartOverlay.classList.add('active');
    cartSidebar.classList.add('active');
}

function fecharCarrinho() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
}

openCartBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    abrirCarrinho();
});

// Eventos para fechar
closeBtn?.addEventListener('click', fecharCarrinho);
cartOverlay?.addEventListener('click', fecharCarrinho);

// Adicionar Produto
function adicionarAoCarrinho(nome, preco, imagem) {
    cartItems.push({ nome, preco: parseFloat(preco), imagem });
    atualizarInterfaceCarrinho();
    abrirCarrinho();
}


function removerItem(index) {
    cartItems.splice(index, 1);
    atualizarInterfaceCarrinho();
}


function atualizarInterfaceCarrinho() {
    const container = document.querySelector('.cart-items');
    const subtotalEl = document.querySelector('.summary-line:not(.total) span:last-child');
    const totalEl = document.querySelector('.summary-line.total span:last-child');
    const cartCount = document.getElementById('cart-count');

    container.innerHTML = '';

    if (cartItems.length === 0) {
        container.innerHTML = '<p class="empty-cart">Seu carrinho está vazio.</p>';
        subtotalEl.innerText = formatarBRL(0);
        totalEl.innerText = formatarBRL(0);
        cartCount.innerText = '0';
        return;
    }

    let subtotal = 0;

    cartItems.forEach((item, index) => {
        subtotal += item.preco;

        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.imagem}" alt="${item.nome}">
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.nome}</span>
                    <span class="cart-item-price">${formatarBRL(item.preco)}</span>
                </div>
                <button onclick="removerItem(${index})" class="remove-item">&times;</button>
            </div>
        `;
    });

    subtotalEl.innerText = formatarBRL(subtotal);
    totalEl.innerText = formatarBRL(subtotal);
    cartCount.innerText = cartItems.length;
}

function formatarBRL(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
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
    if (cartItems.length === 0) {
        alert("Adicione produtos ao carrinho antes de finalizar!");
        return;
    }

    const isDelivery =
        document.querySelector('.delivery-btn.active')?.getAttribute('data-option') === 'delivery';

    let mensagem = `*NOVO PEDIDO*%0A%0A`;

    let total = 0;

    cartItems.forEach((item, index) => {
        mensagem += `*${index + 1}.* ${item.nome}%0A`;
        mensagem += `Valor: ${formatarBRL(item.preco)}%0A%0A`;
        total += item.preco;
    });

    mensagem += `*TOTAL:* ${formatarBRL(total)}%0A`;
    mensagem += `--------------------------%0A`;

    if (isDelivery) {
        const nome = document.getElementById('cliente-nome')?.value;
        const tel = document.getElementById('cliente-telefone')?.value;
        const end = document.getElementById('cliente-endereco')?.value;
         const cep = document.getElementById('cliente-cep')?.value;

        if (!nome || !end) {
            alert("Preencha seu nome e endereço!");
            return;
        }

        mensagem += `*Tipo:* Entrega%0A`;
        mensagem += `*Cliente:* ${nome}%0A`;
        mensagem += `*WhatsApp:* ${tel}%0A`;
        mensagem += `*Endereço:* ${end}%0A`;
        mensagem += `*CEP:* ${cep}%0A`;
    } else {
        const nome = document.querySelector('#pickup-form-container input[placeholder*="buscar"]')?.value;
        const data = document.querySelector('#pickup-form-container input[type="date"]')?.value;
        const hora = document.querySelector('#pickup-form-container select')?.value;

        if (!nome || !data) {
            alert("Preencha o nome e a data da retirada!");
            return;
        }

        mensagem += `*Tipo:* Retirada%0A`;
        mensagem += `*Nome:* ${nome}%0A`;
        mensagem += `*Data:* ${data}%0A`;
        mensagem += `*Horário:* ${hora}%0A`;
    }

    const radioPagamento = document.querySelector('input[name="pay"]:checked');
    const pagamento = radioPagamento
        ? radioPagamento.parentElement.innerText.trim()
        : "Não informado";

    mensagem += `%0A*Pagamento:* ${pagamento}`;

    const seuNumero = "5511911089322"; // SEU NÚMERO
    window.open(`https://wa.me/${seuNumero}?text=${mensagem}`, '_blank');
});


// ==========================================
// 2.1 BOTÃO COMPRAR → ADICIONAR AO CARRINHO
// ==========================================

document.querySelectorAll('.btn-comprar').forEach(botao => {
    botao.addEventListener('click', () => {

        const card = botao.closest('.produto-card');

        const nome = card.querySelector('h3').innerText;

        const precoTexto = card.querySelector('.preco').innerText;
        const preco = precoTexto
            .replace('R$', '')
            .replace('.', '')
            .replace(',', '.')
            .trim();

        const imagem = card.querySelector('img').getAttribute('src');

        adicionarAoCarrinho(nome, preco, imagem);
    });
});


// ==========================================
// 5. ESTADO INICIAL
// ==========================================
window.onload = () => {
    trocarCategoria('vitrine-todos');
};




// --- CONTROLE DO MENU HAMBÚRGUER ---
const btnAbrirMenu = document.getElementById('btn-menu-abrir');
const btnFecharMenu = document.getElementById('btn-menu-fechar');
const menuCategorias = document.getElementById('menu-categorias');
const menuOverlay = document.getElementById('menu-overlay');

function toggleMobileMenu(open) {
    if (open) {
        menuCategorias.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Trava o scroll do fundo
    } else {
        menuCategorias.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

btnAbrirMenu?.addEventListener('click', () => toggleMobileMenu(true));
btnFecharMenu?.addEventListener('click', () => toggleMobileMenu(false));
menuOverlay?.addEventListener('click', () => toggleMobileMenu(false));

// Fecha o menu ao clicar em uma categoria (importante para mobile)
document.querySelectorAll('.categorias a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            toggleMobileMenu(false);
        }
    });
});