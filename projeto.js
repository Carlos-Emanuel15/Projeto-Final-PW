// Carrinho
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let total = 0;

  function formatBRL(value){
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name, price, quantity: 1 });
    }
    updateCart();
    localStorage.setItem('cart', JSON.stringify(cart));
    bumpCartIcon();
  }

  function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    total = 0;

    if (cart.length === 0) {
      cartItems.innerHTML = '<li class="cart-empty">Seu carrinho está vazio.</li>';
    }

    cart.forEach(item => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <div class="cart-item-info">
          <span class="name">${item.name} (x${item.quantity})</span>
          <span>R$ ${formatBRL(item.price * item.quantity)}</span>
        </div>
        <div class="cart-item-actions">
          <button class="btn-mini" onclick="deleteItem('${item.name}')">Remover um</button>
          <button class="btn-mini" onclick="alterarItem('${item.name}')">Alterar</button>
          <button class="btn-mini" onclick="removeFromCart('${item.name}')">Excluir</button>
        </div>`;
      cartItems.appendChild(li);
      total += item.price * item.quantity;
    });

    document.getElementById('total').textContent = formatBRL(total);

    const countEl = document.getElementById('cart-count');
    countEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCart();
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Delete
  function deleteItem(name) {
    const item = cart.find(item => item.name === name);
    if (item) {
      if (item.quantity > 1) {
        item.quantity--;
        updateCart();
        localStorage.setItem('cart', JSON.stringify(cart));
      } else {
        removeFromCart(name);
      }
    }
  }

  // Alterar
  function alterarItem(name) {
    const item = cart.find(item => item.name === name);
    if (item) {
      const novaQuantidade = parseInt(prompt(`Nova quantidade para "${name}":`, item.quantity));
      if (isNaN(novaQuantidade) || novaQuantidade < 0) return;
      if (novaQuantidade === 0) {
        removeFromCart(name);
      } else {
        item.quantity = novaQuantidade;
        updateCart();
        localStorage.setItem('cart', JSON.stringify(cart));
      }
    }
  }

  // Adicionar
  function adicionarItem(name, price, quantity = 1) {
    if (!name || isNaN(price) || price <= 0) return;
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ name, price, quantity });
    }
    updateCart();
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function clearCart() {
    cart = [];
    updateCart();
    localStorage.removeItem('cart');
  }

  function checkout() {
    if (cart.length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }
    alert(`Pedido finalizado! Total: R$ ${formatBRL(total)}`);
    clearCart();
    closeCartDrawer();
  }
   // Animação
  function bumpCartIcon(){
    const countEl = document.getElementById('cart-count');
    countEl.classList.remove('bump');
    // repetir a animação
    void countEl.offsetWidth;
    countEl.classList.add('bump');
  }

  updateCart();

  // Abrir/fechar carrinho
  const cartDrawer = document.getElementById('cart');
  const overlay = document.getElementById('overlay');

  function openCartDrawer(){
    cartDrawer.classList.add('open');
    overlay.classList.add('active');
  }
  function closeCartDrawer(){
    cartDrawer.classList.remove('open');
    if (!loginModal.classList.contains('active')) overlay.classList.remove('active');
  }

  document.getElementById('cartButton').addEventListener('click', () => {
    cartDrawer.classList.contains('open') ? closeCartDrawer() : openCartDrawer();
  });
  document.getElementById('closeCart').addEventListener('click', closeCartDrawer);

  // Menu mobile
  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });

  // Login
  const loginModal = document.getElementById('loginModal');

  function openLoginModal(){
    loginModal.classList.add('active');
    overlay.classList.add('active');
  }
  function closeLoginModal(){
    loginModal.classList.remove('active');
    if (!cartDrawer.classList.contains('open')) overlay.classList.remove('active');
  }

  document.getElementById('accountButton').addEventListener('click', openLoginModal);
  document.getElementById('closeLogin').addEventListener('click', closeLoginModal);

  overlay.addEventListener('click', () => {
    closeCartDrawer();
    closeLoginModal();
  });

  (function () {
    const form = document.getElementById('loginForm');
    const email = document.getElementById('email');
    const message = document.getElementById('loginMessage');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);

      if (!emailValido) {
        message.textContent = 'Informe um e-mail válido.';
        message.className = 'login-message error';
        return;
      }

      message.textContent = `Bem-vindo(a) de volta, ${email.value}!`;
      message.className = 'login-message success';
      setTimeout(closeLoginModal, 1200);
    });
  })();

  // Cards
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = document.querySelectorAll('.card');

  if (reduceMotion) {
    cards.forEach(card => card.classList.add('in-view'));
  } else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    cards.forEach(card => observer.observe(card));
  } else {
    cards.forEach(card => card.classList.add('in-view'));
  }