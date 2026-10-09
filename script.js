/* =========================================================
   PRANCHETA RH
   Sistema de Recursos Humanos
========================================================= */


/* =========================================================
   BANCO LOCAL DE FUNCIONÁRIOS
========================================================= */

let funcionarios = carregarFuncionarios();
let consignados = carregarConsignados();


function carregarFuncionarios() {

    try {

        const dados =
            localStorage.getItem(
                "pranchetaFuncionarios"
            );

        if (!dados) {
            return [];
        }

        return JSON.parse(dados);

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


function carregarConsignados() {

    try {

        const dados =
            localStorage.getItem(
                "pranchetaConsignados"
            );

        if (!dados) {
            return [];
        }

        return JSON.parse(dados);

    } catch (erro) {

        console.error(
            "Erro ao carregar consignados:",
            erro
        );

        return [];

    }

}


function salvarConsignados() {

    localStorage.setItem(
        "pranchetaConsignados",
        JSON.stringify(consignados)
    );

}


/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

function moeda(valor) {

    valor = Number(valor) || 0;

    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


function numero(valor) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {
        return 0;
    }


    if (
        typeof valor === "number"
    ) {

        return Number.isFinite(valor)
            ? valor
            : 0;

    }


    let texto =
        String(valor)
            .trim()
            .replace(/\s/g, "");


    if (!texto) {
        return 0;
    }


    texto =
        texto.replace(
            /[^\d,.\-]/g,
            ""
        );


    if (!texto) {
        return 0;
    }


    const quantidadeVirgulas =
        (
            texto.match(/,/g) || []
        ).length;


    const quantidadePontos =
        (
            texto.match(/\./g) || []
        ).length;


    if (
        quantidadeVirgulas > 0 &&
        quantidadePontos > 0
    ) {

        const ultimaVirgula =
            texto.lastIndexOf(",");

        const ultimoPonto =
            texto.lastIndexOf(".");


        if (
            ultimaVirgula >
            ultimoPonto
        ) {

            texto =
                texto
                    .replace(/\./g, "")
                    .replace(",", ".");

        } else {

            texto =
                texto
                    .replace(/,/g, "");

        }

    }


    else if (
        quantidadeVirgulas > 1
    ) {

        const partes =
            texto.split(",");

        const decimal =
            partes.pop();

        texto =
            partes.join("") +
            "." +
            decimal;

    }


    else if (
        quantidadePontos > 1
    ) {

        const partes =
            texto.split(".");

        const decimal =
            partes.pop();

        texto =
            partes.join("") +
            "." +
            decimal;

    }


    else if (
        quantidadeVirgulas === 1
    ) {

        texto =
            texto.replace(",", ".");

    }


    const resultado =
        Number(texto);


    return Number.isFinite(resultado)
        ? resultado
        : 0;

}


function valorCampo(id) {

    const campo =
        document.getElementById(id);

    if (!campo) {
        return 0;
    }

    return numero(campo.value);

}


function atualizarTexto(id, valor) {

    const elemento =
        document.getElementById(id);

    if (elemento) {
        elemento.textContent = valor;
    }

}


function escapar(valor) {

    return String(
        valor ?? ""
    )
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


function dataAtual() {

    const hoje =
        new Date();

    const ano =
        hoje.getFullYear();

    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            hoje.getDate()
        ).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;

}


function formatarData(data) {

    if (!data) {
        return "";
    }

    const partes =
        String(data).split("-");

    if (partes.length === 3) {

        return `${partes[2]}/${partes[1]}/${partes[0]}`;

    }

    return data;

}


/* =========================================================
   CÁLCULO AUTOMÁTICO DO INSS
========================================================= */

/*
   Tabela definida para o sistema:

   Até R$ 1.621,00
   → 7,5%

   R$ 1.621,01 a R$ 2.902,84
   → 9%

   R$ 2.902,85 a R$ 4.354,27
   → 12%

   R$ 4.354,28 a R$ 8.475,55
   → 14%

   O cálculo é PROGRESSIVO.
*/

function calcularINSS(salario) {

    salario =
        Math.max(
            numero(salario),
            0
        );


    if (salario <= 0) {
        return 0;
    }


    let inss = 0;


    const faixa1 =
        Math.min(
            salario,
            1621.00
        );

    inss +=
        faixa1 * 0.075;


    if (
        salario > 1621.00
    ) {

        const faixa2 =
            Math.min(
                salario,
                2902.84
            ) - 1621.00;

        inss +=
            faixa2 * 0.09;

    }


    if (
        salario > 2902.84
    ) {

        const faixa3 =
            Math.min(
                salario,
                4354.27
            ) - 2902.84;

        inss +=
            faixa3 * 0.12;

    }


    if (
        salario > 4354.27
    ) {

        const faixa4 =
            Math.min(
                salario,
                8475.55
            ) - 4354.27;

        inss +=
            faixa4 * 0.14;

    }


    return Number(
        inss.toFixed(2)
    );

}


/* =========================================================
   CÁLCULO AUTOMÁTICO DO IRRF
========================================================= */

/*
   Tabela definida para o sistema:

   Até R$ 2.428,80
   → Isento

   R$ 2.428,81 a R$ 2.826,65
   → 7,5%
   → Parcela a deduzir: R$ 182,16

   R$ 2.826,66 a R$ 3.751,05
   → 15%
   → Parcela a deduzir: R$ 394,16

   R$ 3.751,06 a R$ 4.664,68
   → 22,5%
   → Parcela a deduzir: R$ 675,49

   Acima de R$ 4.664,68
   → 27,5%
   → Parcela a deduzir: R$ 908,73

   Base de cálculo:
   salário bruto - INSS
*/

function calcularIRRF(baseCalculo) {

    baseCalculo =
        Math.max(
            numero(baseCalculo),
            0
        );


    if (
        baseCalculo <= 2428.80
    ) {

        return 0;

    }


    let irrf = 0;


    if (
        baseCalculo <= 2826.65
    ) {

        irrf =
            (
                baseCalculo * 0.075
            ) - 182.16;

    }

    else if (
        baseCalculo <= 3751.05
    ) {

        irrf =
            (
                baseCalculo * 0.15
            ) - 394.16;

    }

    else if (
        baseCalculo <= 4664.68
    ) {

        irrf =
            (
                baseCalculo * 0.225
            ) - 675.49;

    }

    else {

        irrf =
            (
                baseCalculo * 0.275
            ) - 908.73;

    }


    return Math.max(
        Number(
            irrf.toFixed(2)
        ),
        0
    );

}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function abrirPagina(pagina, botao) {

    document
        .querySelectorAll(".menu-item")
        .forEach(
            item =>
                item.classList.remove("ativo")
        );


    if (botao) {
        botao.classList.add("ativo");
    }


    const titulo =
        document.getElementById(
            "tituloPagina"
        );

    const subtitulo =
        document.getElementById(
            "subtituloPagina"
        );


    switch (pagina) {

        case "ferias":

            titulo.textContent =
                "Férias";

            subtitulo.textContent =
                "Cálculo completo da remuneração de férias";

            mostrarFerias();

            break;


        case "consignado":

            titulo.textContent =
                "Empréstimo consignado";

            subtitulo.textContent =
                "Análise de margem consignável do funcionário";

            mostrarConsignado();

            break;


        case "folha":

            titulo.textContent =
                "Folha de pagamento";

            subtitulo.textContent =
                "Cálculo da folha de pagamento";

            mostrarFolha();

            break;


        case "cadastrar":

            titulo.textContent =
                "Cadastrar funcionário";

            subtitulo.textContent =
                "Cadastro individual e importação de funcionários";

            mostrarCadastrar();

            break;


        case "funcionarios":

            titulo.textContent =
                "Funcionários";

            subtitulo.textContent =
                "Funcionários cadastrados no sistema";

            mostrarFuncionarios();

            break;


        case "planilhas":

            titulo.textContent =
                "Planilhas de funcionários";

            subtitulo.textContent =
                "Importação em massa de funcionários";

            mostrarPlanilhas();

            break;


        case "planilhaConsignado":

            titulo.textContent =
                "Planilha consignado";

            subtitulo.textContent =
                "Cadastro e controle dos empréstimos consignados";

            mostrarPlanilhaConsignado();

            break;

    }

}


/* =========================================================
   CADASTRO DE FUNCIONÁRIO
========================================================= */

function mostrarCadastrar() {

    const area =
        document.getElementById(
            "areaConteudo"
        );


    area.innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Cadastro de funcionário
                </h2>

                <p>
                    Informe os dados do funcionário.
                </p>

            </div>


            <div class="card-corpo">

                <div class="form-grid">

                    <div class="form-grupo largo">

                        <label>
                            Nome completo
                        </label>

                        <input
                            type="text"
                            id="cadNome"
                            placeholder="Nome do funcionário"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Matrícula
                        </label>

                        <input
                            type="text"
                            id="cadMatricula"
                            placeholder="Matrícula"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            CPF
                        </label>

                        <input
                            type="text"
                            id="cadCPF"
                            placeholder="CPF"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Cargo
                        </label>

                        <input
                            type="text"
                            id="cadCargo"
                            placeholder="Cargo"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Salário
                        </label>

                        <input
                            type="number"
                            id="cadSalario"
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
                            type="date"
                            id="cadAdmissao"
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
                        onclick="limparCadastro()"
                    >
                        Limpar
                    </button>

                </div>


                <div
                    style="
                        margin-top:25px;
                        padding-top:20px;
                        border-top:1px solid #e5e6e8;
                    "
                >

                    <strong
                        style="
                            display:block;
                            margin-bottom:6px;
                            font-size:14px;
                        "
                    >
                        Importar planilha
                    </strong>

                    <span
                        style="
                            display:block;
                            margin-bottom:12px;
                            color:#777;
                            font-size:12px;
                        "
                    >
                        Importe vários funcionários de uma vez.
                        Formatos aceitos: .xls, .xlsx, .xlsm e .csv.
                    </span>


                    <input
                        type="file"
                        id="arquivoFuncionarios"
                        accept=".csv,.xls,.xlsx,.xlsm"
                        onchange="importarFuncionarios(this)"
                    >

                </div>


                <div
                    id="resultadoImportacaoFuncionarios"
                    style="margin-top:15px;"
                ></div>

            </div>

        </div>

    `;

}


function cadastrarFuncionario() {

    const nome =
        document
            .getElementById("cadNome")
            .value
            .trim();


    const matricula =
        document
            .getElementById("cadMatricula")
            .value
            .trim();


    const cpf =
        document
            .getElementById("cadCPF")
            .value
            .trim();


    const cargo =
        document
            .getElementById("cadCargo")
            .value
            .trim();


    const salario =
        valorCampo(
            "cadSalario"
        );


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


    if (
        funcionarios.some(
            f =>
                normalizarValor(
                    f.matricula
                ) ===
                normalizarValor(
                    matricula
                )
        )
    ) {

        alert(
            "Já existe um funcionário com essa matrícula."
        );

        return;

    }


    if (
        cpf &&
        funcionarios.some(
            f =>
                normalizarValor(
                    f.cpf
                ) ===
                normalizarValor(
                    cpf
                )
        )
    ) {

        alert(
            "Já existe um funcionário com esse CPF."
        );

        return;

    }


    funcionarios.push({

        id:
            Date.now(),

        nome,

        matricula,

        cpf,

        cargo,

        salario,

        admissao

    });


    salvarFuncionarios();


    alert(
        "Funcionário cadastrado com sucesso."
    );


    limparCadastro();

}


function limparCadastro() {

    const campos = [

        "cadNome",
        "cadMatricula",
        "cadCPF",
        "cadCargo",
        "cadSalario",
        "cadAdmissao"

    ];


    campos.forEach(
        id => {

            const campo =
                document.getElementById(id);

            if (campo) {
                campo.value = "";
            }

        }
    );

}


/* =========================================================
   FUNCIONÁRIOS
========================================================= */

function mostrarFuncionarios() {

    const area =
        document.getElementById(
            "areaConteudo"
        );


    if (!funcionarios.length) {

        area.innerHTML = `

            <div class="card">

                <div class="card-corpo">

                    Nenhum funcionário cadastrado.

                </div>

            </div>

        `;

        return;

    }


    let linhas = "";


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
                            funcionario.cpf
                        )}
                    </td>

                    <td>
                        ${escapar(
                            funcionario.cargo
                        )}
                    </td>

                    <td>
                        ${moeda(
                            funcionario.salario
                        )}
                    </td>

                    <td>
                        ${formatarData(
                            funcionario.admissao
                        )}
                    </td>

                    <td>

                        <button
                            class="btn btn-secundario"
                            style="height:32px;padding:0 10px;"
                            onclick="excluirFuncionario(${funcionario.id})"
                        >
                            Excluir
                        </button>

                    </td>

                </tr>

            `;

        }
    );


    area.innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Funcionários cadastrados
                </h2>

                <p>
                    Total: ${funcionarios.length}
                </p>

            </div>


            <div class="card-corpo">

                <div class="tabela-container">

                    <table>

                        <thead>

                            <tr>

                                <th>Matrícula</th>
                                <th>Nome</th>
                                <th>CPF</th>
                                <th>Cargo</th>
                                <th>Salário</th>
                                <th>Admissão</th>
                                <th>Ação</th>

                            </tr>

                        </thead>

                        <tbody>

                            ${linhas}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    `;

}


function excluirFuncionario(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir este funcionário?"
        );


    if (!confirmar) {
        return;
    }


    funcionarios =
        funcionarios.filter(
            funcionario =>
                funcionario.id !== id
        );


    salvarFuncionarios();

    mostrarFuncionarios();

}


/* =========================================================
   PLANILHAS DE FUNCIONÁRIOS
========================================================= */

function mostrarPlanilhas() {

    const area =
        document.getElementById(
            "areaConteudo"
        );


    area.innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Importar planilha de funcionários
                </h2>

                <p>
                    O sistema identifica as colunas automaticamente.
                </p>

            </div>


            <div class="card-corpo">

                <p
                    style="
                        font-size:13px;
                        color:#555;
                        line-height:1.6;
                    "
                >
                    A primeira aba da planilha será utilizada.
                    Os campos reconhecidos são Nome, Matrícula,
                    CPF, Cargo, Salário e Data de admissão.
                </p>


                <div
                    style="
                        margin-top:20px;
                    "
                >

                    <input
                        type="file"
                        id="arquivoPlanilhaFuncionarios"
                        accept=".csv,.xls,.xlsx,.xlsm"
                        onchange="importarFuncionarios(this)"
                    >

                </div>


                <div
                    id="resultadoImportacaoFuncionarios"
                    style="margin-top:15px;"
                ></div>

            </div>

        </div>

    `;

}


/* =========================================================
   FÉRIAS
========================================================= */

function mostrarFerias() {

    const area =
        document.getElementById(
            "areaConteudo"
        );


    let opcoes =
        `<option value="">Selecione o funcionário</option>`;


    funcionarios.forEach(
        funcionario => {

            opcoes += `

                <option
                    value="${funcionario.id}"
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


    area.innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Funcionário
                </h2>

                <p>
                    Selecione o funcionário para realizar o cálculo.
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
                            onchange="abrirFeriasFuncionario()"
                        >

                            ${opcoes}

                        </select>

                    </div>

                </div>


                <div
                    id="funcionarioFeriasSelecionado"
                    class="funcionario-selecionado"
                ></div>

            </div>

        </div>


        <div
            id="areaCalculoFerias"
        ></div>

    `;

}


function abrirFeriasFuncionario() {

    const id =
        document.getElementById(
            "feriasFuncionario"
        ).value;


    const funcionario =
        funcionarios.find(
            item =>
                String(item.id) ===
                String(id)
        );


    const selecionado =
        document.getElementById(
            "funcionarioFeriasSelecionado"
        );


    const area =
        document.getElementById(
            "areaCalculoFerias"
        );


    if (!funcionario) {

        selecionado.classList.remove(
            "mostrar"
        );

        area.innerHTML = "";

        return;

    }


    selecionado.classList.add(
        "mostrar"
    );


    selecionado.innerHTML = `

        <strong>
            Funcionário selecionado
        </strong>

        <div class="funcionario-info">

            <span>
                <strong>Matrícula:</strong>
                ${escapar(
                    funcionario.matricula
                )}
            </span>

            <span>
                <strong>Nome:</strong>
                ${escapar(
                    funcionario.nome
                )}
            </span>

            <span>
                <strong>Cargo:</strong>
                ${escapar(
                    funcionario.cargo
                )}
            </span>

        </div>

    `;


    const salario =
        numero(
            funcionario.salario
        );


    area.innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Cálculo de férias
                </h2>

                <p>
                    Valores calculados com base no salário informado.
                </p>

            </div>


            <div class="card-corpo">

                <div class="componentes-grid">

                    <div class="componente">

                        <label>
                            Salário base
                        </label>

                        <input
                            type="number"
                            id="feriasSalario"
                            value="${salario.toFixed(2)}"
                            step="0.01"
                            oninput="calcularFerias()"
                        >

                    </div>


                    <div class="componente">

                        <label>
                            Dias de férias
                        </label>

                        <input
                            type="number"
                            id="feriasDias"
                            value="30"
                            min="1"
                            max="30"
                            oninput="calcularFerias()"
                        >

                    </div>


                    <div class="componente">

                        <label>
                            Adicional 1/3
                        </label>

                        <input
                            type="number"
                            id="feriasTerco"
                            value="1"
                            min="0"
                            max="1"
                            step="1"
                            oninput="calcularFerias()"
                        >

                        <small>
                            1 = aplica o adicional de 1/3.
                        </small>

                    </div>

                </div>


                <div
                    id="resultadoFerias"
                    style="margin-top:20px;"
                ></div>

            </div>

        </div>

    `;


    calcularFerias();

}


function calcularFerias() {

    const salario =
        valorCampo(
            "feriasSalario"
        );


    const dias =
        valorCampo(
            "feriasDias"
        );


    const aplicarTerco =
        valorCampo(
            "feriasTerco"
        );


    const valorDias =
        salario *
        (
            dias / 30
        );


    const terco =
        aplicarTerco
            ? valorDias / 3
            : 0;


    const bruto =
        valorDias +
        terco;


    const resultado =
        document.getElementById(
            "resultadoFerias"
        );


    if (!resultado) {
        return;
    }


    resultado.innerHTML = `

        <div class="valor-lista">

            <div class="valor-linha">

                <span>
                    Salário proporcional
                </span>

                <span class="valor">
                    ${moeda(valorDias)}
                </span>

            </div>


            <div class="valor-linha">

                <span>
                    Adicional de 1/3
                </span>

                <span class="valor">
                    ${moeda(terco)}
                </span>

            </div>

        </div>


        <div class="total-bruto">

            <div class="descricao">
                Total bruto de férias
            </div>

            <div class="numero">
                ${moeda(bruto)}
            </div>

        </div>

    `;

}


/* =========================================================
   EMPRÉSTIMO CONSIGNADO
========================================================= */

function mostrarConsignado() {

    const area =
        document.getElementById(
            "areaConteudo"
        );


    let opcoes =
        `<option value="">Selecione o funcionário</option>`;


    funcionarios.forEach(
        funcionario => {

            opcoes += `

                <option
                    value="${funcionario.id}"
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


    area.innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Análise de margem consignável
                </h2>

                <p>
                    INSS e IRRF são calculados automaticamente a partir do salário cadastrado.
                </p>

            </div>


            <div class="card-corpo">

                <div class="form-grid">

                    <div class="form-grupo largo">

                        <label>
                            Funcionário
                        </label>

                        <select
                            id="consignadoFuncionario"
                            onchange="abrirConsignadoFuncionario()"
                        >

                            ${opcoes}

                        </select>

                    </div>

                </div>


                <div
                    id="areaConsignado"
                    style="margin-top:20px;"
                ></div>

            </div>

        </div>

    `;

}


function abrirConsignadoFuncionario() {

    const id =
        document.getElementById(
            "consignadoFuncionario"
        ).value;


    const funcionario =
        funcionarios.find(
            item =>
                String(item.id) ===
                String(id)
        );


    const area =
        document.getElementById(
            "areaConsignado"
        );


    if (!funcionario) {

        area.innerHTML = "";

        return;

    }


    const salario =
        numero(
            funcionario.salario
        );


    const inss =
        calcularINSS(
            salario
        );


    const baseIRRF =
        Math.max(
            salario -
            inss,
            0
        );


    const irrf =
        calcularIRRF(
            baseIRRF
        );


    area.innerHTML = `

        <div class="componentes-grid">

            <div class="componente">

                <label>
                    Salário bruto
                </label>

                <input
                    type="number"
                    id="consBruto"
                    value="${salario.toFixed(2)}"
                    step="0.01"
                    readonly
                >

                <small>
                    Salário cadastrado para o funcionário.
                </small>

            </div>


            <div class="componente">

                <label>
                    INSS calculado
                </label>

                <input
                    type="text"
                    id="consINSS"
                    value="${inss.toFixed(2)}"
                    readonly
                >

                <small>
                    Calculado automaticamente pela tabela do sistema.
                </small>

            </div>


            <div class="componente">

                <label>
                    IRRF
                </label>

                <input
                    type="text"
                    id="consIRRF"
                    value="${irrf.toFixed(2)}"
                    readonly
                >

                <small>
                    Calculado automaticamente sobre a base após o INSS.
                </small>

            </div>


            <div class="componente">

                <label>
                    Margem (%)
                </label>

                <input
                    type="number"
                    id="consPercentual"
                    value="35"
                    min="0"
                    step="0.01"
                    oninput="calcularMargemConsignado()"
                >

            </div>


            <div class="componente">

                <label>
                    Parcelas ativas
                </label>

                <input
                    type="number"
                    id="consParcelasAtivas"
                    value="0"
                    min="0"
                    step="0.01"
                    oninput="calcularMargemConsignado()"
                >

            </div>


            <div class="componente">

                <label>
                    Nova parcela
                </label>

                <input
                    type="number"
                    id="consNovaParcela"
                    value="0"
                    min="0"
                    step="0.01"
                    oninput="calcularMargemConsignado()"
                >

            </div>

        </div>


        <div
            id="resultadoMargemConsignado"
            class="status-consignado status-info"
        ></div>

    `;


    calcularMargemConsignado();

}


function calcularMargemConsignado() {

    const bruto =
        valorCampo(
            "consBruto"
        );


    const inss =
        calcularINSS(
            bruto
        );


    const campoINSS =
        document.getElementById(
            "consINSS"
        );


    if (campoINSS) {

        campoINSS.value =
            inss.toFixed(2);

    }


    const baseIRRF =
        Math.max(
            bruto -
            inss,
            0
        );


    const irrf =
        calcularIRRF(
            baseIRRF
        );


    const campoIRRF =
        document.getElementById(
            "consIRRF"
        );


    if (campoIRRF) {

        campoIRRF.value =
            irrf.toFixed(2);

    }


    const percentual =
        valorCampo(
            "consPercentual"
        );


    const parcelasAtivas =
        valorCampo(
            "consParcelasAtivas"
        );


    const novaParcela =
        valorCampo(
            "consNovaParcela"
        );


    const liquido =
        Math.max(
            bruto -
            inss -
            irrf,
            0
        );


    const margemMaxima =
        liquido *
        (
            percentual / 100
        );


    const margemDisponivel =
        Math.max(
            margemMaxima -
            parcelasAtivas,
            0
        );


    const totalComNova =
        parcelasAtivas +
        novaParcela;


    const regular =
        totalComNova <=
        margemMaxima;


    const resultado =
        document.getElementById(
            "resultadoMargemConsignado"
        );


    if (!resultado) {
        return;
    }


    resultado.className =
        regular
            ? "status-consignado status-regular"
            : "status-consignado status-alerta";


    resultado.innerHTML = `

        <strong>

            ${
                regular
                    ? "MARGEM DENTRO DO LIMITE"
                    : "MARGEM EXCEDIDA"
            }

        </strong>


        <div
            style="
                margin-top:8px;
                line-height:1.7;
            "
        >

            Salário bruto:

            <strong>
                ${moeda(bruto)}
            </strong>

            <br>

            INSS:

            <strong>
                ${moeda(inss)}
            </strong>

            <br>

            Base de cálculo IRRF:

            <strong>
                ${moeda(baseIRRF)}
            </strong>

            <br>

            IRRF:

            <strong>
                ${moeda(irrf)}
            </strong>

            <br>

            Salário líquido de base:

            <strong>
                ${moeda(liquido)}
            </strong>

            <br>

            Margem máxima:

            <strong>
                ${moeda(margemMaxima)}
            </strong>

            <br>

            Parcelas ativas:

            <strong>
                ${moeda(parcelasAtivas)}
            </strong>

            <br>

            Margem disponível:

            <strong>
                ${moeda(margemDisponivel)}
            </strong>

            <br>

            Nova parcela:

            <strong>
                ${moeda(novaParcela)}
            </strong>

            <br>

            Total de parcelas:

            <strong>
                ${moeda(totalComNova)}
            </strong>

        </div>

    `;

}


/* =========================================================
   PLANILHA CONSIGNADO
========================================================= */

function mostrarPlanilhaConsignado() {

    const area =
        document.getElementById(
            "areaConteudo"
        );


    area.innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Novo contrato consignado
                </h2>

                <p>
                    Cadastre o contrato do funcionário.
                </p>

            </div>


            <div class="card-corpo">

                <div class="form-grid">

                    <div class="form-grupo largo">

                        <label>
                            Funcionário
                        </label>

                        <select
                            id="planConsFuncionario"
                            onchange="preencherConsignadoFuncionario()"
                        >

                            <option value="">
                                Selecione o funcionário
                            </option>

                            ${
                                funcionarios.map(
                                    f => `
                                        <option value="${f.id}">
                                            ${escapar(f.matricula)}
                                            -
                                            ${escapar(f.nome)}
                                        </option>
                                    `
                                ).join("")
                            }

                        </select>

                    </div>


                    <div class="form-grupo">

                        <label>
                            Instituição
                        </label>

                        <input
                            type="text"
                            id="planConsInstituicao"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Nº do contrato
                        </label>

                        <input
                            type="text"
                            id="planConsContrato"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Salário bruto
                        </label>

                        <input
                            type="number"
                            id="planConsBruto"
                            step="0.01"
                            readonly
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            INSS calculado
                        </label>

                        <input
                            type="text"
                            id="planConsINSS"
                            readonly
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            IRRF calculado
                        </label>

                        <input
                            type="text"
                            id="planConsIRRF"
                            value="0.00"
                            readonly
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Margem (%)
                        </label>

                        <input
                            type="number"
                            id="planConsPercentual"
                            value="35"
                            step="0.01"
                            oninput="calcularMargemPlanilha()"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Parcela mensal
                        </label>

                        <input
                            type="number"
                            id="planConsParcela"
                            value="0"
                            step="0.01"
                            oninput="calcularMargemPlanilha()"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Saldo devedor
                        </label>

                        <input
                            type="number"
                            id="planConsSaldo"
                            value="0"
                            step="0.01"
                        >

                    </div>

                </div>


                <div
                    id="resultadoMargemPlanilha"
                    class="status-consignado status-info"
                >
                </div>


                <div class="botoes">

                    <button
                        class="btn btn-principal"
                        onclick="salvarConsignado()"
                    >
                        Salvar contrato
                    </button>

                    <button
                        class="btn btn-secundario"
                        onclick="limparConsignado()"
                    >
                        Limpar
                    </button>

                    <button
                        class="btn btn-secundario"
                        onclick="exportarConsignados()"
                    >
                        Exportar planilha
                    </button>

                </div>


                <div
                    style="
                        margin-top:25px;
                        padding-top:20px;
                        border-top:1px solid #e5e6e8;
                    "
                >

                    <strong
                        style="
                            display:block;
                            margin-bottom:6px;
                        "
                    >
                        Importar consignados
                    </strong>

                    <span
                        style="
                            display:block;
                            margin-bottom:12px;
                            color:#777;
                            font-size:12px;
                        "
                    >
                        Formatos aceitos:
                        .xls, .xlsx, .xlsm e .csv.
                        O IRRF será recalculado automaticamente.
                    </span>


                    <input
                        type="file"
                        id="arquivoConsignado"
                        accept=".csv,.xls,.xlsx,.xlsm"
                        onchange="importarConsignado(this)"
                    >

                </div>


                <div
                    id="resultadoImportacaoConsignado"
                    style="margin-top:15px;"
                ></div>

            </div>

        </div>


        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Contratos cadastrados
                </h2>

            </div>


            <div class="card-corpo">

                <div class="tabela-container">

                    <table>

                        <thead>

                            <tr>

                                <th>Matrícula</th>
                                <th>Funcionário</th>
                                <th>Instituição</th>
                                <th>Contrato</th>
                                <th>Parcela</th>
                                <th>Saldo</th>
                                <th>Status</th>
                                <th>Ação</th>

                            </tr>

                        </thead>

                        <tbody id="tabelaConsignados">

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    `;


    preencherTabelaConsignados();

}


function preencherConsignadoFuncionario() {

    const id =
        document.getElementById(
            "planConsFuncionario"
        ).value;


    const funcionario =
        funcionarios.find(
            f =>
                String(f.id) ===
                String(id)
        );


    const bruto =
        funcionario
            ? numero(funcionario.salario)
            : 0;


    const campoBruto =
        document.getElementById(
            "planConsBruto"
        );


    if (campoBruto) {

        campoBruto.value =
            bruto.toFixed(2);

    }


    const inss =
        calcularINSS(
            bruto
        );


    const campoINSS =
        document.getElementById(
            "planConsINSS"
        );


    if (campoINSS) {

        campoINSS.value =
            inss.toFixed(2);

    }


    calcularMargemPlanilha();

}


function calcularMargemPlanilha() {

    const bruto =
        valorCampo(
            "planConsBruto"
        );


    const inss =
        calcularINSS(
            bruto
        );


    const campoINSS =
        document.getElementById(
            "planConsINSS"
        );


    if (campoINSS) {

        campoINSS.value =
            inss.toFixed(2);

    }


    const baseIRRF =
        Math.max(
            bruto -
            inss,
            0
        );


    const irrf =
        calcularIRRF(
            baseIRRF
        );


    const campoIRRF =
        document.getElementById(
            "planConsIRRF"
        );


    if (campoIRRF) {

        campoIRRF.value =
            irrf.toFixed(2);

    }


    const percentual =
        valorCampo(
            "planConsPercentual"
        );


    const parcela =
        valorCampo(
            "planConsParcela"
        );


    const liquido =
        Math.max(
            bruto -
            inss -
            irrf,
            0
        );


    const margemMaxima =
        liquido *
        (
            percentual / 100
        );


    const disponivel =
        Math.max(
            margemMaxima -
            parcela,
            0
        );


    const regular =
        parcela <=
        margemMaxima;


    const resultado =
        document.getElementById(
            "resultadoMargemPlanilha"
        );


    if (!resultado) {
        return;
    }


    resultado.className =
        regular
            ? "status-consignado status-regular"
            : "status-consignado status-alerta";


    resultado.innerHTML = `

        <strong>

            ${
                regular
                    ? "CONTRATO DENTRO DA MARGEM"
                    : "CONTRATO ACIMA DA MARGEM"
            }

        </strong>


        <div
            style="
                margin-top:8px;
                line-height:1.7;
            "
        >

            Salário bruto:
            <strong>
                ${moeda(bruto)}
            </strong>

            <br>

            INSS:
            <strong>
                ${moeda(inss)}
            </strong>

            <br>

            Base de cálculo IRRF:
            <strong>
                ${moeda(baseIRRF)}
            </strong>

            <br>

            IRRF:
            <strong>
                ${moeda(irrf)}
            </strong>

            <br>

            Salário líquido de base:
            <strong>
                ${moeda(liquido)}
            </strong>

            <br>

            Margem máxima:
            <strong>
                ${moeda(margemMaxima)}
            </strong>

            <br>

            Parcela:
            <strong>
                ${moeda(parcela)}
            </strong>

            <br>

            Margem após parcela:
            <strong>
                ${moeda(disponivel)}
            </strong>

        </div>

    `;

}


function salvarConsignado() {

    const funcionarioId =
        document.getElementById(
            "planConsFuncionario"
        ).value;


    const funcionario =
        funcionarios.find(
            f =>
                String(f.id) ===
                String(funcionarioId)
        );


    if (!funcionario) {

        alert(
            "Selecione um funcionário."
        );

        return;

    }


    const instituicao =
        document.getElementById(
            "planConsInstituicao"
        ).value.trim();


    const contrato =
        document.getElementById(
            "planConsContrato"
        ).value.trim();


    if (!instituicao) {

        alert(
            "Informe a instituição."
        );

        return;

    }


    if (!contrato) {

        alert(
            "Informe o número do contrato."
        );

        return;

    }


    const bruto =
        numero(
            funcionario.salario
        );


    const inss =
        calcularINSS(
            bruto
        );


    const baseIRRF =
        Math.max(
            bruto -
            inss,
            0
        );


    const irrf =
        calcularIRRF(
            baseIRRF
        );


    const percentual =
        valorCampo(
            "planConsPercentual"
        );


    const parcela =
        valorCampo(
            "planConsParcela"
        );


    const saldo =
        valorCampo(
            "planConsSaldo"
        );


    const liquido =
        Math.max(
            bruto -
            inss -
            irrf,
            0
        );


    const margem =
        liquido *
        (
            percentual / 100
        );


    const duplicado =
        consignados.some(
            c =>

                normalizarValor(
                    c.matricula
                ) ===
                normalizarValor(
                    funcionario.matricula
                )

                &&

                normalizarValor(
                    c.contrato
                ) ===
                normalizarValor(
                    contrato
                )

                &&

                normalizarValor(
                    c.instituicao
                ) ===
                normalizarValor(
                    instituicao
                )
        );


    if (duplicado) {

        alert(
            "Esse contrato já está cadastrado."
        );

        return;

    }


    consignados.push({

        id:
            Date.now(),

        funcionarioId:
            funcionario.id,

        matricula:
            funcionario.matricula,

        nome:
            funcionario.nome,

        instituicao,

        contrato,

        salarioBruto:
            bruto,

        inss,

        irrf,

        salarioLiquidoBase:
            liquido,

        percentualMargem:
            percentual,

        margemMaxima:
            margem,

        parcela,

        saldoDevedor:
            saldo,

        dataCadastro:
            dataAtual()

    });


    salvarConsignados();


    alert(
        "Contrato consignado salvo com sucesso."
    );


    mostrarPlanilhaConsignado();

}


function limparConsignado() {

    const campos = [

        "planConsFuncionario",
        "planConsInstituicao",
        "planConsContrato",
        "planConsBruto",
        "planConsINSS",
        "planConsIRRF",
        "planConsPercentual",
        "planConsParcela",
        "planConsSaldo"

    ];


    campos.forEach(
        id => {

            const campo =
                document.getElementById(id);

            if (!campo) {
                return;
            }


            campo.value = "";

        }
    );


    const percentual =
        document.getElementById(
            "planConsPercentual"
        );


    if (percentual) {
        percentual.value = "35";
    }


    calcularMargemPlanilha();

}


function preencherTabelaConsignados() {

    const tabela =
        document.getElementById(
            "tabelaConsignados"
        );


    if (!tabela) {
        return;
    }


    if (!consignados.length) {

        tabela.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="
                        text-align:center;
                        color:#777;
                    "
                >
                    Nenhum contrato cadastrado.
                </td>

            </tr>

        `;

        return;

    }


    tabela.innerHTML =
        consignados
            .map(
                contrato => {

                    const margem =
                        numero(
                            contrato.margemMaxima
                        );


                    const parcela =
                        numero(
                            contrato.parcela
                        );


                    const regular =
                        parcela <= margem;


                    return `

                        <tr
                            class="${
                                regular
                                    ? ""
                                    : "linha-alerta"
                            }"
                        >

                            <td>
                                ${escapar(
                                    contrato.matricula
                                )}
                            </td>

                            <td>
                                ${escapar(
                                    contrato.nome
                                )}
                            </td>

                            <td>
                                ${escapar(
                                    contrato.instituicao
                                )}
                            </td>

                            <td>
                                ${escapar(
                                    contrato.contrato
                                )}
                            </td>

                            <td>
                                ${moeda(
                                    parcela
                                )}
                            </td>

                            <td>
                                ${moeda(
                                    contrato.saldoDevedor
                                )}
                            </td>

                            <td>

                                <span
                                    class="status-mini ${
                                        regular
                                            ? "regular"
                                            : "alerta"
                                    }"
                                >

                                    ${
                                        regular
                                            ? "Regular"
                                            : "Acima da margem"
                                    }

                                </span>

                            </td>

                            <td>

                                <button
                                    class="btn btn-secundario"
                                    style="
                                        height:32px;
                                        padding:0 10px;
                                    "
                                    onclick="excluirConsignado(${contrato.id})"
                                >
                                    Excluir
                                </button>

                            </td>

                        </tr>

                    `;

                }
            )
            .join("");

}


function excluirConsignado(id) {

    if (
        !confirm(
            "Deseja realmente excluir este contrato?"
        )
    ) {

        return;

    }


    consignados =
        consignados.filter(
            c =>
                c.id !== id
        );


    salvarConsignados();

    preencherTabelaConsignados();

}


/* =========================================================
   FOLHA DE PAGAMENTO
========================================================= */

function mostrarFolha() {

    const area =
        document.getElementById(
            "areaConteudo"
        );


    let opcoes =
        `<option value="">Selecione o funcionário</option>`;


    funcionarios.forEach(
        f => {

            opcoes += `

                <option value="${f.id}">
                    ${escapar(f.matricula)}
                    -
                    ${escapar(f.nome)}
                </option>

            `;

        }
    );


    area.innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Folha de pagamento
                </h2>

                <p>
                    Cálculo da remuneração do funcionário.
                </p>

            </div>


            <div class="card-corpo">

                <div class="form-grid">

                    <div class="form-grupo largo">

                        <label>
                            Funcionário
                        </label>

                        <select
                            id="folhaFuncionario"
                            onchange="calcularFolha()"
                        >

                            ${opcoes}

                        </select>

                    </div>


                    <div class="form-grupo">

                        <label>
                            Adicionais
                        </label>

                        <input
                            type="number"
                            id="folhaAdicionais"
                            value="0"
                            step="0.01"
                            oninput="calcularFolha()"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Descontos adicionais
                        </label>

                        <input
                            type="number"
                            id="folhaDescontos"
                            value="0"
                            step="0.01"
                            oninput="calcularFolha()"
                        >

                    </div>

                </div>


                <div
                    id="resultadoFolha"
                    style="margin-top:20px;"
                ></div>

            </div>

        </div>

    `;

}


function calcularFolha() {

    const campoFuncionario =
        document.getElementById(
            "folhaFuncionario"
        );


    if (!campoFuncionario) {
        return;
    }


    const id =
        campoFuncionario.value;


    const funcionario =
        funcionarios.find(
            f =>
                String(f.id) ===
                String(id)
        );


    const resultado =
        document.getElementById(
            "resultadoFolha"
        );


    if (!resultado) {
        return;
    }


    if (!funcionario) {

        resultado.innerHTML = "";

        return;

    }


    const salario =
        numero(
            funcionario.salario
        );


    const adicionais =
        valorCampo(
            "folhaAdicionais"
        );


    const descontos =
        valorCampo(
            "folhaDescontos"
        );


    const bruto =
        salario +
        adicionais;


    const inss =
        calcularINSS(
            bruto
        );


    const baseIRRF =
        Math.max(
            bruto -
            inss,
            0
        );


    const irrf =
        calcularIRRF(
            baseIRRF
        );


    const liquido =
        Math.max(
            bruto -
            inss -
            irrf -
            descontos,
            0
        );


    resultado.innerHTML = `

        <div class="valor-lista">

            <div class="valor-linha">

                <span>
                    Salário
                </span>

                <span class="valor">
                    ${moeda(salario)}
                </span>

            </div>


            <div class="valor-linha">

                <span>
                    Adicionais
                </span>

                <span class="valor">
                    ${moeda(adicionais)}
                </span>

            </div>


            <div class="valor-linha">

                <span>
                    Salário bruto
                </span>

                <span class="valor">
                    ${moeda(bruto)}
                </span>

            </div>


            <div class="valor-linha">

                <span>
                    INSS
                </span>

                <span class="valor">
                    ${moeda(inss)}
                </span>

            </div>


            <div class="valor-linha">

                <span>
                    Base de cálculo IRRF
                </span>

                <span class="valor">
                    ${moeda(baseIRRF)}
                </span>

            </div>


            <div class="valor-linha">

                <span>
                    IRRF
                </span>

                <span class="valor">
                    ${moeda(irrf)}
                </span>

            </div>


            <div class="valor-linha">

                <span>
                    Descontos adicionais
                </span>

                <span class="valor">
                    ${moeda(descontos)}
                </span>

            </div>

        </div>


        <div class="total-bruto">

            <div class="descricao">
                Salário líquido
            </div>

            <div class="numero">
                ${moeda(liquido)}
            </div>

        </div>

    `;

}


/* =========================================================
   NORMALIZAÇÃO DE CABEÇALHOS
========================================================= */

function normalizarCabecalho(valor) {

    return String(
        valor ?? ""
    )
    .normalize("NFD")
    .replace(
        /[\u0300-\u036f]/g,
        ""
    )
    .toLowerCase()
    .replace(
        /[^a-z0-9]/g,
        ""
    );

}


function normalizarValor(valor) {

    return String(
        valor ?? ""
    )
    .trim()
    .toLowerCase()
    .replace(
        /[^a-z0-9]/g,
        ""
    );

}


function encontrarColuna(
    cabecalhos,
    nomes
) {

    const procurados =
        nomes.map(
            nome =>
                normalizarCabecalho(
                    nome
                )
        );


    for (
        let i = 0;
        i < cabecalhos.length;
        i++
    ) {

        const atual =
            normalizarCabecalho(
                cabecalhos[i]
            );


        if (
            procurados.includes(
                atual
            )
        ) {

            return i;

        }

    }


    return -1;

}


function obterValorColuna(
    linha,
    indice
) {

    if (
        indice === -1 ||
        indice === undefined
    ) {

        return "";

    }


    return (
        linha[indice] ??
        ""
    );

}


/* =========================================================
   CONVERSÃO DE NÚMEROS DO EXCEL
========================================================= */

function converterNumeroExcel(valor) {

    return numero(valor);

}


/* =========================================================
   CONVERSÃO DE DATA DO EXCEL
========================================================= */

function converterDataExcel(valor) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return "";

    }


    if (
        valor instanceof Date &&
        !isNaN(valor)
    ) {

        const ano =
            valor.getFullYear();

        const mes =
            String(
                valor.getMonth() + 1
            ).padStart(2, "0");

        const dia =
            String(
                valor.getDate()
            ).padStart(2, "0");

        return `${ano}-${mes}-${dia}`;

    }


    const texto =
        String(valor)
            .trim();


    if (
        /^\d{4}-\d{2}-\d{2}$/
            .test(texto)
    ) {

        return texto;

    }


    const partes =
        texto.split("/");


    if (
        partes.length === 3
    ) {

        let dia =
            partes[0];

        let mes =
            partes[1];

        let ano =
            partes[2];


        if (
            ano.length === 2
        ) {

            ano =
                Number(ano) >= 50
                    ? `19${ano}`
                    : `20${ano}`;

        }


        return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

    }


    return texto;

}


/* =========================================================
   LOCALIZAR FUNCIONÁRIO
========================================================= */

function encontrarFuncionarioPorMatricula(
    matricula
) {

    const chave =
        normalizarValor(
            matricula
        );


    return funcionarios.find(
        funcionario =>
            normalizarValor(
                funcionario.matricula
            ) === chave
    );

}


/* =========================================================
   IMPORTAÇÃO DE FUNCIONÁRIOS
========================================================= */

async function importarFuncionarios(input) {

    const arquivo =
        input.files[0];


    if (!arquivo) {
        return;
    }


    try {

        const linhas =
            await lerArquivoPlanilha(
                arquivo
            );


        if (
            !linhas ||
            linhas.length < 2
        ) {

            throw new Error(
                "A planilha não possui dados suficientes."
            );

        }


        const cabecalhos =
            linhas[0];


        const colunaNome =
            encontrarColuna(
                cabecalhos,
                [
                    "Nome",
                    "Nome completo",
                    "Funcionário",
                    "Colaborador"
                ]
            );


        const colunaMatricula =
            encontrarColuna(
                cabecalhos,
                [
                    "Matrícula",
                    "Matricula",
                    "Registro",
                    "Código",
                    "Codigo"
                ]
            );


        const colunaCPF =
            encontrarColuna(
                cabecalhos,
                [
                    "CPF",
                    "Documento"
                ]
            );


        const colunaCargo =
            encontrarColuna(
                cabecalhos,
                [
                    "Cargo",
                    "Função",
                    "Funcao"
                ]
            );


        const colunaSalario =
            encontrarColuna(
                cabecalhos,
                [
                    "Salário",
                    "Salario",
                    "Salário base",
                    "Salario base"
                ]
            );


        const colunaAdmissao =
            encontrarColuna(
                cabecalhos,
                [
                    "Admissão",
                    "Admissao",
                    "Data de admissão",
                    "Data de admissao"
                ]
            );


        if (
            colunaNome === -1 ||
            colunaMatricula === -1
        ) {

            throw new Error(
                "A planilha precisa possuir as colunas Nome e Matrícula."
            );

        }


        let importados = 0;
        let duplicados = 0;
        let invalidos = 0;


        for (
            let i = 1;
            i < linhas.length;
            i++
        ) {

            const linha =
                linhas[i];


            const nome =
                String(
                    obterValorColuna(
                        linha,
                        colunaNome
                    )
                ).trim();


            const matricula =
                String(
                    obterValorColuna(
                        linha,
                        colunaMatricula
                    )
                ).trim();


            if (
                !nome ||
                !matricula
            ) {

                invalidos++;

                continue;

            }


            const cpf =
                String(
                    obterValorColuna(
                        linha,
                        colunaCPF
                    )
                ).trim();


            const duplicadoMatricula =
                funcionarios.some(
                    funcionario =>
                        normalizarValor(
                            funcionario.matricula
                        ) ===
                        normalizarValor(
                            matricula
                        )
                );


            const duplicadoCPF =
                cpf &&
                funcionarios.some(
                    funcionario =>
                        normalizarValor(
                            funcionario.cpf
                        ) ===
                        normalizarValor(
                            cpf
                        )
                );


            if (
                duplicadoMatricula ||
                duplicadoCPF
            ) {

                duplicados++;

                continue;

            }


            const salario =
                converterNumeroExcel(
                    obterValorColuna(
                        linha,
                        colunaSalario
                    )
                );


            const admissao =
                converterDataExcel(
                    obterValorColuna(
                        linha,
                        colunaAdmissao
                    )
                );


            const cargo =
                String(
                    obterValorColuna(
                        linha,
                        colunaCargo
                    )
                ).trim();


            funcionarios.push({

                id:
                    Date.now() +
                    i,

                nome,

                matricula,

                cpf,

                cargo,

                salario,

                admissao

            });


            importados++;

        }


        salvarFuncionarios();


        const resultado =
            document.getElementById(
                "resultadoImportacaoFuncionarios"
            );


        if (resultado) {

            resultado.innerHTML = `

                <div
                    class="status-consignado status-regular"
                >

                    <strong>
                        Importação concluída
                    </strong>

                    <br>

                    Funcionários importados:
                    <strong>${importados}</strong>

                    <br>

                    Duplicados:
                    <strong>${duplicados}</strong>

                    <br>

                    Linhas inválidas:
                    <strong>${invalidos}</strong>

                </div>

            `;

        }


        input.value = "";


    } catch (erro) {

        console.error(
            erro
        );


        alert(
            "Erro ao importar a planilha:\n\n" +
            erro.message
        );

    }

}


/* =========================================================
   IMPORTAÇÃO DE CONSIGNADO
========================================================= */

async function importarConsignado(input) {

    const arquivo =
        input.files[0];


    if (!arquivo) {
        return;
    }


    try {

        const linhas =
            await lerArquivoPlanilha(
                arquivo
            );


        if (
            !linhas ||
            linhas.length < 2
        ) {

            throw new Error(
                "A planilha não possui dados suficientes."
            );

        }


        const cabecalhos =
            linhas[0];


        const colunaMatricula =
            encontrarColuna(
                cabecalhos,
                [
                    "Matrícula",
                    "Matricula",
                    "Registro"
                ]
            );


        if (
            colunaMatricula === -1
        ) {

            throw new Error(
                "A planilha precisa possuir a coluna Matrícula."
            );

        }


        const colunaInstituicao =
            encontrarColuna(
                cabecalhos,
                [
                    "Instituição",
                    "Instituicao",
                    "Banco",
                    "Financeira"
                ]
            );


        const colunaContrato =
            encontrarColuna(
                cabecalhos,
                [
                    "Contrato",
                    "Número contrato",
                    "Numero contrato"
                ]
            );


        const colunaSalario =
            encontrarColuna(
                cabecalhos,
                [
                    "Salário bruto",
                    "Salario bruto",
                    "Salário",
                    "Salario"
                ]
            );


        /*
           A coluna IRRF da planilha não é mais utilizada.

           O sistema calcula automaticamente:

           Base IRRF = salário bruto - INSS
           IRRF = cálculo pela tabela definida.
        */


        const colunaPercentual =
            encontrarColuna(
                cabecalhos,
                [
                    "Margem",
                    "Percentual margem",
                    "Percentual"
                ]
            );


        const colunaParcela =
            encontrarColuna(
                cabecalhos,
                [
                    "Parcela",
                    "Parcela mensal"
                ]
            );


        const colunaSaldo =
            encontrarColuna(
                cabecalhos,
                [
                    "Saldo devedor",
                    "Saldo"
                ]
            );


        let importados = 0;
        let duplicados = 0;
        let invalidos = 0;
        let funcionariosNaoEncontrados = 0;


        for (
            let i = 1;
            i < linhas.length;
            i++
        ) {

            const linha =
                linhas[i];


            const matricula =
                String(
                    obterValorColuna(
                        linha,
                        colunaMatricula
                    )
                ).trim();


            if (!matricula) {

                invalidos++;

                continue;

            }


            const funcionario =
                encontrarFuncionarioPorMatricula(
                    matricula
                );


            if (!funcionario) {

                funcionariosNaoEncontrados++;

                continue;

            }


            const instituicao =
                String(
                    obterValorColuna(
                        linha,
                        colunaInstituicao
                    )
                ).trim();


            const contrato =
                String(
                    obterValorColuna(
                        linha,
                        colunaContrato
                    )
                ).trim();


            const salarioImportado =
                converterNumeroExcel(
                    obterValorColuna(
                        linha,
                        colunaSalario
                    )
                );


            /*
             * Prioridade:
             * salário cadastrado no funcionário.
             *
             * Se não existir, usa o salário da planilha.
             */

            const salarioFuncionario =
                numero(
                    funcionario.salario
                );


            const salarioBruto =
                salarioFuncionario > 0
                    ? salarioFuncionario
                    : salarioImportado;


            /*
             * INSS é sempre recalculado.
             */

            const inss =
                calcularINSS(
                    salarioBruto
                );


            /*
             * IRRF é sempre recalculado.
             *
             * Não utiliza o valor da planilha.
             */

            const baseIRRF =
                Math.max(
                    salarioBruto -
                    inss,
                    0
                );


            const irrf =
                calcularIRRF(
                    baseIRRF
                );


            const salarioLiquidoBase =
                Math.max(
                    salarioBruto -
                    inss -
                    irrf,
                    0
                );


            const percentualImportado =
                converterNumeroExcel(
                    obterValorColuna(
                        linha,
                        colunaPercentual
                    )
                );


            const percentual =
                percentualImportado ||
                35;


            const margemMaxima =
                salarioLiquidoBase *
                (
                    percentual / 100
                );


            const parcela =
                converterNumeroExcel(
                    obterValorColuna(
                        linha,
                        colunaParcela
                    )
                );


            const saldo =
                converterNumeroExcel(
                    obterValorColuna(
                        linha,
                        colunaSaldo
                    )
                );


            const duplicado =
                consignados.some(
                    c =>

                        normalizarValor(
                            c.matricula
                        ) ===
                        normalizarValor(
                            funcionario.matricula
                        )

                        &&

                        normalizarValor(
                            c.contrato
                        ) ===
                        normalizarValor(
                            contrato
                        )

                        &&

                        normalizarValor(
                            c.instituicao
                        ) ===
                        normalizarValor(
                            instituicao
                        )
                );


            if (duplicado) {

                duplicados++;

                continue;

            }


            consignados.push({

                id:
                    Date.now() +
                    i,

                funcionarioId:
                    funcionario.id,

                matricula:
                    funcionario.matricula,

                nome:
                    funcionario.nome,

                instituicao,

                contrato,

                salarioBruto,

                inss,

                irrf,

                salarioLiquidoBase,

                percentualMargem:
                    percentual,

                margemMaxima,

                parcela,

                saldoDevedor:
                    saldo,

                dataCadastro:
                    dataAtual()

            });


            importados++;

        }


        salvarConsignados();


        const resultado =
            document.getElementById(
                "resultadoImportacaoConsignado"
            );


        if (resultado) {

            resultado.innerHTML = `

                <div
                    class="status-consignado status-regular"
                >

                    <strong>
                        Importação concluída
                    </strong>

                    <br>

                    Contratos importados:
                    <strong>${importados}</strong>

                    <br>

                    Duplicados:
                    <strong>${duplicados}</strong>

                    <br>

                    Matrículas não encontradas:
                    <strong>${funcionariosNaoEncontrados}</strong>

                    <br>

                    Linhas inválidas:
                    <strong>${invalidos}</strong>

                </div>

            `;

        }


        preencherTabelaConsignados();


        input.value = "";


    } catch (erro) {

        console.error(
            erro
        );


        alert(
            "Erro ao importar a planilha:\n\n" +
            erro.message
        );

    }

}


/* =========================================================
   LEITURA DE XLSX / XLSM / XLS / CSV
========================================================= */

async function lerArquivoPlanilha(
    arquivo
) {

    if (
        typeof XLSX ===
        "undefined"
    ) {

        throw new Error(
            "A biblioteca de leitura de planilhas não foi carregada."
        );

    }


    const extensao =
        arquivo.name
            .split(".")
            .pop()
            .toLowerCase();


    const arrayBuffer =
        await arquivo.arrayBuffer();


    let workbook;


    if (
        extensao === "csv"
    ) {

        const texto =
            new TextDecoder(
                "utf-8"
            ).decode(
                arrayBuffer
            );


        workbook =
            XLSX.read(
                texto,
                {
                    type: "string",
                    raw: false
                }
            );

    } else {

        workbook =
            XLSX.read(
                arrayBuffer,
                {
                    type: "array",
                    cellDates: true,
                    raw: false
                }
            );

    }


    if (
        !workbook.SheetNames.length
    ) {

        throw new Error(
            "Nenhuma planilha foi encontrada."
        );

    }


    const primeiraAba =
        workbook.Sheets[
            workbook.SheetNames[0]
        ];


    const linhas =
        XLSX.utils.sheet_to_json(
            primeiraAba,
            {
                header: 1,
                defval: "",
                raw: false,
                blankrows: false
            }
        );


    return linhas;

}


/* =========================================================
   EXPORTAÇÃO DE FUNCIONÁRIOS
========================================================= */

function exportarFuncionarios() {

    if (!funcionarios.length) {

        alert(
            "Não existem funcionários cadastrados."
        );

        return;

    }


    if (
        typeof XLSX !==
        "undefined"
    ) {

        const dados = [

            [
                "Nome",
                "Matrícula",
                "CPF",
                "Cargo",
                "Salário",
                "Admissão"
            ]

        ];


        funcionarios.forEach(
            f => {

                dados.push([

                    f.nome,

                    f.matricula,

                    f.cpf,

                    f.cargo,

                    numero(f.salario),

                    f.admissao

                ]);

            }
        );


        const ws =
            XLSX.utils.aoa_to_sheet(
                dados
            );


        const wb =
            XLSX.utils.book_new();


        XLSX.utils.book_append_sheet(
            wb,
            ws,
            "Funcionários"
        );


        XLSX.writeFile(
            wb,
            "funcionarios.xlsx"
        );


        return;

    }


    const cabecalho =
        [
            "Nome",
            "Matrícula",
            "CPF",
            "Cargo",
            "Salário",
            "Admissão"
        ];


    const linhas =
        funcionarios.map(
            f => [

                f.nome,
                f.matricula,
                f.cpf,
                f.cargo,
                numero(f.salario),
                f.admissao

            ]
        );


    baixarCSV(
        "funcionarios.csv",
        cabecalho,
        linhas
    );

}


/* =========================================================
   EXPORTAÇÃO DE CONSIGNADOS
========================================================= */

function exportarConsignados() {

    if (!consignados.length) {

        alert(
            "Não existem contratos consignados cadastrados."
        );

        return;

    }


    const dados = [

        [
            "Matrícula",
            "Nome",
            "Instituição",
            "Contrato",
            "Salário bruto",
            "INSS",
            "IRRF",
            "Salário líquido base",
            "Margem %",
            "Margem máxima",
            "Parcela",
            "Saldo devedor",
            "Data cadastro"
        ]

    ];


    consignados.forEach(
        c => {

            /*
               Recalcula o INSS no momento da
               exportação.
            */

            const salarioBruto =
                numero(
                    c.salarioBruto
                );


            const inss =
                calcularINSS(
                    salarioBruto
                );


            /*
               Recalcula o IRRF no momento
               da exportação.
            */

            const baseIRRF =
                Math.max(
                    salarioBruto -
                    inss,
                    0
                );


            const irrf =
                calcularIRRF(
                    baseIRRF
                );


            const salarioLiquidoBase =
                Math.max(
                    salarioBruto -
                    inss -
                    irrf,
                    0
                );


            const percentualMargem =
                numero(
                    c.percentualMargem
                );


            const margemMaxima =
                salarioLiquidoBase *
                (
                    percentualMargem / 100
                );


            dados.push([

                c.matricula,

                c.nome,

                c.instituicao,

                c.contrato,

                salarioBruto,

                inss,

                irrf,

                salarioLiquidoBase,

                percentualMargem,

                margemMaxima,

                c.parcela,

                c.saldoDevedor,

                c.dataCadastro

            ]);

        }
    );


    if (
        typeof XLSX !==
        "undefined"
    ) {

        const ws =
            XLSX.utils.aoa_to_sheet(
                dados
            );


        const wb =
            XLSX.utils.book_new();


        XLSX.utils.book_append_sheet(
            wb,
            ws,
            "Consignados"
        );


        XLSX.writeFile(
            wb,
            "consignados.xlsx"
        );


        return;

    }


    baixarCSV(
        "consignados.csv",
        dados[0],
        dados.slice(1)
    );

}


/* =========================================================
   CSV
========================================================= */

function csvCampo(valor) {

    const texto =
        String(
            valor ?? ""
        );


    return `"${texto.replace(
        /"/g,
        '""'
    )}"`;

}


function baixarCSV(
    nomeArquivo,
    cabecalho,
    linhas
) {

    const conteudo = [

        cabecalho
            .map(csvCampo)
            .join(";"),

        ...linhas.map(
            linha =>
                linha
                    .map(csvCampo)
                    .join(";")
        )

    ].join("\n");


    const blob =
        new Blob(
            [
                "\uFEFF" +
                conteudo
            ],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href = url;

    link.download =
        nomeArquivo;


    document
        .body
        .appendChild(
            link
        );


    link.click();


    document
        .body
        .removeChild(
            link
        );


    URL.revokeObjectURL(
        url
    );

}

/* =========================================================
   PRANCHETA RH — CONFIGURAÇÕES VISUAIS
   Tema claro/escuro e espaçamento compacto
========================================================= */

const CHAVE_PREFERENCIAS_VISUAIS = "pranchetaPreferenciasVisuais";

function carregarPreferenciasVisuais() {
    try {
        const dados = localStorage.getItem(CHAVE_PREFERENCIAS_VISUAIS);

        return dados
            ? JSON.parse(dados)
            : { tema: "claro", espacamento: "normal" };

    } catch (erro) {
        console.error("Erro ao carregar preferências visuais:", erro);

        return { tema: "claro", espacamento: "normal" };
    }
}

function aplicarPreferenciasVisuais() {
    const preferencias = carregarPreferenciasVisuais();

    document.body.classList.toggle(
        "tema-escuro",
        preferencias.tema === "escuro"
    );

    document.body.classList.toggle(
        "espacamento-compacto",
        preferencias.espacamento === "compacto"
    );

    const campoTema = document.getElementById("temaSistema");
    const campoEspacamento = document.getElementById("espacamentoSistema");

    if (campoTema) {
        campoTema.value = preferencias.tema;
    }

    if (campoEspacamento) {
        campoEspacamento.value = preferencias.espacamento;
    }
}

function abrirConfiguracoes() {
    const modal = document.getElementById("modalConfiguracoes");

    if (!modal) {
        alert(
            "A janela de configurações não foi encontrada. Verifique o index.html."
        );
        return;
    }

    aplicarPreferenciasVisuais();
    modal.classList.add("aberto");
}

function fecharConfiguracoes() {
    const modal = document.getElementById("modalConfiguracoes");

    if (modal) {
        modal.classList.remove("aberto");
    }
}

function salvarConfiguracoes() {
    const campoTema = document.getElementById("temaSistema");
    const campoEspacamento = document.getElementById("espacamentoSistema");

    const preferencias = {
        tema: campoTema ? campoTema.value : "claro",
        espacamento: campoEspacamento
            ? campoEspacamento.value
            : "normal"
    };

    try {
        localStorage.setItem(
            CHAVE_PREFERENCIAS_VISUAIS,
            JSON.stringify(preferencias)
        );

        aplicarPreferenciasVisuais();
        fecharConfiguracoes();

    } catch (erro) {
        console.error("Erro ao salvar as configurações:", erro);
        alert("Não foi possível salvar as configurações neste navegador.");
    }
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
/* =========================================================
   CONFIGURAÇÕES VISUAIS
   Tema claro/escuro e espaçamento
========================================================= */

// As funções do botão serão adicionadas aqui.

