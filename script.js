/* =========================================================
   PRANCHETA RH
   ========================================================= */


/* =========================================================
   DADOS DOS FUNCIONÁRIOS
========================================================= */

let funcionarios =
    JSON.parse(localStorage.getItem("pranchetaFuncionarios")) || [];


/* =========================================================
   FUNÇÕES GERAIS
========================================================= */

function salvarFuncionarios() {

    localStorage.setItem(
        "pranchetaFuncionarios",
        JSON.stringify(funcionarios)
    );
}


function formatarMoeda(valor) {

    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


function numero(id) {

    const campo = document.getElementById(id);

    if (!campo) {
        return 0;
    }

    return Number(
        String(campo.value)
            .replace(",", ".")
    ) || 0;
}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function abrirPagina(nome, botao) {

    document.querySelectorAll(".menu-item")
        .forEach(item => item.classList.remove("ativo"));

    if (botao) {
        botao.classList.add("ativo");
    }


    if (nome === "ferias") {

        document.getElementById("tituloPagina").textContent =
            "Férias";

        document.getElementById("subtituloPagina").textContent =
            "Cálculo completo da remuneração de férias";

        mostrarFerias();

    }


    else if (nome === "cadastrar") {

        document.getElementById("tituloPagina").textContent =
            "Cadastrar funcionário";

        document.getElementById("subtituloPagina").textContent =
            "Cadastro de funcionários";

        mostrarCadastro();

    }


    else if (nome === "funcionarios") {

        document.getElementById("tituloPagina").textContent =
            "Funcionários";

        document.getElementById("subtituloPagina").textContent =
            "Funcionários cadastrados no sistema";

        mostrarFuncionarios();

    }


    else if (nome === "planilhas") {

        document.getElementById("tituloPagina").textContent =
            "Planilhas de funcionários";

        document.getElementById("subtituloPagina").textContent =
            "Gerenciamento das informações dos funcionários";

        mostrarPlanilhas();

    }


    else if (nome === "consignado") {

        document.getElementById("tituloPagina").textContent =
            "Empréstimo consignado";

        document.getElementById("subtituloPagina").textContent =
            "Cálculo e controle de empréstimos consignados";

        mostrarConsignado();

    }


    else if (nome === "folha") {

        document.getElementById("tituloPagina").textContent =
            "Folha de pagamento";

        document.getElementById("subtituloPagina").textContent =
            "Cálculo da folha de pagamento";

        mostrarFolha();

    }

}


/* =========================================================
   CADASTRO
========================================================= */

function mostrarCadastro() {

    document.getElementById("areaConteudo").innerHTML = `

        <div class="card">

            <div class="card-cabecalho">
                <h2>Novo funcionário</h2>
                <p>Cadastre as informações básicas do funcionário.</p>
            </div>

            <div class="card-corpo">

                <div class="form-grid">

                    <div class="form-grupo largo">
                        <label>Nome completo</label>
                        <input id="cadNome" type="text">
                    </div>

                    <div class="form-grupo">
                        <label>CPF</label>
                        <input id="cadCPF" type="text">
                    </div>

                    <div class="form-grupo">
                        <label>Matrícula</label>
                        <input id="cadMatricula" type="text">
                    </div>

                    <div class="form-grupo">
                        <label>Cargo</label>
                        <input id="cadCargo" type="text">
                    </div>

                    <div class="form-grupo">
                        <label>Salário base</label>
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
                        <input id="cadAdmissao" type="date">
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
                        onclick="limparCadastro()"
                    >
                        Limpar
                    </button>

                </div>

            </div>

        </div>

    `;
}


function cadastrarFuncionario() {

    const nome =
        document.getElementById("cadNome").value.trim();

    const cpf =
        document.getElementById("cadCPF").value.trim();

    const matricula =
        document.getElementById("cadMatricula").value.trim();

    const cargo =
        document.getElementById("cadCargo").value.trim();

    const salario =
        Number(document.getElementById("cadSalario").value) || 0;

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


    const existe =
        funcionarios.some(
            f => f.matricula === matricula
        );


    if (existe) {

        alert("Já existe um funcionário com essa matrícula.");
        return;

    }


    const funcionario = {

        id: Date.now(),

        nome: nome,

        cpf: cpf,

        matricula: matricula,

        cargo: cargo,

        salario: salario,

        admissao: admissao,

        horasExtras: 0,

        adicionalNoturno: 0,

        comissoes: 0,

        dsr: 0,

        periculosidade: 0,

        insalubridade: 0

    };


    funcionarios.push(funcionario);

    salvarFuncionarios();


    alert("Funcionário cadastrado com sucesso.");

    mostrarFuncionarios();

}


function limparCadastro() {

    mostrarCadastro();

}


/* =========================================================
   LISTA DE FUNCIONÁRIOS
========================================================= */

function mostrarFuncionarios() {

    let linhas = "";


    funcionarios.forEach(funcionario => {

        linhas += `

            <tr>

                <td>${funcionario.matricula}</td>

                <td>${funcionario.nome}</td>

                <td>${funcionario.cargo || "-"}</td>

                <td>${formatarMoeda(funcionario.salario)}</td>

            </tr>

        `;

    });


    if (funcionarios.length === 0) {

        linhas = `

            <tr>

                <td colspan="4">
                    Nenhum funcionário cadastrado.
                </td>

            </tr>

        `;

    }


    document.getElementById("areaConteudo").innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>Funcionários cadastrados</h2>

                <p>
                    Selecione um funcionário posteriormente
                    para utilizar nos cálculos.
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

function mostrarFerias() {

    let opcoesFuncionarios = `
        <option value="">Selecione um funcionário</option>
    `;


    funcionarios.forEach(funcionario => {

        opcoesFuncionarios += `

            <option value="${funcionario.id}">
                ${funcionario.matricula} - ${funcionario.nome}
            </option>

        `;

    });


    document.getElementById("areaConteudo").innerHTML = `

        <!-- FUNCIONÁRIO / PERÍODO -->

        <div class="card">

            <div class="card-cabecalho">

                <h2>Dados das férias</h2>

                <p>
                    Selecione o funcionário e informe o período.
                </p>

            </div>

            <div class="card-corpo">

                <div class="form-grid">

                    <div class="form-grupo largo">

                        <label>Funcionário</label>

                        <select
                            id="feriasFuncionario"
                            onchange="carregarFuncionarioFerias()"
                        >

                            ${opcoesFuncionarios}

                        </select>

                    </div>


                    <div class="form-grupo">

                        <label>Período aquisitivo inicial</label>

                        <input
                            id="inicioAquisitivo"
                            type="date"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Período aquisitivo final</label>

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
                            min="0"
                            max="30"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Dias de férias</label>

                        <input
                            id="diasFerias"
                            type="number"
                            value="30"
                            min="0"
                            max="30"
                            oninput="calcularBrutoFerias()"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Dias vendidos — Abono pecuniário</label>

                        <input
                            id="diasVendidos"
                            type="number"
                            value="0"
                            min="0"
                            max="10"
                            oninput="calcularBrutoFerias()"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Faltas injustificadas</label>

                        <input
                            id="faltas"
                            type="number"
                            value="0"
                            min="0"
                            oninput="atualizarDiasDireito()"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Dependentes</label>

                        <input
                            id="dependentes"
                            type="number"
                            value="0"
                            min="0"
                        >

                    </div>

                </div>

            </div>

        </div>


        <!-- PROVENTOS -->

        <div class="card">

            <div class="card-cabecalho">

                <h2>Proventos</h2>

                <p>
                    Valores que compõem a remuneração das férias.
                </p>

            </div>

            <div class="card-corpo">

                <div class="form-grid">


                    <div class="form-grupo">

                        <label>Salário base atual</label>

                        <input
                            id="salarioFerias"
                            type="number"
                            step="0.01"
                            min="0"
                            value="0"
                            oninput="calcularBrutoFerias()"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Média de horas extras</label>

                        <input
                            id="mediaHorasExtras"
                            type="number"
                            step="0.01"
                            min="0"
                            value="0"
                            oninput="calcularBrutoFerias()"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Média de adicional noturno</label>

                        <input
                            id="mediaNoturno"
                            type="number"
                            step="0.01"
                            min="0"
                            value="0"
                            oninput="calcularBrutoFerias()"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Média de comissões e prêmios</label>

                        <input
                            id="mediaComissoes"
                            type="number"
                            step="0.01"
                            min="0"
                            value="0"
                            oninput="calcularBrutoFerias()"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Média de DSR</label>

                        <input
                            id="mediaDSR"
                            type="number"
                            step="0.01"
                            min="0"
                            value="0"
                            oninput="calcularBrutoFerias()"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Adicional de periculosidade</label>

                        <input
                            id="periculosidade"
                            type="number"
                            step="0.01"
                            min="0"
                            value="0"
                            oninput="calcularBrutoFerias()"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Adicional de insalubridade</label>

                        <input
                            id="insalubridade"
                            type="number"
                            step="0.01"
                            min="0"
                            value="0"
                            oninput="calcularBrutoFerias()"
                        >

                    </div>

                </div>

            </div>

        </div>


        <!-- MEMÓRIA DO BRUTO -->

        <div class="card">

            <div class="card-cabecalho">

                <h2>Remuneração de férias</h2>

                <p>
                    Composição do valor bruto das férias.
                </p>

            </div>

            <div class="card-corpo">

                <div class="valor-lista">


                    <div class="valor-linha">

                        <span>Salário base</span>

                        <span
                            class="valor"
                            id="resultadoSalario"
                        >
                            R$ 0,00
                        </span>

                    </div>


                    <div class="valor-linha">

                        <span>Média de horas extras</span>

                        <span
                            class="valor"
                            id="resultadoHE"
                        >
                            R$ 0,00
                        </span>

                    </div>


                    <div class="valor-linha">

                        <span>Média de adicional noturno</span>

                        <span
                            class="valor"
                            id="resultadoNoturno"
                        >
                            R$ 0,00
                        </span>

                    </div>


                    <div class="valor-linha">

                        <span>Média de comissões e prêmios</span>

                        <span
                            class="valor"
                            id="resultadoComissoes"
                        >
                            R$ 0,00
                        </span>

                    </div>


                    <div class="valor-linha">

                        <span>Média de DSR</span>

                        <span
                            class="valor"
                            id="resultadoDSR"
                        >
                            R$ 0,00
                        </span>

                    </div>


                    <div class="valor-linha">

                        <span>Adicional de periculosidade</span>

                        <span
                            class="valor"
                            id="resultadoPericulosidade"
                        >
                            R$ 0,00
                        </span>

                    </div>


                    <div class="valor-linha">

                        <span>Adicional de insalubridade</span>

                        <span
                            class="valor"
                            id="resultadoInsalubridade"
                        >
                            R$ 0,00
                        </span>

                    </div>


                    <div class="valor-linha">

                        <span>Base das férias</span>

                        <span
                            class="valor"
                            id="resultadoBase"
                        >
                            R$ 0,00
                        </span>

                    </div>


                    <div class="valor-linha">

                        <span>1/3 constitucional</span>

                        <span
                            class="valor"
                            id="resultadoTerco"
                        >
                            R$ 0,00
                        </span>

                    </div>


                    <div class="valor-linha">

                        <span>Abono pecuniário</span>

                        <span
                            class="valor"
                            id="resultadoAbono"
                        >
                            R$ 0,00
                        </span>

                    </div>


                    <div class="valor-linha">

                        <span>1/3 sobre o abono</span>

                        <span
                            class="valor"
                            id="resultadoTercoAbono"
                        >
                            R$ 0,00
                        </span>

                    </div>

                </div>


                <div style="margin-top:20px;">

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

                </div>


                <div class="botoes">

                    <button
                        class="btn btn-principal"
                        onclick="calcularBrutoFerias()"
                    >
                        Calcular bruto
                    </button>

                    <button
                        class="btn btn-secundario"
                        onclick="limparCalculoFerias()"
                    >
                        Limpar cálculo
                    </button>

                </div>

            </div>

        </div>


        <!-- DESCONTOS -->

        <div class="card">

            <div class="card-cabecalho">

                <h2>Descontos</h2>

                <p>
                    Estrutura preparada para os descontos legais e autorizados.
                </p>

            </div>

            <div class="card-corpo">

                <div class="form-grid">


                    <div class="form-grupo">

                        <label>INSS</label>

                        <input
                            id="descontoINSS"
                            type="number"
                            step="0.01"
                            value="0"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>IRRF</label>

                        <input
                            id="descontoIRRF"
                            type="number"
                            step="0.01"
                            value="0"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Empréstimo consignado</label>

                        <input
                            id="descontoConsignado"
                            type="number"
                            step="0.01"
                            value="0"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Pensão alimentícia</label>

                        <input
                            id="descontoPensao"
                            type="number"
                            step="0.01"
                            value="0"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Adiantamento</label>

                        <input
                            id="descontoAdiantamento"
                            type="number"
                            step="0.01"
                            value="0"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Alimentação / refeição</label>

                        <input
                            id="descontoAlimentacao"
                            type="number"
                            step="0.01"
                            value="0"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Vale-transporte</label>

                        <input
                            id="descontoVT"
                            type="number"
                            step="0.01"
                            value="0"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Plano de saúde</label>

                        <input
                            id="descontoSaude"
                            type="number"
                            step="0.01"
                            value="0"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Plano odontológico</label>

                        <input
                            id="descontoOdonto"
                            type="number"
                            step="0.01"
                            value="0"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Outros convênios</label>

                        <input
                            id="descontoOutros"
                            type="number"
                            step="0.01"
                            value="0"
                        >

                    </div>

                </div>

            </div>

        </div>

    `;


    calcularBrutoFerias();

}


/* =========================================================
   CARREGAR FUNCIONÁRIO NAS FÉRIAS
========================================================= */

function carregarFuncionarioFerias() {

    const id =
        Number(
            document.getElementById("feriasFuncionario").value
        );


    const funcionario =
        funcionarios.find(f => f.id === id);


    if (!funcionario) {

        document.getElementById("salarioFerias").value = 0;

        calcularBrutoFerias();

        return;

    }


    document.getElementById("salarioFerias").value =
        funcionario.salario || 0;


    document.getElementById("mediaHorasExtras").value =
        funcionario.horasExtras || 0;


    document.getElementById("mediaNoturno").value =
        funcionario.adicionalNoturno || 0;


    document.getElementById("mediaComissoes").value =
        funcionario.comissoes || 0;


    document.getElementById("mediaDSR").value =
        funcionario.dsr || 0;


    document.getElementById("periculosidade").value =
        funcionario.periculosidade || 0;


    document.getElementById("insalubridade").value =
        funcionario.insalubridade || 0;


    calcularBrutoFerias();

}


/* =========================================================
   DIREITO DE FÉRIAS
========================================================= */

function atualizarDiasDireito() {

    const faltas =
        numero("faltas");


    let dias = 30;


    /*
        Regra geral da CLT:

        até 5 faltas       = 30 dias
        6 a 14             = 24 dias
        15 a 