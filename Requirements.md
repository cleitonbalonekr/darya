## Requisitos Sistema integrado com Ifood

### Reports

- valor separado das vendas, valor total, separar por forma de pagamento
- adicionar transferência Itaú e Bradesco

- relatório de vendas:

* Quantos pedidos foram feitos
* Quantos donald's (Quantidade vendida no dia) separados e o total
* valor total separadamente das vendas em cartão e dinheiro
* valor total no final em caixa

- Motoboy relatório:

* endereços das entregas
* valor total das taxas

### Updates

D* Não necessário criação de pedidos com motoboys ok
D* Crud de ingredients
D* Controle de estoque de ingredientes (atualizar estoque do ingrediente ao realizar uma venda) obs. testar um pouco mais
Populate nos produtos
D* Valor unitário do ingredinete, campo price_unit, create and update
D* Preço de custo do produto, calculo com base nos ingredientes? ingredient price_unit * ingredient quantity
D* Preço de custo do produto ao cria-lo
D* Atualizar preço de custo do produto ao atualiza-lo
D* Atualizar preço de custo do produto ao atualiza preço do ingredient ( price_unit )
D* Delete cascate para essa feature

D\* Remover o campo stock, atualizar o report controller para essa mudança ok

- Usar os dados já cadastrados no db do cliente

## Questions

- Ao criar coloca-se o deliveryman com hasDelivery true, isso é necessário?

### Requisitos funcionais

##### validação para cliente com mesmo nome

D* Crud de cliente ok
D* Crud de motoboy ok
D\* Crude de bairro ok

<!-- * Motoboys tem dias de trabalho -->

D* Informar motoboys disponíveis ok
D* Taxa do motoboy por bairro ok
D* motoboy deve ter identificação dos pedidos para conferir no fim do dia ok
D* Calcular total a pagar no motoboy ao fim do dia baseado na sua taxa ok lista de vendas
D\* listar motoboys disponíveis dia de trabalho e fora de entrega ok

<!-- * Selecionar motoboys por dia -->

D* Crud de produtos, preço de custo ok
D* Efetuar venda - contém o cliente e os produtos ok
D* Calcular valor total do pedido com taxa ok
D* Emitir relatório diário - lucro total, detalhes das vendas ok total liquido ok

D* relatório de total gasto com produtos e total ganho com produtos
D* relatório produtos mais vendidos em quantidade
D* Emitir comanda
D* Segunda via de comanda

### Requisitos não-funcionais

- Node js
- Electron
- MongoDB ou MySQL/Postgre
- Sistema mais rápido possível
- Offline/online

### Regras de negócio

D\* Motoboy faz entregas por bairro, mais de uma entrega por vez ok

D\* motoboy tem campo "tenho entrega" boolean que é true quando ele tem algum pedido

D\* O estado do motoboy é "livre" quando não está em nenhuma entrega e está no seu horário de trabalho ok

D\* Ao concluir a venda o motoboy vai para o estado "Livre" ok

D\* O pedido deve ter origem “pedido do iFood” “ pedido WhatsApp “, “ pronta entrega “, “ pedido do Instagram “. ok

###### \* Apagar o pedido ao emitir o relatório, relatório baseado em data. delete de 2 anos

### Venda Ifood

- Quando é recebido o status `CONFIRMED` a venda é criada sem o motoboy e com o id da venda do ifood guardado.
- Campo ifood , boolean
- pagar todos o itens da venda do ifood, nome e quantidade
- salva como uma nova venda
- exibir todas as vendas com ifood = true
- selecionando um motoboy para a venda ifood ela vai para o status delivery
- quando o motoboy voltar, colocar como "closed"
- quando o ifood retorna `CANCELLED` a venda é excluida pelo ifood_id

Campos

id:
ifood_id:
closed:
ifood:
delivery:

### Conexão com a api do Ifood

[link da documentação](https://developer.ifood.com.br/reference)

- Primeiro será necessário autenticar na api
  obs: o token dura 1h
- Requisição `/oauth/token` pagar pegar o token

#### A cada 30 segundos reenviar as seguintes requisições

- Requisição `/events:polling` para pegar todos os eventos
- Filtrar os eventos `CONFIRMED` e `CONCLUDED`
- Os eventos `CONFIRMED` serão usados para pegar os detalhes do pedido e imprimir
- Os eventos `CONCLUDED` serão usados para pegar os detalhes do pedido e salvar
- Requisição `/events/acknowledgment` para fazer reconhecimeto dos eventos já recebidos
- Requisição `/orders/{reference}` para pegar detalhes do pedido
