// ---------------------------------------------- Classe Relatorio ------------------------------------------

//funcao para gerar tela de busca de relatorio
async function telaDeRelatorio() {
  let codigoHTML = '';

  codigoHTML += `<div class="shadow-lg p-3 mb-5 bg-white rounded">
      <h4 class="text-center"><span class="fas fa-chart-pie"></span> Relatórios</h4>
      <div class="card-deck col-6 mx-auto d-block">
        <button onclick="confirmarAcao('Imprimir relatório geral!','impressaoRelatorioGeral();','')" type="button" class="btn btn-warning btn-block" style="margin-top:60px; margin-bottom:30px;">
          <span class="fas fa-print"></span> Imprimir relatório
        </button>
      </div>
      <div class="card-deck col-12 mx-auto d-block" style="margin-top:30px;">
        <h6 class="text-center">Os gráficos de representação do dia são:"Demonstrativo de Arrecadação Periódico (Bruto e Líquido)", "Relatório de Produtos Mais e Menos Vendidos" e "Lista de Pedidos Fechados".</h6>
        <h6 class="text-center">O gráfico de respresentação geral é:"Demonstrativo de Lucro e Dispesa sobre Produto".</h6>
      </div>
    </div>

    <div class="shadow-lg p-3 mb-5 bg-white rounded">
    <div id="grafico0" style="margin-top:40px;" class="col-12 rounded mx-auto d-block"></div>
    </div>
    <div class="shadow-lg p-3 mb-5 bg-white rounded">
    <div id="grafico1" style="margin-top:20px;" class="col-12 rounded mx-auto d-block"></div>
    </div>
    <div class="shadow-lg p-3 mb-5 bg-white rounded">
    <div id="grafico2" style="margin-top:20px;" class="col-12 rounded mx-auto d-block"></div>
    </div>
    <div class="shadow-lg p-3 mb-5 bg-white rounded">
    <div id="listaItens" style="margin-top:20px" class="col-12 rounded mx-auto d-block"></div>
    </div>`

  animacaoJanela2();
  setTimeout(function () { document.getElementById('janela2').innerHTML = codigoHTML }, 30)
  await aguardeCarregamento(true);
  await requisicaoDELETE(`reports`, '', { headers: { Authorization: `Bearer ${buscarSessionUser().token}` } })
  await aguardeCarregamento(false);
  setTimeout(async function () {
    await gerarGraficoLucroTotalPeriodico();
    await gerarGraficoGastoseGanhosSobreproduto();
    await gerarGraficoProdutosMaiseMenosVendidos();
  }, 300)
}

//funcao responsavel por gerar o relatorio de lucro total periodico(bruto/liquido)
async function gerarGraficoLucroTotalPeriodico() {
  try {
    await aguardeCarregamento(true);
    let json = await requisicaoGET('reports/orders/profit', { headers: { Authorization: `Bearer ${buscarSessionUser().token}` } })
    await aguardeCarregamento(false);

    Highcharts.chart('grafico0', {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Demonstrativo de Arrecadação Periódico (Bruto e Líquido)',
      },
      subtitle: {
        text:
          'Gráfico responsável por demonstrar o valor líquido e bruto arrecadados dentro de um determinado período(Valor líquido = valor total - valor de gasto com produtos - valor da taxa de entrega).',
      },
      xAxis: {
        categories: ['Lucro total'],
      },
      yAxis: [
        {
          min: 0.0,
          title: {
            text: 'Valor (R$x.xx)',
          },
        },
        {
          title: {
            text: 'Valor (R$x.xx)',
          },
          opposite: true,
        },
      ],
      legend: {
        shadow: false,
      },
      tooltip: {
        shared: true,
      },
      plotOptions: {
        column: {
          grouping: false,
          shadow: false,
          borderWidth: 0,
        },
      },
      series: [
        {
          name: 'Valor Bruto',
          color: 'rgba(248,161,63,1)',
          data: [parseFloat(json.data.total)],
          tooltip: {
            valuePrefix: 'R$',
            valueSuffix: ' (reais)',
          },
          pointPadding: 0.3,
          pointPlacement: 0.2,
          yAxis: 1,
        },
        {
          name: 'Valor Líquido',
          color: 'rgba(186,60,61,.9)',
          data: [parseFloat(json.data.netValue)],
          tooltip: {
            valuePrefix: 'R$',
            valueSuffix: ' (reais)',
          },
          pointPadding: 0.4,
          pointPlacement: 0.2,
          yAxis: 1,
        },
      ],
    });

    await gerarListaDePedidosFechados(json.data.orders);

  } catch (error) {
    document.getElementById('grafico0').innerHTML = '<h5 class="text-center" style="margin-top:10vh;"><span class="fas fa-exclamation-triangle"></span> Dados indisponíveis para o gráfico "Demonstrativo de Lucro Periódico (Bruto e Líquido)"!</h5>'
  }
}

//funcao responsavel por gerar o relatorio de relacao de gastos e gganhos sobre produto
async function gerarGraficoGastoseGanhosSobreproduto() {
  try {
    await aguardeCarregamento(true);
    let categoria = [], vetorLucro = [], vetorDispesa = [], json = await requisicaoGET('reports/products/dispense_gain', { headers: { Authorization: `Bearer ${buscarSessionUser().token}` } })
    await aguardeCarregamento(false);

    for (let item of json.data) {
      vetorLucro.push(parseFloat(item.gain))
      vetorDispesa.push(parseFloat(item.dispense))
      categoria.push(item._id.name)
    }


    Highcharts.chart('grafico1', {
      chart: {
        zoomType: 'xy',
      },
      title: {
        text: 'Demonstrativo de Lucro e Dispesa sobre Produto',
      },
      subtitle: {
        text: 'Gráfico responsavel por demonstrar o ganho em relação com o gasto de cada produto.',
      },
      xAxis: [
        {
          categories: categoria,
          crosshair: true,
        },
      ],
      yAxis: [
        {
          // Primary yAxis
          labels: {
            format: 'R${value}',
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
          title: {
            text: 'Valor Reais',
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
        },
        {
          // Secondary yAxis
          title: {
            text: 'Valor Reais',
            style: {
              color: Highcharts.getOptions().colors[0],
            },
          },
          labels: {
            format: 'R${value}',
            style: {
              color: Highcharts.getOptions().colors[0],
            },
          },
          opposite: true,
        },
      ],
      tooltip: {
        shared: true,
      },
      legend: {
        layout: 'vertical',
        align: 'left',
        x: 120,
        verticalAlign: 'top',
        y: 100,
        floating: true,
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || 'rgba(255,255,255,0.25)', // theme
      },
      series: [
        {
          name: 'Lucro sobre produto',
          type: 'column',
          yAxis: 1,
          data: vetorLucro,
          tooltip: {
            valuePrefix: 'R$',
            valueSuffix: ' (reais)',
          },
        },
        {
          name: 'Dispesa sobre produto',
          type: 'spline',
          data: vetorDispesa,
          tooltip: {
            valuePrefix: 'R$',
            valueSuffix: ' (reais)',
          },
        },
      ],
    });
  } catch (error) {
    document.getElementById('grafico1').innerHTML = '<h5 class="text-center" style="margin-top:10vh;"><span class="fas fa-exclamation-triangle"></span> Dados indisponíveis para o gráfico "Demonstrativo de Lucro e Dispesa sobre Produto"!</h5>'
  }
}

//funcao responsavel por gerar o relatorio de produtos vendidos
async function gerarGraficoProdutosMaiseMenosVendidos() {
  try {
    await aguardeCarregamento(true);
    let categoria = [], vetorDeProduto = [], json = await requisicaoGET('reports/products/amount', { headers: { Authorization: `Bearer ${buscarSessionUser().token}` } })
    await aguardeCarregamento(false);

    for (let item of json.data) {
      categoria.push(item._id.name)
      vetorDeProduto.push(item.amount)
    }


    Highcharts.chart('grafico2', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Relatório de Produtos Mais e Menos Vendidos'
      },
      subtitle: {
        text: 'Gráfico responsavel por demonstrar os produto que foram mais e menos vendidos.'
      },
      xAxis: {
        categories: categoria,
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Quantidade (Unidade)'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.0f} (Unid.)</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [{
        name: 'QuantidadeTotal',
        data: vetorDeProduto

      }]
    });
  } catch (error) {
    document.getElementById('grafico2').innerHTML = '<h5 class="text-center" style="margin-top:10vh;"><span class="fas fa-exclamation-triangle"></span> Dados indisponíveis para o gráfico "Relatório de Produtos Mais e Menos Vendidos"!</h5>'
  }
}

//funcao responsavel por gerar a listagem de pedidos fechados
function gerarListaDePedidosFechados(json) {
  let codigoHTML = ``

  try {
    codigoHTML += `<h4 class="text-center">Lista de Pedidos Fechados</h4>
      <table class="table table-sm table-bordered">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Cliente</th>
            <th scope="col">Motoboy</th>
            <th scope="col">Itens/Quant.</th>
            <th scope="col">Forma de pagamento</th>
            <th scope="col">Valor total</th>
            <th scope="col">Forma de requerimento</th>
            <th scope="col">Data/hora</th>
          </tr>
        </thead>
        <tbody class="table-warning">`
    for (let item of json) {
      const date = format(parseISO(item.createdAt), 'dd/MM/yyyy HH:mm:ss')
      codigoHTML += `<tr>
          <td><strong>${item.identification}</strong></td>
          <td title="${item.user.name}"><strong>${corrigirTamanhoString(15, item.user.name)}</strong></td>`
      if (item.deliveryman) {
        codigoHTML += `<td title="${item.deliveryman.name}"><strong>${corrigirTamanhoString(15, item.deliveryman.name)}</strong></td>`
      } else {
        codigoHTML += `<td><strong>Retirada local.</strong></td>`
      }
      codigoHTML += `<td><strong>`
      for (let item2 of item.items) {
        codigoHTML += `(${corrigirTamanhoString(15, item2.product.name)}/${item2.quantity}),`
      }
      codigoHTML += `</strong></td>
        <td><strong>${item.payment}</strong></td>
          <td class="text-danger"><strong>R$${(parseFloat(item.total)).toFixed(2)}</strong></td>
          <td><strong>${item.source}</strong></td>
          <td><strong>${date}</strong></td>
        </tr>`
    }
    codigoHTML += `</tbody>
      </table>`

    document.getElementById('listaItens').innerHTML = codigoHTML;

  } catch (error) {
    document.getElementById('listaItens').innerHTML = '<h5 class="text-center" style="margin-top:10vh;"><span class="fas fa-exclamation-triangle"></span> Dados indisponíveis para "Lista de Pedidos Fechados"!</h5>'
  }
}

//funcao responsavel por imprimir o relatorio geral
async function impressaoRelatorioGeral() {
  try {
    await aguardeCarregamento(true);
    await requisicaoPrintGET(`printers/sold_report`, { headers: { Authorization: `Bearer ${buscarSessionUser().token}` } })
    await aguardeCarregamento(false);
    await mensagemDeAviso('Imprimindo relatório geral...')
  } catch (error) {
    mensagemDeErro('Não foi possível imprimir o relatório!')
  }
}
