# contexts/

Pasta reservada para Contexts do React que não fazem sentido como store global.

Nesta fase o estado compartilhado (carrinho e sessão) está em `src/stores` com Zustand,
que é mais simples e não re-renderiza a árvore inteira a cada mudança.
Use um Context aqui só para valores de escopo local (ex.: um formulário em várias etapas).
