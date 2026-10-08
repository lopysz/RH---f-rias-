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


/*
   Converte valores numéricos em diversos formatos:

   4559,59
   4.559,59
   4559.59
   4,559.59
   4,559,59

   Todos passam a representar:

   4559.59
*/

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


    /*
       Remove símbolos monetários,
       mantendo números, ponto, vírgula
       e sinal negativo.
    */

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


    /*
       Caso 1:

       4.559,59

       O último separador é a vírgula.
       Pontos são milhares.
    */

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

            /*
               Exemplo:

               4,559.59
            */

            texto =
                texto
                    .replace(/,/g, "");

        }

    }


    /*
       Caso 2:

       4,559,59

       Duas vírgulas.
       A última é decimal.
    */

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


    /*
       Caso 3:

       4.559.59

       Mais de um ponto.
       O último é decimal.
    */

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


    /*
       Caso 4:

       4559,59
    */

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


    /* Faixa 1 */

    const faixa1 =
        Math.min(
            salario,
            1621.00
        );

    inss +=
        faixa1 * 0.075;


    /* Faixa 2 */

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


    /* Faixa 3 */

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


    /* Faixa 4 */

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
            "Deseja realmente excluir este funcionário