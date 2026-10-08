/* =========================================================
   PRANCHETA RH
========================================================= */


/* =========================================================
   BANCO LOCAL DE FUNCIONÁRIOS
========================================================= */

let funcionarios = carregarFuncionarios();


function carregarFuncionarios() {

    try {

        const dados =
            localStorage.getItem("pranchetaFuncionarios");

        if (!dados) {
            return [];
        }

        const lista = JSON.parse(dados);

        if (!Array.isArray(lista)) {
            return [];
        }

        return lista;

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


function valorCampo(id) {

    const elemento =
        document.getElementById(id);

    if (!elemento) {
        return 0;
    }

    const valor =
        String(elemento.value)
            .replace(",", ".");

    return Number(valor) || 0;
}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function abrirPagina(nome, botao) {

    document
        .querySelectorAll(".menu-item")
        .forEach(item => {
            item.classList.remove("ativo");
        });


    if (botao) {
        botao.classList.add("ativo");
    }


    switch (nome) {

        case "ferias":

            titulo(
                "Férias",
                "Cálculo completo da remuneração de férias"
            );

            mostrarFerias();

            break;


        case "cadastrar":

            titulo(
                "Cadastrar funcionário",
                "Cadastro de funcionários"
            );

            mostrarCadastro();

            break;


        case "funcionarios":

            titulo(
                "Funcionários",
                "Funcionários cadastrados no sistema"
            );

            mostrarFuncionarios();

            break;


        case "planilhas":

            titulo(
                "Planilhas de funcionários",
                "Organização e exportação dos funcionários"
            );

            mostrarPlanilhas();

            break;


        case "consignado":

            titulo(
                "Empréstimo consignado",
                "Cálculo de empréstimos consignados"
            );

            mostrarConsignado();

            break;


        case "folha":

            titulo(
                "Folha de pagamento",
                "Cálculo da folha de pagamento"
            );

            mostrarFolha();

            break;

    }
}


function titulo(principal, secundario) {

    document.getElementById(
        "tituloPagina"
    ).textContent = principal;


    document.getElementById(
        "subtituloPagina"
    ).textContent = secundario;
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
                    Cadastre os dados necessários para
                    utilizar o funcionário nos cálculos.
                </p>

            </div>


            <div class="card-corpo">

                <div class="form-grid">


                    <div class="form-grupo largo">

                        <label>
                            Nome completo
                        </label>

                        <input
                            id="cadNome"
                            type="text"
                            placeholder="Nome do funcionário"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            CPF
                        </label>

                        <input
                            id="cadCPF"
                            type="text"
                            placeholder="000.000.000-00"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Matrícula
                        </label>

                        <input
                            id="cadMatricula"
                            type="text"
                            placeholder="Matrícula"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Cargo
                        </label>

                        <input
                            id="cadCargo"
                            type="text"
                            placeholder="Cargo"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Salário base atual
                        </label>

                        <input
                            id="cadSalario"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0,00"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Data de admissão
                        </label>

                        <input
                            id="cadAdmissao"
                            type="date"
                        >

                    </div>

                </div>


                <div class="botoes">

                    <button
                        class="btn btn-principal"
                        onclick="cadastrarFuncionario()"
                    >
                        Cadastrar funcionário
                    </button>

                    <button
                        class="btn btn-secundario"
                        onclick="mostrarCadastro()"
                    >
                        Limpar
                    </button>

                </div>

            </div>

        </div>

    `;
}


/* CADASTRAR */

function cadastrarFuncionario() {

    const nome =
        document
            .getElementById("cadNome")
            .value
            .trim();


    const cpf =
        document
            .getElementById("cadCPF")
            .value
            .trim();


    const matricula =
        document
            .getElementById("cadMatricula")
            .value
            .trim();


    const cargo =
        document
            .getElementById("cadCargo")
            .value
            .trim();


    const salario =
        Number(
            document
                .getElementById("cadSalario")
                .value
        ) || 0;


    const admissao =
        document
            .getElementById("cadAdmissao")
            .value;


    if (!nome) {

        alert(
            "Informe o nome do funcionário."
        );

        return;
    }


    if (!matricula) {

        alert(
            "Informe a matrícula."
        );

        return;
    }


    const matriculaExiste =
        funcionarios.some(
            funcionario =>
                String(funcionario.matricula)
                === String(matricula)
        );


    if (matriculaExiste) {

        alert(
            "Já existe um funcionário com essa matrícula."
        );

        return;
    }


    /*
        ID criado como STRING.

        Isso evita problemas de comparação
        entre número e texto ao selecionar
        o funcionário nas telas.
    */

    const funcionario = {

        id:
            "FUNC-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 8),

        nome: nome,

        cpf: cpf,

        matricula: matricula,

        cargo: cargo,

        salario: salario,

        admissao: admissao

    };


    funcionarios.push(funcionario);

    salvarFuncionarios();


    alert(
        "Funcionário cadastrado com sucesso."
    );


    /*
        Depois de cadastrar, mostramos
        imediatamente a lista.
    */

    mostrarFuncionarios();
}


/* =========================================================
   LISTA DE FUNCIONÁRIOS
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

        funcionarios.forEach(
            funcionario => {

                linhas += `

                    <tr>

                        <td>
                            ${escapar(
                                funcionario.matricula
                            )}
                        </td>

                        <td>
                            ${escapar(
                                funcionario.nome
                            )}
                        </td>

                        <td>
                            ${escapar(
                                funcionario.cargo || "-"
                            )}
                        </td>

                        <td>
                            ${moeda(
                                funcionario.salario
                            )}
                        </td>

                        <td>

                            <button
                                class="btn btn-principal"
                                style="
                                    height:34px;
                                    padding:0 12px;
                                "
                                onclick="
                                    abrirFeriasFuncionario(
                                        '${funcionario.id}'
                                    )
                                "
                            >
                                Calcular férias
                            </button>

                        </td>

                    </tr>

                `;
            }
        );

    }


    document.getElementById(
        "areaConteudo"
    ).innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Funcionários cadastrados
                </h2>

                <p>
                    Escolha um funcionário para
                    iniciar diretamente o cálculo.
                </p>

            </div>


            <div class="card-corpo tabela-container">

                <table>

                    <thead>

                        <tr>

                            <th>
                                Matrícula
                            </th>

                            <th>
                                Nome
                            </th>

                            <th>
                                Cargo
                            </th>

                            <th>
                                Salário
                            </th>

                            <th>
                                Ação
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${linhas}

                    </tbody>

                </table>

            </div>

        </div>

    `;
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


    funcionarios.forEach(
        funcionario => {

            const selecionado =
                String(funcionario.id)
                === String(funcionarioId)
                    ? "selected"
                    : "";


            opcoes += `

                <option
                    value="${funcionario.id}"
                    ${selecionado}
                >
                    ${escapar(
                        funcionario.matricula
                    )}
                    -
                    ${escapar(
                        funcionario.nome
                    )}
                </option>

            `;
        }
    );


    document.getElementById(
        "areaConteudo"
    ).innerHTML = `

        <!-- =========================================
             FUNCIONÁRIO E PERÍODO
        ========================================== -->

        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Funcionário e período
                </h2>

                <p>
                    Selecione o funcionário para
                    iniciar o cálculo das férias.
                </p>

            </div>


            <div class="card-corpo">

                <div class="form-grid">


                    <div class="form-grupo largo">

                        <label>
                            Funcionário
                        </label>

                        <select
                            id="feriasFuncionario"
                            onchange="selecionarFuncionarioFerias()"
                        >

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

                        <label>
                            Dias de direito
                        </label>

                        <input
                            id="diasDireito"
                            type="number"
                            value="30"
                            readonly
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Dias de férias
                        </label>

                        <input
                            id="diasFerias"
                            type="number"
                            min="0"
                            max="30"
                            value="30"
                            oninput="calcularBruto()"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Faltas injustificadas
                        </label>

                        <input
                            id="faltas"
                            type="number"
                            min="0"
                            value="0"
                            oninput="calcularDireito()"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Dias vendidos
                        </label>

                        <input
                            id="diasVendidos"
                            type="number"
                            min="0"
                            max="10"
                            value="0"
                            oninput="calcularBruto()"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Dependentes
                        </label>

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


        <!-- =========================================
             COMPONENTES DA REMUNERAÇÃO
        ========================================== -->

        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Componentes da remuneração
                </h2>

                <p>
                    Valores que serão considerados
                    na composição da remuneração
                    das férias.
                </p>

            </div>


            <div class="card-corpo">

                <div class="componentes-grid">


                    <div class="componente">

                        <label>
                            Salário base atual
                        </label>

                        <input
                            id="salarioBase"
                            type="number"
                            step="0.01"
                            min="0"
                            value="0"
                            oninput="calcularBruto()"
                        >

                        <small>
                            Salário contratual atual.
                        </small>

                    </div>


                    <div class="componente">

                        <label>
                            Média de horas extras
                        </label>

                        <input
                            id="mediaHE"
                            type="number"
                            step="0.01"
                            min="0"
                            value="0"
                            oninput="calcularBruto()"
                        >

                        <small>
                            Média remuneratória considerada.
                        </small>

                    </div>


                    <div class="componente">

                        <label>
                            Média de adicional noturno
                        </label>

                        <input
                            id="mediaNoturno"
                            type="number"
                            step="0.01"
                            min="0"
                            value="0"
                            oninput="calcularBruto()"
                        >

                        <small>
                            Média do adicional habitual.
                        </small>

                    </div>


                    <div class="componente">

                        <label>
                            Média de comissões e prêmios
                        </label>

                        <input
                            id="mediaComissoes"
                            type="number"
                            step="0.01"
                            min="0"
                            value="0"
                            oninput="calcularBruto()"
                        >

                        <small>
                            Médias habituais consideradas.
                        </small>

                    </div>


                    <div class="componente">

                        <label>
                            Média de DSR
                        </label>

                        <input
                            id="mediaDSR"
                            type="number"
                            step="0.01"
                            min="0"
                            value="0"
                            oninput="calcularBruto()"
                        >

                        <small>
                            Reflexos de DSR.
                        </small>

                    </div>


                    <div class="componente">

                        <label>
                            Adicional de periculosidade
                        </label>

                        <input
                            id="periculosidade"
                            type="number"
                            step="0.01"
                            min="0"
                            value="0"
                            oninput="calcularBruto()"
                        >

                        <small>
                            Valor mensal considerado.
                        </small>

                    </div>


                    <div class="componente">

                        <label>
                            Adicional de insalubridade
                        </label>

                        <input
                            id="insalubridade"
                            type="number"
                            step="0.01"
                            min="0"
                            value="0"
                            oninput="calcularBruto()"
                        >

                        <small>
                            Valor mensal considerado.
                        </small>

                    </div>

                </div>

            </div>

        </div>


        <!-- =========================================
             COMPOSIÇÃO DO BRUTO
        ========================================== -->

        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Composição das férias
                </h2>

                <p>
                    Memória do cálculo da remuneração bruta.
                </p>

            </div>


            <div class="card-corpo">

                <div class="valor-lista">


                    <div class="valor-linha">

                        <span>
                            Salário base proporcional
                        </span>

                        <span
                            class="valor"
                            id="rSalario"
                        >
                            R$ 0,00
                        </span>

                    </div>


                    <div class="valor-linha">

                        <span>
                            Média de horas extras
                        </span>

                        <span
                            class="valor"
                            id="rHE"
                        >
                            R$ 0,00
                        </span>

                    </div>


                    <div class="valor-linha">

                        <span>
                            Média de adicional noturno
                        </span>

                        <span
                            class="valor"
                            id="rNoturno"
                        >
                            R$ 0,00
                        </span>

                    </div>


                    <div class="valor-linha">

                        <span>
                            Média de comissões e prêmios
                        </span>

                        <span
                            class="valor"
                            id="rComissoes"
                        >
                            R$ 0,00
                        </span>

                    </div>


                    <div class="valor-linha">

                        <span>
                            Média de DSR
                        </span>

                        <span
                            class="valor"
                            id="rDSR"
                        >
                            R$ 0,00
                        </span>

                    </div>


                    <div class="valor-linha">

                        <span>
                            Periculosidade
                        </span>

                        <span
                            class="valor"
                            id="rPericulosidade"
                        >
                            R$ 0,00
                        </span>

                    </div>


                    <div class="valor-linha">

                        <span>
                            Insalubridade
                        </span>

                        <span
                            class="valor"
                            id="rInsalubridade"
                        >
                            R$ 0,00
                        </span>

                    </div>


                    <div class="valor-linha">

                        <span>
                            Remuneração considerada
                        </span>

                        <span
                            class="valor"
                            id="rRemuneracao"
                        >
                            R$ 0,00
                        </span>

                    </div>


                    <div class="valor-linha">

                        <span>
                            Valor dos dias de férias
                        </span>

                        <span
                            class="valor"
                            id="rFerias"
                        >
                            R$ 0,00
                        </span>

                    </div>


                    <div class="valor-linha">

                        <span>
                            1/3 constitucional
                        </span>

                        <span
                            class="valor"
                            id="rTerco"
                        >
                            R$ 0,00
                        </span>

                    </div>


                    <div class="valor-linha">

                        <span>
                            Abono pecuniário
                        </span>

                        <span
                            class="valor"
                            id="rAbono"
                        >
                            R$ 0,00
                        </span>

                    </div>


                    <div class="valor-linha">

                        <span>
                            1/3 sobre o abono
                        </span>

                        <span
                            class="valor"
                            id="rTercoAbono"
                        >
                            R$ 0,00
                        </span>

                    </div>

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
                        onclick="calcularBruto()"
                    >
                        Calcular bruto
                    </button>

                    <button
                        class="btn btn-secundario"
                        onclick="limparFerias()"
                    >
                        Limpar
                    </button>

                </div>

            </div>

        </div>


        <!-- =========================================
             DESCONTOS
        ========================================== -->

        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Descontos
                </h2>

                <p>
                    Valores que serão utilizados na
                    etapa de cálculo do líquido.
                </p>

            </div>


            <div class="card-corpo">

                <div class="componentes-grid">


                    <div class="componente">

                        <label>
                            INSS
                        </label>

                        <input
                            id="inss"
                            type="number"
                            step="0.01"
                            value="0"
                        >

                    </div>


                    <div class="componente">

                        <label>
                            IRRF
                        </label>

                        <input
                            id="irrf"
                            type="number"
                            step="0.01"
                            value="0"
                        >

                    </div>


                    <div class="componente">

                        <label>
                            Empréstimo consignado
                        </label>

                        <input
                            id="consignado"
                            type="number"
                            step="0.01"
                            value="0"
                        >

                    </div>


                    <div class="componente">

                        <label>
                            Pensão alimentícia
                        </label>

                        <input
                            id="pensao"
                            type="number"
                            step="0.01"
                            value="0"
                        >

                    </div>


                    <div class="componente">

                        <label>
                            Adiantamento
                        </label>

                        <input
                            id="adiantamento"
                            type="number"
                            step="0.01"
                            value="0"
                        >

                    </div>


                    <div class="componente">

                        <label>
                            Alimentação / refeição
                        </label>

                        <input
                            id="alimentacao"
                            type="number"
                            step="0.01"
                            value="0"
                        >

                    </div>


                    <div class="componente">

                        <label>
                            Vale-transporte
                        </label>

                        <input
                            id="valeTransporte"
                            type="number"
                            step="0.01"
                            value="0"
                        >

                    </div>


                    <div class="componente">

                        <label>
                            Plano de saúde
                        </label>

                        <input
                            id="planoSaude"
                            type="number"
                            step="0.01"
                            value="0"
                        >

                    </div>


                    <div class="componente">

                        <label>
                            Plano odontológico
                        </label>

                        <input
                            id="planoOdonto"
                            type="number"
                            step="0.01"
                            value="0"
                        >

                    </div>


                    <div class="componente">

                        <label>
                            Outros convênios autorizados
                        </label>

                        <input
                            id="outros"
                            type="number"
                            step="0.01"
                            value="0"
                        >

                    </div>

                </div>

            </div>

        </div>

    `;
    

    /*
        Se a tela foi aberta já com um funcionário,
        selecionamos ele depois que o HTML foi criado.
    */

    if (funcionarioId) {

        const select =
            document.getElementById(
                "feriasFuncionario"
            );

        select.value =
            funcionarioId;

        selecionarFuncionarioFerias();

    }

    else {

        calcularBruto();

    }

}


/* =========================================================
   ABRIR FÉRIAS DE UM FUNCIONÁRIO
========================================================= */

function abrirFeriasFuncionario(id) {

    titulo(
        "Férias",
        "Cálculo completo da remuneração de férias"
    );


    document
        .querySelectorAll(".menu-item")
        .forEach(item => {
            item.classList.remove("ativo");
        });


    const botoes =
        document.querySelectorAll(".menu-item");


    botoes.forEach(botao => {

        if (
            botao.textContent
                .trim()
                .toLowerCase()
                === "férias"
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


    const id =
        select.value;


    const funcionario =
        funcionarios.find(
            f =>
                String(f.id)
                === String(id)
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


    /*
        MOSTRA OS DADOS DO FUNCIONÁRIO
    */

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


    /*
        CARREGA O SALÁRIO DO CADASTRO
    */

    document.getElementById(
        "salarioBase"
    ).value =
        Number(funcionario.salario) || 0;


    /*
        CALCULA NOVAMENTE
    */

    calcularBruto();
}


/* =========================================================
   DIAS DE DIREITO
========================================================= */

function calcularDireito() {

    const faltas =
        valorCampo("faltas");


    let dias = 30;


    /*
        Regra geral de redução por faltas injustificadas.
    */

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


    const diasFerias =
        document.getElementById(
            "diasFerias"
        );


    if (
        Number(diasFerias.value)
        > dias
    ) {

        diasFerias.value = dias;

    }


    calcularBruto();
}


/* =========================================================
   CÁLCULO DO BRUTO
========================================================= */

function calcularBruto() {

    const salario =
        valorCampo("salarioBase");


    const he =
        valorCampo("mediaHE");


    const noturno =
        valorCampo("mediaNoturno");


    const comissoes =
        valorCampo("mediaComissoes");


    const dsr =
        valorCampo("mediaDSR");


    const periculosidade =
        valorCampo("periculosidade");


    const insalubridade =
        valorCampo("insalubridade");


    const diasFerias =
        valorCampo("diasFerias");


    const diasVendidos =
        valorCampo("diasVendidos");


    /*
        REMUNERAÇÃO MENSAL

        Soma dos componentes informados.
    */

    const remuneracao =
        salario +
        he +
        noturno +
        comissoes +
        dsr +
        periculosidade +
        insalubridade;


    /*
        VALOR DAS FÉRIAS

        Para uma remuneração mensal,
        usamos 1/30 por dia.
    */

    const valorFerias =
        (remuneracao / 30)
        * diasFerias;


    /*
        TERÇO CONSTITUCIONAL
    */

    const terco =
        valorFerias / 3;


    /*
        ABONO PECUNIÁRIO

        Até 10 dias.
    */

    const diasAbono =
        Math.min(
            Math.max(diasVendidos, 0),
            10
        );


    const abono =
        (remuneracao / 30)
        * diasAbono;


    /*
        1/3 DO ABONO
    */

    const tercoAbono =
        abono / 3;


    /*
        TOTAL BRUTO
    */

    const totalBruto =
        valorFerias +
        terco +
        abono +
        tercoAbono;


    /*
        MEMÓRIA DO CÁLCULO
    */

    atualizarTexto(
        "rSalario",
        moeda(
            (salario / 30)
            * diasFerias
        )
    );


    atualizarTexto(
        "rHE",
        moeda(
            (he / 30)
            * diasFerias
        )
    );


    atualizarTexto(
        "rNoturno",
        moeda(
            (noturno / 30)
            * diasFerias
        )
    );


    atualizarTexto(
        "rComissoes",
        moeda(
            (comissoes / 30)
            * diasFerias
        )
    );


    atualizarTexto(
        "rDSR",
        moeda(
            (dsr / 30)
            * diasFerias
        )
    );


    atualizarTexto(
        "rPericulosidade",
        moeda(
            (periculosidade / 30)
            * diasFerias
        )
    );


    atualizarTexto(
        "rInsalubridade",
        moeda(
            (insalubridade / 30)
            * diasFerias
        )
    );


    atualizarTexto(
        "rRemuneracao",
        moeda(remuneracao)
    );


    atualizarTexto(
        "rFerias",
        moeda(valorFerias)
    );


    atualizarTexto(
        "rTerco",
        moeda(terco)
    );


    atualizarTexto(
        "rAbono",
        moeda(abono)
    );


    atualizarTexto(
        "rTercoAbono",
        moeda(tercoAbono)
    );


    atualizarTexto(
        "totalBruto",
        moeda(totalBruto)
    );
}


function atualizarTexto(id, valor) {

    const elemento =
        document.getElementById(id);

    if (elemento) {
        elemento.textContent = valor;
    }
}


/* =========================================================
   LIMPAR FÉRIAS
========================================================= */

function limparFerias() {

    mostrarFerias();

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

                <h2>
                    Planilhas de funcionários
                </h2>

                <p>
                    Exportação dos funcionários cadastrados.
                </p>

            </div>


            <div class="card-corpo">

                <p style="
                    font-size:14px;
                    color:#555;
                ">

                    Os funcionários cadastrados
                    permanecem salvos neste navegador.

                </p>


                <div class="botoes">

                    <button
                        class="btn btn-principal"
                        onclick="exportarFuncionarios()"
                    >
                        Exportar funcionários
                    </button>

                </div>

            </div>

        </div>

    `;
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


    funcionarios.forEach(
        funcionario => {

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
                    `"${String(
                        valor || ""
                    ).replace(
                        /"/g,
                        '""'
                    )}"`
            )
            .join(",")
            + "\n";

        }
    );


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

    document.body.removeChild(link);


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

                <h2>
                    Empréstimo consignado
                </h2>

                <p>
                    Módulo de cálculo de empréstimos consignados.
                </p>

            </div>


            <div class="card-corpo">

                <div class="form-grid">

                    <div class="form-grupo largo">

                        <label>
                            Funcionário
                        </label>

                        <select>

                            <option>
                                Selecione um funcionário
                            </option>

                            ${funcionarios.map(
                                f => `
                                    <option>
                                        ${escapar(
                                            f.matricula
                                        )}
                                        -
                                        ${escapar(
                                            f.nome
                                        )}
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

                <h2>
                    Folha de pagamento
                </h2>

                <p>
                    Módulo de folha de pagamento.
                </p>

            </div>


            <div class="card-corpo">

                <p style="
                    font-size:14px;
                    color:#555;
                ">

                    O módulo será integrado
                    ao cadastro dos funcionários
                    e aos cálculos de folha.

                </p>

            </div>

        </div>

    `;
}


/* =========================================================
   SEGURANÇA BÁSICA PARA TEXTO DA TABELA
========================================================= */

function escapar(valor) {

    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        mostrarFerias();

    }
);