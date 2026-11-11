/* PentaLab - interacción: menú plegable, pedido con total en vivo y mensaje listo para enviar */
(() => {
  document.documentElement.classList.add('js');
  const COP = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

  // Menú plegable en pantallas pequeñas
  const boton = document.querySelector('.menu-btn');
  const menu = document.getElementById('menu');
  const cerrar = () => { menu.classList.remove('abierto'); boton.setAttribute('aria-expanded', 'false'); };
  boton.addEventListener('click', () => {
    boton.setAttribute('aria-expanded', String(menu.classList.toggle('abierto')));
  });
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) cerrar(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });

  // Formulario de pedido
  const form = document.getElementById('form-pedido');
  const diseno = form.elements.diseno;
  const cantidad = form.elements.cantidad;
  const total = document.getElementById('total');
  const resultado = document.getElementById('resultado');
  const mensaje = document.getElementById('mensaje');
  const aviso = document.getElementById('aviso');

  const calcular = () => {
    const precio = Number(diseno.selectedOptions[0].dataset.precio || 0);
    const cant = Math.min(10, Math.max(1, parseInt(cantidad.value, 10) || 1));
    total.textContent = precio ? COP.format(precio * cant) : '—';
    return precio * cant;
  };
  diseno.addEventListener('change', calcular);
  cantidad.addEventListener('input', calcular);

  // «Pedir este diseño» preselecciona el diseño en el formulario
  document.querySelectorAll('[data-diseno]').forEach((enlace) => {
    enlace.addEventListener('click', () => { diseno.value = enlace.dataset.diseno; calcular(); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const notas = (d.get('notas') || '').trim();
    mensaje.textContent = [
      'Hola PentaLab, quiero hacer un pedido:',
      `Diseño: ${diseno.selectedOptions[0].textContent}`,
      `Talla: ${d.get('talla')}`,
      `Cantidad: ${d.get('cantidad')}`,
      `Total: ${COP.format(calcular())} COP`,
      `Nombre: ${d.get('nombre')}`,
      `Ciudad: ${d.get('ciudad')}`,
      notas ? `Notas: ${notas}` : ''
    ].filter(Boolean).join('\n');
    aviso.textContent = '';
    resultado.hidden = false;
    resultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  document.getElementById('copiar').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(mensaje.textContent);
      aviso.textContent = 'Mensaje copiado. Pégalo en el chat de Instagram o WhatsApp.';
    } catch {
      aviso.textContent = 'No se pudo copiar. Selecciona el texto y cópialo a mano.';
    }
  });

  calcular();
})();
