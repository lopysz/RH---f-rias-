/* =========================================================
   PRANCHETA RH
========================================================= */

"use strict";


/* =========================================================
   BANCO LOCAL
========================================================= */

let funcionarios = carregarFuncionarios();


function carregarFuncionarios() {

    try {

        const dados = localStorage.getItem(
            "pranchetaFuncionarios"
        );

        if (!dados) {
            return [];
        }

        const lista = JSON.parse(dados);

        return Array.isArray(lista) ? lista : [];

    } catch (erro) {

        console.error(
            "Erro ao carregar funcionários:",
            erro
        );

        return [];
    }
}


function salvarFuncionarios() {

    localStorage.setItem(
        "pranchetaFuncionarios",
        JSON.stringify(funcionarios)
    );
}


/* =========================================================
   UTILITÁRIOS
========================================================= */

function moeda(valor) {

    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


function numero(id) {

    const campo = document.getElementById(id);

    if (!campo) {
        return 0;
    }

    return Number(
        String(campo.value).replace(",", ".")
    ) || 0;
}


function escapar(valor) {

    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function definirTitulo(titulo, subtitulo) {

    document.getElementById(
        "tituloPagina"
    ).textContent = titulo;

    document.getElementById(
        "subtituloPagina"
    ).textContent = subtitulo;
}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function abrirPagina(nome) {

    document
        .querySelectorAll(".menu-item")
        .forEach(botao => {

            botao.classList.remove("ativo");

            if (
                botao.dataset.pagina === nome
            ) {
                botao.classList.add("ativo");
            }

        });


    switch (nome) {

        case "ferias":

            definirTitulo(
                "Férias",
                "Cálculo completo da remuneração de férias"
            );

            mostrarFerias();

            break;


        case "cadastrar":

            definirTitulo(
                "Cadastrar funcionário",
                "Cadastro de funcionários"
            );

            mostrarCadastro();

            break;


        case "funcionarios":

            definirTitulo(
                "Funcionários",
                "Funcionários cadastrados no sistema"
            );

            mostrarFuncionarios();

            break;


        case "planilhas":

            definirTitulo(
                "Planilhas de funcionários",
                "Organização e exportação dos funcionários"
            );

            mostrarPlanilhas();

            break;


        case "consignado":

            definirTitulo(
                "Empréstimo consignado",
                "Cálculo de empréstimos consignados"
            );

            mostrarConsignado();

            break;


        case "folha":

            definirTitulo(
                "Folha de pagamento",
                "Cálculo da folha de pagamento"
            );

            mostrarFolha();

            break;

    }
}


/* =========================================================
   CADASTRO
========================================================= */

function mostrarCadastro() {

    document.getElementById(
        "areaConteudo"
    ).innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>Novo funcionário</h2>

                <p>
                    Cadastre os dados do funcionário.
                </p>

            </div>

            <div class="card-corpo">

                <div class="form-grid">

                    <div class="form-grupo largo">

                        <label>Nome completo</label>

                        <input
                            id="cadNome"
                            type="text"
                            placeholder="Nome do funcionário"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>CPF</label>

                        <input
                            id="cadCPF"
                            type="text"
                            placeholder="000.000.000-00"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Matrícula</label>

                        <input
                            id="cadMatricula"
                            type="text"
                            placeholder="Matrícula"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Cargo</label>

                        <input
                            id="cadCargo"
                            type="text"
                            placeholder="Cargo"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Salário base atual</label>

                        <input
                            id="cadSalario"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0,00"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Data de admissão</label>

                        <input
                            id="cadAdmissao"
                            type="date"
                        >

                    </div>

                </div>


                <div class="botoes">

                    <button
                        class="btn btn-principal"
                        id="btnCadastrar"
                    >
                        Cadastrar funcionário
                    </button>

                    <button
                        class="btn btn-secundario"
                        id="btnLimparCadastro"
                    >
                        Limpar
                    </button>

                </div>

            </div>

        </div>

    `;


    document
        .getElementById("btnCadastrar")
        .addEventListener(
            "click",
            cadastrarFuncionario
        );


    document
        .getElementById("btnLimparCadastro")
        .addEventListener(
            "click",
            mostrarCadastro
        );
}


function cadastrarFuncionario() {

    const nome =
        document.getElementById("cadNome")
            .value.trim();

    const cpf =
        document.getElementById("cadCPF")
            .value.trim();

    const matricula =
        document.getElementById("cadMatricula")
            .value.trim();

    const cargo =
        document.getElementById("cadCargo")
            .value.trim();

    const salario =
        Number(
            document.getElementById("cadSalario").value
        ) || 0;

    const admissao =
        document.getElementById("cadAdmissao").value;


    if (!nome) {

        alert("Informe o nome do funcionário.");

        return;
    }


    if (!matricula) {

        alert("Informe a matrícula.");

        return;
    }


    if (
        funcionarios.some(
            funcionario =>
                String(funcionario.matricula)
                === String(matricula)
        )
    ) {

        alert(
            "Já existe um funcionário com essa matrícula."
        );

        return;
    }


    const funcionario = {

        id:
            "FUNC-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 8),

        nome,

        cpf,

        matricula,

        cargo,

        salario,

        admissao

    };


    funcionarios.push(funcionario);

    salvarFuncionarios();


    alert(
        "Funcionário cadastrado com sucesso."
    );


    abrirPagina("funcionarios");
}


/* =========================================================
   FUNCIONÁRIOS
========================================================= */

function mostrarFuncionarios() {

    let linhas = "";


    if (funcionarios.length === 0) {

        linhas = `

            <tr>

                <td colspan="5">
                    Nenhum funcionário cadastrado.
                </td>

            </tr>

        `;

    } else {

        funcionarios.forEach(funcionario => {

            linhas += `

                <tr>

                    <td>
                        ${escapar(funcionario.matricula)}
                    </td>

                    <td>
                        ${escapar(funcionario.nome)}
                    </td>

                    <td>
                        ${escapar(funcionario.cargo || "-")}
                    </td>

                    <td>
                        ${moeda(funcionario.salario)}
                    </td>

                    <td>

                        <button
                            class="btn btn-principal btn-ferias"
                            data-id="${escapar(funcionario.id)}"
                            style="
                                height:34px;
                                padding:0 12px;
                            "
                        >
                            Calcular férias
                        </button>

                    </td>

                </tr>

            `;

        });

    }


    document.getElementById(
        "areaConteudo"
    ).innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>Funcionários cadastrados</h2>

                <p>
                    Funcionários disponíveis para os cálculos.
                </p>

            </div>

            <div class="card-corpo tabela-container">

                <table>

                    <thead>

                        <tr>

                            <th>Matrícula</th>
                            <th>Nome</th>
                            <th>Cargo</th>
                            <th>Salário</th>
                            <th>Ação</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${linhas}

                    </tbody>

                </table>

            </div>

        </div>

    `;


    document
        .querySelectorAll(".btn-ferias")
        .forEach(botao => {

            botao.addEventListener(
                "click",
                function() {

                    abrirFeriasFuncionario(
                        this.dataset.id
                    );

                }
            );

        });
}


/* =========================================================
   FÉRIAS
========================================================= */

function mostrarFerias(funcionarioId = "") {

    let opcoes = `
        <option value="">
            Selecione um funcionário
        </option>
    `;


    funcionarios.forEach(funcionario => {

        opcoes += `

            <option
                value="${escapar(funcionario.id)}"
                ${
                    String(funcionario.id)
                    === String(funcionarioId)
                    ? "selected"
                    : ""
                }
            >

                ${escapar(funcionario.matricula)}
                -
                ${escapar(funcionario.nome)}

            </option>

        `;

    });


    document.getElementById(
        "areaConteudo"
    ).innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>Funcionário e período</h2>

                <p>
                    Selecione o funcionário para iniciar o cálculo.
                </p>

            </div>

            <div class="card-corpo">

                <div class="form-grid">

                    <div class="form-grupo largo">

                        <label>Funcionário</label>

                        <select id="feriasFuncionario">

                            ${opcoes}

                        </select>

                    </div>


                    <div class="form-grupo">

                        <label>
                            Período aquisitivo inicial
                        </label>

                        <input
                            id="inicioAquisitivo"
                            type="date"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Período aquisitivo final
                        </label>

                        <input
                            id="fimAquisitivo"
                            type="date"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Dias de direito</label>

                        <input
                            id="diasDireito"
                            type="number"
                            value="30"
                            readonly
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Dias de férias</label>

                        <input
                            id="diasFerias"
                            type="number"
                            min="0"
                            max="30"
                            value="30"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Faltas injustificadas</label>

                        <input
                            id="faltas"
                            type="number"
                            min="0"
                            value="0"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Dias vendidos</label>

                        <input
                            id="diasVendidos"
                            type="number"
                            min="0"
                            max="10"
                            value="0"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Dependentes</label>

                        <input
                            id="dependentes"
                            type="number"
                            min="0"
                            value="0"
                        >

                    </div>

                </div>


                <div
                    id="funcionarioSelecionado"
                    class="funcionario-selecionado"
                >

                    <strong>
                        Funcionário selecionado
                    </strong>

                    <div
                        id="funcionarioInfo"
                        class="funcionario-info"
                    ></div>

                </div>

            </div>

        </div>


        <div class="card">

            <div class="card-cabecalho">

                <h2>Componentes da remuneração</h2>

                <p>
                    Valores considerados na remuneração das férias.
                </p>

            </div>

            <div class="card-corpo">

                <div class="componentes-grid">


                    ${componente(
                        "salarioBase",
                        "Salário base atual",
                        "Salário contratual atual."
                    )}


                    ${componente(
                        "mediaHE",
                        "Média de horas extras",
                        "Média remuneratória considerada."
                    )}


                    ${componente(
                        "mediaNoturno",
                        "Média de adicional noturno",
                        "Média do adicional habitual."
                    )}


                    ${componente(
                        "mediaComissoes",
                        "Média de comissões e prêmios",
                        "Médias habituais consideradas."
                    )}


                    ${componente(
                        "mediaDSR",
                        "Média de DSR",
                        "Reflexos de DSR."
                    )}


                    ${componente(
                        "periculosidade",
                        "Adicional de periculosidade",
                        "Valor mensal considerado."
                    )}


                    ${componente(
                        "insalubridade",
                        "Adicional de insalubridade",
                        "Valor mensal considerado."
                    )}

                </div>

            </div>

        </div>


        <div class="card">

            <div class="card-cabecalho">

                <h2>Composição das férias</h2>

                <p>
                    Memória do cálculo da remuneração bruta.
                </p>

            </div>

            <div class="card-corpo">

                <div class="valor-lista">

                    ${linhaValor(
                        "Salário base proporcional",
                        "rSalario"
                    )}

                    ${linhaValor(
                        "Média de horas extras",
                        "rHE"
                    )}

                    ${linhaValor(
                        "Média de adicional noturno",
                        "rNoturno"
                    )}

                    ${linhaValor(
                        "Média de comissões e prêmios",
                        "rComissoes"
                    )}

                    ${linhaValor(
                        "Média de DSR",
                        "rDSR"
                    )}

                    ${linhaValor(
                        "Periculosidade",
                        "rPericulosidade"
                    )}

                    ${linhaValor(
                        "Insalubridade",
                        "rInsalubridade"
                    )}

                    ${linhaValor(
                        "Remuneração considerada",
                        "rRemuneracao"
                    )}

                    ${linhaValor(
                        "Valor dos dias de férias",
                        "rFerias"
                    )}

                    ${linhaValor(
                        "1/3 constitucional",
                        "rTerco"
                    )}

                    ${linhaValor(
                        "Abono pecuniário",
                        "rAbono"
                    )}

                    ${linhaValor(
                        "1/3 sobre o abono",
                        "rTercoAbono"
                    )}

                </div>


                <div class="total-bruto">

                    <div class="descricao">
                        TOTAL BRUTO DAS FÉRIAS
                    </div>

                    <div
                        class="numero"
                        id="totalBruto"
                    >
                        R$ 0,00
                    </div>

                </div>


                <div class="botoes">

                    <button
                        class="btn btn-principal"
                        id="btnCalcularBruto"
                    >
                        Calcular bruto
                    </button>

                    <button
                        class="btn btn-secundario"
                        id="btnLimparFerias"
                    >
                        Limpar
                    </button>

                </div>

            </div>

        </div>


        <div class="card">

            <div class="card-cabecalho">

                <h2>Descontos</h2>

                <p>
                    Valores utilizados na etapa do cálculo líquido.
                </p>

            </div>

            <div class="card-corpo">

                <div class="componentes-grid">

                    ${desconto(
                        "inss",
                        "INSS"
                    )}

                    ${desconto(
                        "irrf",
                        "IRRF"
                    )}

                    ${desconto(
                        "consignado",
                        "Empréstimo consignado"
                    )}

                    ${desconto(
                        "pensao",
                        "Pensão alimentícia"
                    )}

                    ${desconto(
                        "adiantamento",
                        "Adiantamento"
                    )}

                    ${desconto(
                        "alimentacao",
                        "Alimentação / refeição"
                    )}

                    ${desconto(
                        "valeTransporte",
                        "Vale-transporte"
                    )}

                    ${desconto(
                        "planoSaude",
                        "Plano de saúde"
                    )}

                    ${desconto(
                        "planoOdonto",
                        "Plano odontológico"
                    )}

                    ${desconto(
                        "outros",
                        "Outros convênios autorizados"
                    )}

                </div>

            </div>

        </div>

    `;


    document
        .getElementById("feriasFuncionario")
        .addEventListener(
            "change",
            selecionarFuncionarioFerias
        );


    document
        .getElementById("faltas")
        .addEventListener(
            "input",
            calcularDireito
        );


    document
        .getElementById("diasFerias")
        .addEventListener(
            "input",
            calcularBruto
        );


    document
        .getElementById("diasVendidos")
        .addEventListener(
            "input",
            calcularBruto
        );


    [
        "salarioBase",
        "mediaHE",
        "mediaNoturno",
        "mediaComissoes",
        "mediaDSR",
        "periculosidade",
        "insalubridade"
    ].forEach(id => {

        document
            .getElementById(id)
            .addEventListener(
                "input",
                calcularBruto
            );

    });


    document
        .getElementById("btnCalcularBruto")
        .addEventListener(
            "click",
            calcularBruto
        );


    document
        .getElementById("btnLimparFerias")
        .addEventListener(
            "click",
            () => mostrarFerias()
        );


    if (funcionarioId) {

        selecionarFuncionarioFerias();

    } else {

        calcularBruto();

    }
}


function componente(id, titulo, descricao) {

    return `

        <div class="componente">

            <label>${titulo}</label>

            <input
                id="${id}"
                type="number"
                step="0.01"
                min="0"
                value="0"
            >

            <small>
                ${descricao}
            </small>

        </div>

    `;
}


function linhaValor(titulo, id) {

    return `

        <div class="valor-linha">

            <span>
                ${titulo}
            </span>

            <span
                class="valor"
                id="${id}"
            >
                R$ 0,00
            </span>

        </div>

    `;
}


function desconto(id, titulo) {

    return `

        <div class="componente">

            <label>${titulo}</label>

            <input
                id="${id}"
                type="number"
                step="0.01"
                min="0"
                value="0"
            >

        </div>

    `;
}


/* =========================================================
   ABRIR FÉRIAS DE FUNCIONÁRIO
========================================================= */

function abrirFeriasFuncionario(id) {

    definirTitulo(
        "Férias",
        "Cálculo completo da remuneração de férias"
    );


    document
        .querySelectorAll(".menu-item")
        .forEach(botao => {

            botao.classList.remove("ativo");

            if (
                botao.dataset.pagina === "ferias"
            ) {
                botao.classList.add("ativo");
            }

        });


    mostrarFerias(id);
}


/* =========================================================
   SELECIONAR FUNCIONÁRIO
========================================================= */

function selecionarFuncionarioFerias() {

    const select =
        document.getElementById(
            "feriasFuncionario"
        );

    if (!select) {
        return;
    }


    const funcionario =
        funcionarios.find(
            f =>
                String(f.id)
                === String(select.value)
        );


    const painel =
        document.getElementById(
            "funcionarioSelecionado"
        );


    const info =
        document.getElementById(
            "funcionarioInfo"
        );


    if (!funcionario) {

        painel.classList.remove("mostrar");

        document.getElementById(
            "salarioBase"
        ).value = 0;

        calcularBruto();

        return;
    }


    painel.classList.add("mostrar");


    info.innerHTML = `

        <span>
            <strong>Matrícula:</strong>
            ${escapar(funcionario.matricula)}
        </span>

        <span>
            <strong>Nome:</strong>
            ${escapar(funcionario.nome)}
        </span>

        <span>
            <strong>Cargo:</strong>
            ${escapar(funcionario.cargo || "-")}
        </span>

        <span>
            <strong>Salário:</strong>
            ${moeda(funcionario.salario)}
        </span>

    `;


    document.getElementById(
        "salarioBase"
    ).value =
        Number(funcionario.salario) || 0;


    calcularBruto();
}


/* =========================================================
   DIREITO
========================================================= */

function calcularDireito() {

    const faltas = numero("faltas");

    let dias = 30;


    if (faltas >= 6 && faltas <= 14) {
        dias = 24;
    }

    else if (faltas >= 15 && faltas <= 23) {
        dias = 18;
    }

    else if (faltas >= 24 && faltas <= 32) {
        dias = 12;
    }

    else if (faltas >= 33) {
        dias = 0;
    }


    document.getElementById(
        "diasDireito"
    ).value = dias;


    const campo =
        document.getElementById("diasFerias");


    if (Number(campo.value) > dias) {
        campo.value = dias;
    }


    calcularBruto();
}


/* =========================================================
   CÁLCULO BRUTO
========================================================= */

function calcularBruto() {

    const salario =
        numero("salarioBase");

    const he =
        numero("mediaHE");

    const noturno =
        numero("mediaNoturno");

    const comissoes =
        numero("mediaComissoes");

    const dsr =
        numero("mediaDSR");

    const periculosidade =
        numero("periculosidade");

    const insalubridade =
        numero("insalubridade");

    const diasFerias =
        numero("diasFerias");

    const diasVendidos =
        Math.min(
            Math.max(numero("diasVendidos"), 0),
            10
        );


    const remuneracao =
        salario +
        he +
        noturno +
        comissoes +
        dsr +
        periculosidade +
        insalubridade;


    const valorFerias =
        (remuneracao / 30) *
        diasFerias;


    const terco =
        valorFerias / 3;


    const abono =
        (remuneracao / 30) *
        diasVendidos;


    const tercoAbono =
        abono / 3;


    const totalBruto =
        valorFerias +
        terco +
        abono +
        tercoAbono;


    atualizar("rSalario",
        moeda((salario / 30) * diasFerias)
    );

    atualizar("rHE",
        moeda((he / 30) * diasFerias)
    );

    atualizar("rNoturno",
        moeda((noturno / 30) * diasFerias)
    );

    atualizar("rComissoes",
        moeda((comissoes / 30) * diasFerias)
    );

    atualizar("rDSR",
        moeda((dsr / 30) * diasFerias)
    );

    atualizar("rPericulosidade",
        moeda((periculosidade / 30) * diasFerias)
    );

    atualizar("rInsalubridade",
        moeda((insalubridade / 30) * diasFerias)
    );

    atualizar("rRemuneracao",
        moeda(remuneracao)
    );

    atualizar("rFerias",
        moeda(valorFerias)
    );

    atualizar("rTerco",
        moeda(terco)
    );

    atualizar("rAbono",
        moeda(abono)
    );

    atualizar("rTercoAbono",
        moeda(tercoAbono)
    );

    atualizar("totalBruto",
        moeda(totalBruto)
    );
}


function atualizar(id, valor) {

    const elemento =
        document.getElementById(id);

    if (elemento) {
        elemento.textContent = valor;
    }
}


/* =========================================================
   PLANILHAS
========================================================= */

function mostrarPlanilhas() {

    document.getElementById(
        "areaConteudo"
    ).innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>Planilhas de funcionários</h2>

                <p>
                    Organização e exportação dos funcionários.
                </p>

            </div>

            <div class="card-corpo">

                <p style="
                    font-size:14px;
                    color:#555;
                ">
                    ${funcionarios.length}
                    funcionário(s) cadastrado(s).
                </p>

                <div class="botoes">

                    <button
                        class="btn btn-principal"
                        id="btnExportarPlanilha"
                    >
                        Exportar funcionários
                    </button>

                </div>

            </div>

        </div>

    `;


    document
        .getElementById("btnExportarPlanilha")
        .addEventListener(
            "click",
            exportarFuncionarios
        );
}


/* =========================================================
   EXPORTAR
========================================================= */

function exportarFuncionarios() {

    if (funcionarios.length === 0) {

        alert(
            "Não existem funcionários cadastrados."
        );

        return;
    }


    let csv =
        "Matrícula,Nome,CPF,Cargo,Salário,Data de admissão\n";


    funcionarios.forEach(funcionario => {

        csv += [

            funcionario.matricula,
            funcionario.nome,
            funcionario.cpf,
            funcionario.cargo,
            funcionario.salario,
            funcionario.admissao

        ]
        .map(
            valor =>
                `"${String(valor || "")
                    .replace(/"/g, '""')}"`
        )
        .join(",") + "\n";

    });


    const blob =
        new Blob(
            ["\ufeff" + csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "funcionarios_prancheta_rh.csv";


    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
}


/* =========================================================
   CONSIGNADO
========================================================= */

function mostrarConsignado() {

    document.getElementById(
        "areaConteudo"
    ).innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>Empréstimo consignado</h2>

                <p>
                    Cálculo de empréstimos consignados.
                </p>

            </div>

            <div class="card-corpo">

                <div class="form-grid">

                    <div class="form-grupo largo">

                        <label>Funcionário</label>

                        <select>

                            <option>
                                Selecione um funcionário
                            </option>

                            ${funcionarios.map(
                                f => `
                                    <option>
                                        ${escapar(f.matricula)}
                                        -
                                        ${escapar(f.nome)}
                                    </option>
                                `
                            ).join("")}

                        </select>

                    </div>

                </div>

            </div>

        </div>

    `;
}


/* =========================================================
   FOLHA
========================================================= */

function mostrarFolha() {

    document.getElementById(
        "areaConteudo"
    ).innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>Folha de pagamento</h2>

                <p>
                    Cálculo da folha de pagamento.
                </p>

            </div>

            <div class="card-corpo">

                <p style="
                    font-size:14px;
                    color:#555;
                ">
                    O módulo de folha será integrado
                    ao cadastro dos funcionários.
                </p>

            </div>

        </div>

    `;
}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        document
            .querySelectorAll(".menu-item[data-pagina]")
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    function() {

                        abrirPagina(
                            this.dataset.pagina
                        );

                    }
                );

            });


        document
            .getElementById("btnExportar")
            .addEventListener(
                "click",
                exportarFuncionarios
            );


        abrirPagina("ferias");

    }
);