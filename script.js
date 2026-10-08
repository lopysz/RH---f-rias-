/* =========================================================
   PRANCHETA RH
   SISTEMA DE RECURSOS HUMANOS
========================================================= */


/* =========================================================
   BANCO LOCAL
========================================================= */

let funcionarios = carregarFuncionarios();
let consignados = carregarConsignados();


/* =========================================================
   FUNCIONÁRIOS
========================================================= */

function carregarFuncionarios() {

    try {

        const dados =
            localStorage.getItem("pranchetaFuncionarios");

        if (!dados) {
            return [];
        }

        const lista = JSON.parse(dados);

        return Array.isArray(lista) ? lista : [];

    } catch (erro) {

        console.error("Erro ao carregar funcionários:", erro);

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
   CONSIGNADOS
========================================================= */

function carregarConsignados() {

    try {

        const dados =
            localStorage.getItem("pranchetaConsignados");

        if (!dados) {
            return [];
        }

        const lista = JSON.parse(dados);

        return Array.isArray(lista) ? lista : [];

    } catch (erro) {

        console.error("Erro ao carregar consignados:", erro);

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
   UTILITÁRIOS
========================================================= */

function moeda(valor) {

    const numero = Number(valor) || 0;

    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


function numero(valor) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {
        return 0;
    }

    if (typeof valor === "number") {
        return valor;
    }

    let texto = String(valor)
        .trim()
        .replace(/\s/g, "")
        .replace(/R\$/gi, "");

    if (texto.includes(",")) {

        texto = texto
            .replace(/\./g, "")
            .replace(",", ".");

    }

    const resultado = parseFloat(texto);

    return isNaN(resultado) ? 0 : resultado;
}


function valorCampo(id) {

    const campo = document.getElementById(id);

    if (!campo) {
        return 0;
    }

    return numero(campo.value);
}


function atualizarTexto(id, valor) {

    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = valor;
    }
}


function escapar(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {
        return "";
    }

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function dataAtual() {

    const agora = new Date();

    const ano = agora.getFullYear();

    const mes = String(
        agora.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
        agora.getDate()
    ).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}


function formatarData(data) {

    if (!data) {
        return "";
    }

    const partes = String(data).split("-");

    if (partes.length === 3) {

        return `${partes[2]}/${partes[1]}/${partes[0]}`;

    }

    return data;
}


/* =========================================================
   TÍTULOS
========================================================= */

function titulo(tituloPrincipal, subtitulo) {

    atualizarTexto(
        "tituloPagina",
        tituloPrincipal
    );

    atualizarTexto(
        "subtituloPagina",
        subtitulo
    );
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
            mostrarFerias();
            break;

        case "consignado":
            mostrarConsignado();
            break;

        case "folha":
            mostrarFolha();
            break;

        case "cadastrar":
            mostrarCadastro();
            break;

        case "funcionarios":
            mostrarFuncionarios();
            break;

        case "planilhas":
            mostrarPlanilhas();
            break;

        case "planilhaConsignado":
            mostrarPlanilhaConsignado();
            break;

        default:
            mostrarFerias();
            break;
    }
}


/* =========================================================
   CADASTRO DE FUNCIONÁRIO
========================================================= */

function mostrarCadastro() {

    titulo(
        "Cadastrar funcionário",
        "Cadastro individual ou importação em lote"
    );


    document.getElementById("areaConteudo").innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>Dados do funcionário</h2>

                <p>
                    Preencha os dados abaixo para cadastrar
                    um funcionário individualmente.
                </p>

            </div>


            <div class="card-corpo">

                <div class="form-grid">

                    <div class="form-grupo largo">

                        <label>Nome completo</label>

                        <input
                            type="text"
                            id="cadNome"
                            placeholder="Nome completo"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>CPF</label>

                        <input
                            type="text"
                            id="cadCPF"
                            placeholder="000.000.000-00"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Matrícula</label>

                        <input
                            type="text"
                            id="cadMatricula"
                            placeholder="Matrícula"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Cargo</label>

                        <input
                            type="text"
                            id="cadCargo"
                            placeholder="Cargo"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Salário</label>

                        <input
                            type="number"
                            id="cadSalario"
                            step="0.01"
                            min="0"
                            placeholder="0,00"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>Data de admissão</label>

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

            </div>

        </div>


        <!-- =================================================
             IMPORTAÇÃO EM LOTE
        ================================================== -->

        <div class="card">

            <div class="card-cabecalho">

                <h2>Importar planilha de funcionários</h2>

                <p>
                    Cadastre vários funcionários de uma vez
                    através de um arquivo CSV.
                </p>

            </div>


            <div class="card-corpo">

                <div class="form-grid">

                    <div class="form-grupo largo">

                        <label>
                            Arquivo da planilha
                        </label>

                        <input
                            type="file"
                            id="arquivoFuncionarios"
                            accept=".csv,.txt"
                        >

                    </div>

                </div>


                <div
                    style="
                        margin-top:15px;
                        padding:14px;
                        background:#f5f6f7;
                        border:1px solid #dddfe2;
                        border-radius:4px;
                        font-size:12px;
                        color:#555;
                        line-height:1.6;
                    "
                >

                    <strong>Formato esperado:</strong><br>

                    Nome;CPF;Matrícula;Cargo;Salário;Admissão

                    <br><br>

                    O sistema pode importar vários funcionários
                    de uma única vez.

                    <br>

                    Funcionários que já existirem pela
                    matrícula ou CPF serão ignorados para
                    evitar duplicidade.

                </div>


                <div class="botoes">

                    <button
                        class="btn btn-principal"
                        onclick="importarFuncionariosCSV()"
                    >
                        Importar funcionários
                    </button>

                    <button
                        class="btn btn-secundario"
                        onclick="limparArquivoFuncionarios()"
                    >
                        Limpar arquivo
                    </button>

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
   CADASTRO INDIVIDUAL
========================================================= */

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
        valorCampo("cadSalario");

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


    if (existeFuncionario(matricula, cpf)) {

        alert(
            "Já existe um funcionário cadastrado com esta matrícula ou CPF."
        );

        return;
    }


    const funcionario = {

        id: Date.now().toString(),

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


    limparCadastro();
}


function limparCadastro() {

    const campos = [

        "cadNome",
        "cadCPF",
        "cadMatricula",
        "cadCargo",
        "cadSalario",
        "cadAdmissao"

    ];


    campos.forEach(id => {

        const campo =
            document.getElementById(id);

        if (campo) {
            campo.value = "";
        }

    });
}


/* =========================================================
   VERIFICAR DUPLICIDADE
========================================================= */

function normalizarIdentificacao(valor) {

    return String(valor || "")
        .trim()
        .replace(/\D/g, "");
}


function existeFuncionario(matricula, cpf) {

    const mat =
        normalizarIdentificacao(matricula);

    const documento =
        normalizarIdentificacao(cpf);


    return funcionarios.some(funcionario => {

        const matExistente =
            normalizarIdentificacao(
                funcionario.matricula
            );

        const cpfExistente =
            normalizarIdentificacao(
                funcionario.cpf
            );


        if (
            mat &&
            matExistente &&
            mat === matExistente
        ) {
            return true;
        }


        if (
            documento &&
            cpfExistente &&
            documento === cpfExistente
        ) {
            return true;
        }


        return false;

    });
}


/* =========================================================
   FUNCIONÁRIOS
========================================================= */

function mostrarFuncionarios() {

    titulo(
        "Funcionários",
        "Funcionários cadastrados no sistema"
    );


    let linhas = "";


    if (funcionarios.length === 0) {

        linhas = `
            <tr>
                <td colspan="6">
                    Nenhum funcionário cadastrado.
                </td>
            </tr>
        `;

    } else {

        funcionarios.forEach(funcionario => {

            linhas += `

                <tr>

                    <td>
                        ${escapar(funcionario.nome)}
                    </td>

                    <td>
                        ${escapar(funcionario.cpf)}
                    </td>

                    <td>
                        ${escapar(funcionario.matricula)}
                    </td>

                    <td>
                        ${escapar(funcionario.cargo)}
                    </td>

                    <td>
                        ${moeda(funcionario.salario)}
                    </td>

                    <td>
                        ${formatarData(funcionario.admissao)}
                    </td>

                </tr>

            `;

        });
    }


    document.getElementById("areaConteudo").innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>Funcionários cadastrados</h2>

                <p>
                    Total: ${funcionarios.length}
                    funcionário(s)
                </p>

            </div>


            <div class="card-corpo">

                <div class="tabela-container">

                    <table>

                        <thead>

                            <tr>

                                <th>Nome</th>
                                <th>CPF</th>
                                <th>Matrícula</th>
                                <th>Cargo</th>
                                <th>Salário</th>
                                <th>Admissão</th>

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


/* =========================================================
   PLANILHAS DE FUNCIONÁRIOS
========================================================= */

function mostrarPlanilhas() {

    titulo(
        "Planilhas de funcionários",
        "Visualização dos dados cadastrais"
    );


    document.getElementById("areaConteudo").innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>Base de funcionários</h2>

                <p>
                    Dados armazenados no sistema.
                </p>

            </div>


            <div class="card-corpo">

                <div class="total-bruto">

                    <div class="descricao">
                        Funcionários cadastrados
                    </div>

                    <div class="numero">
                        ${funcionarios.length}
                    </div>

                </div>


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
   EXPORTAR FUNCIONÁRIOS
========================================================= */

function exportarFuncionarios() {

    if (funcionarios.length === 0) {

        alert(
            "Não existem funcionários cadastrados para exportar."
        );

        return;
    }


    let csv =
        "Nome;CPF;Matrícula;Cargo;Salário;Admissão\n";


    funcionarios.forEach(funcionario => {

        csv += [

            csvCampo(funcionario.nome),
            csvCampo(funcionario.cpf),
            csvCampo(funcionario.matricula),
            csvCampo(funcionario.cargo),
            csvCampo(
                Number(funcionario.salario || 0)
                    .toFixed(2)
                    .replace(".", ",")
            ),
            csvCampo(funcionario.admissao)

        ].join(";") + "\n";

    });


    baixarCSV(
        csv,
        "funcionarios.csv"
    );
}


/* =========================================================
   IMPORTAÇÃO EM LOTE DE FUNCIONÁRIOS
========================================================= */

function importarFuncionariosCSV() {

    const campoArquivo =
        document.getElementById(
            "arquivoFuncionarios"
        );


    const resultado =
        document.getElementById(
            "resultadoImportacaoFuncionarios"
        );


    if (
        !campoArquivo ||
        !campoArquivo.files ||
        !campoArquivo.files.length
    ) {

        alert(
            "Selecione uma planilha para importar."
        );

        return;
    }


    const arquivo =
        campoArquivo.files[0];


    const leitor =
        new FileReader();


    leitor.onload = function(evento) {

        try {

            const texto =
                evento.target.result;


            const linhas =
                separarCSV(texto);


            if (linhas.length < 2) {

                resultado.innerHTML = `

                    <div class="status-consignado status-alerta">

                        A planilha não possui funcionários
                        para importar.

                    </div>

                `;

                return;
            }


            let cadastrados = 0;
            let duplicados = 0;
            let invalidos = 0;

            const problemas = [];


            /*
             * Começa na linha 1 porque a linha 0
             * contém os títulos das colunas.
             */

            for (
                let i = 1;
                i < linhas.length;
                i++
            ) {

                const linha = linhas[i];


                if (
                    !linha ||
                    linha.length === 0
                ) {
                    continue;
                }


                /*
                 * Esperado:
                 *
                 * Nome
                 * CPF
                 * Matrícula
                 * Cargo
                 * Salário
                 * Admissão
                 */

                const nome =
                    String(linha[0] || "").trim();

                const cpf =
                    String(linha[1] || "").trim();

                const matricula =
                    String(linha[2] || "").trim();

                const cargo =
                    String(linha[3] || "").trim();

                const salario =
                    converterNumeroCSV(
                        linha[4]
                    );

                const admissao =
                    String(linha[5] || "").trim();


                /*
                 * Ignora linhas completamente vazias.
                 */

                if (
                    !nome &&
                    !cpf &&
                    !matricula &&
                    !cargo &&
                    !linha[4] &&
                    !admissao
                ) {
                    continue;
                }


                /*
                 * Nome e matrícula são obrigatórios.
                 */

                if (
                    !nome ||
                    !matricula
                ) {

                    invalidos++;

                    problemas.push(
                        `Linha ${i + 1}: nome ou matrícula ausente.`
                    );

                    continue;
                }


                /*
                 * Verifica duplicidade tanto
                 * nos dados existentes quanto
                 * nos que acabaram de ser adicionados.
                 */

                if (
                    existeFuncionario(
                        matricula,
                        cpf
                    )
                ) {

                    duplicados++;

                    continue;
                }


                const funcionario = {

                    id:
                        Date.now().toString() +
                        "_" +
                        i,

                    nome,
                    cpf,
                    matricula,
                    cargo,
                    salario,
                    admissao

                };


                funcionarios.push(
                    funcionario
                );


                cadastrados++;
            }


            salvarFuncionarios();


            let html = `

                <div
                    style="
                        padding:16px;
                        border:1px solid #c9dfd1;
                        background:#edf6f0;
                        border-radius:4px;
                        color:#1f6b45;
                    "
                >

                    <strong>
                        Importação concluída
                    </strong>

                    <div
                        style="
                            margin-top:10px;
                            line-height:1.7;
                        "
                    >

                        ${cadastrados}
                        funcionário(s) cadastrado(s)<br>

                        ${duplicados}
                        duplicado(s) ignorado(s)<br>

                        ${invalidos}
                        linha(s) inválida(s)

                    </div>

                </div>

            `;


            if (problemas.length > 0) {

                html += `

                    <div
                        style="
                            margin-top:10px;
                            padding:12px;
                            border:1px solid #e3b5b5;
                            background:#fff7f7;
                            border-radius:4px;
                            color:#a32626;
                            font-size:12px;
                            line-height:1.6;
                        "
                    >

                        <strong>
                            Problemas encontrados:
                        </strong>

                        <br>

                        ${problemas
                            .slice(0, 10)
                            .map(escapar)
                            .join("<br>")}

                    </div>

                `;
            }


            resultado.innerHTML = html;


            /*
             * Limpa o input do arquivo.
             */

            campoArquivo.value = "";


        } catch (erro) {

            console.error(
                "Erro na importação:",
                erro
            );


            resultado.innerHTML = `

                <div class="status-consignado status-alerta">

                    Não foi possível ler a planilha.
                    Verifique se o arquivo está no formato
                    CSV esperado.

                </div>

            `;
        }

    };


    leitor.onerror = function() {

        alert(
            "Não foi possível abrir o arquivo."
        );

    };


    leitor.readAsText(
        arquivo,
        "UTF-8"
    );
}


/* =========================================================
   LIMPAR ARQUIVO DE FUNCIONÁRIOS
========================================================= */

function limparArquivoFuncionarios() {

    const campo =
        document.getElementById(
            "arquivoFuncionarios"
        );


    const resultado =
        document.getElementById(
            "resultadoImportacaoFuncionarios"
        );


    if (campo) {
        campo.value = "";
    }


    if (resultado) {
        resultado.innerHTML = "";
    }
}


/* =========================================================
   FÉRIAS
========================================================= */

function mostrarFerias() {

    titulo(
        "Férias",
        "Cálculo completo da remuneração de férias"
    );


    let opcoes = `
        <option value="">
            Selecione um funcionário
        </option>
    `;


    funcionarios.forEach(funcionario => {

        opcoes += `

            <option value="${funcionario.id}">

                ${escapar(funcionario.nome)}
                -
                ${escapar(funcionario.matricula)}

            </option>

        `;

    });


    document.getElementById("areaConteudo").innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>Funcionário</h2>

                <p>
                    Selecione o funcionário para calcular
                    as férias.
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


function selecionarFuncionarioFerias() {

    const id =
        document.getElementById(
            "feriasFuncionario"
        ).value;


    const funcionario =
        funcionarios.find(
            item => String(item.id) === String(id)
        );


    const box =
        document.getElementById(
            "funcionarioFeriasSelecionado"
        );


    const area =
        document.getElementById(
            "areaCalculoFerias"
        );


    if (!funcionario) {

        box.classList.remove("mostrar");

        area.innerHTML = "";

        return;
    }


    box.innerHTML = `

        <strong>
            ${escapar(funcionario.nome)}
        </strong>

        <div class="funcionario-info">

            <span>
                CPF:
                ${escapar(funcionario.cpf)}
            </span>

            <span>
                Matrícula:
                ${escapar(funcionario.matricula)}
            </span>

            <span>
                Cargo:
                ${escapar(funcionario.cargo)}
            </span>

            <span>
                Salário:
                ${moeda(funcionario.salario)}
            </span>

        </div>

    `;


    box.classList.add("mostrar");


    abrirFeriasFuncionario(
        funcionario
    );
}


function abrirFeriasFuncionario(
    funcionario
) {

    const salario =
        Number(funcionario.salario) || 0;


    document.getElementById(
        "areaCalculoFerias"
    ).innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Período de férias
                </h2>

                <p>
                    Informe a quantidade de dias.
                </p>

            </div>


            <div class="card-corpo">

                <div class="form-grid">

                    <div class="form-grupo">

                        <label>
                            Dias de férias
                        </label>

                        <input
                            type="number"
                            id="diasFerias"
                            value="30"
                            min="1"
                            max="30"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Abono pecuniário
                        </label>

                        <select id="abonoFerias">

                            <option value="0">
                                Não
                            </option>

                            <option value="10">
                                10 dias
                            </option>

                        </select>

                    </div>

                </div>

            </div>

        </div>


        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Componentes da remuneração
                </h2>

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
                            value="${salario}"
                            step="0.01"
                        >

                        <small>
                            Salário considerado no cálculo.
                        </small>

                    </div>


                    <div class="componente">

                        <label>
                            Outros adicionais
                        </label>

                        <input
                            type="number"
                            id="feriasAdicionais"
                            value="0"
                            step="0.01"
                        >

                        <small>
                            Horas extras, adicionais etc.
                        </small>

                    </div>


                    <div class="componente">

                        <label>
                            Descontos
                        </label>

                        <input
                            type="number"
                            id="feriasDescontos"
                            value="0"
                            step="0.01"
                        >

                        <small>
                            Outros descontos.
                        </small>

                    </div>

                </div>


                <div class="botoes">

                    <button
                        class="btn btn-principal"
                        onclick="calcularBruto()"
                    >
                        Calcular férias
                    </button>

                </div>

            </div>

        </div>


        <div
            id="resultadoFerias"
        ></div>

    `;
}


function calcularDireito() {

    const dias =
        Math.min(
            Math.max(
                Number(
                    document.getElementById(
                        "diasFerias"
                    ).value
                ) || 0,
                0
            ),
            30
        );


    return dias / 30;
}


function campoDesconto() {

    return valorCampo(
        "feriasDescontos"
    );
}


function calcularBruto() {

    const salario =
        valorCampo("feriasSalario");

    const adicionais =
        valorCampo("feriasAdicionais");

    const descontos =
        campoDesconto();

    const direito =
        calcularDireito();


    const base =
        (salario + adicionais) *
        direito;


    const adicionalTerco =
        base / 3;


    const bruto =
        base + adicionalTerco;


    const liquido =
        Math.max(
            bruto - descontos,
            0
        );


    document.getElementById(
        "resultadoFerias"
    ).innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Resultado
                </h2>

            </div>


            <div class="card-corpo">

                <div class="valor-lista">

                    <div class="valor-linha">

                        <span>
                            Salário proporcional
                        </span>

                        <span class="valor">
                            ${moeda(base)}
                        </span>

                    </div>


                    <div class="valor-linha">

                        <span>
                            1/3 constitucional
                        </span>

                        <span class="valor">
                            ${moeda(adicionalTerco)}
                        </span>

                    </div>


                    <div class="valor-linha">

                        <span>
                            Descontos informados
                        </span>

                        <span class="valor">
                            ${moeda(descontos)}
                        </span>

                    </div>

                </div>


                <div class="total-bruto">

                    <div class="descricao">
                        Valor bruto
                    </div>

                    <div class="numero">
                        ${moeda(bruto)}
                    </div>

                </div>


                <div class="total-bruto">

                    <div class="descricao">
                        Valor após descontos informados
                    </div>

                    <div class="numero">
                        ${moeda(liquido)}
                    </div>

                </div>

            </div>

        </div>

    `;
}


/* =========================================================
   CONSIGNADO - CÁLCULO
========================================================= */

function mostrarConsignado() {

    titulo(
        "Empréstimo consignado",
        "Análise da margem consignável"
    );


    let opcoes = `
        <option value="">
            Selecione um funcionário
        </option>
    `;


    funcionarios.forEach(funcionario => {

        opcoes += `

            <option value="${funcionario.id}">

                ${escapar(funcionario.nome)}
                -
                ${escapar(funcionario.matricula)}

            </option>

        `;

    });


    document.getElementById("areaConteudo").innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Análise de margem
                </h2>

                <p>
                    Selecione o funcionário para analisar
                    a margem disponível.
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
                String(item.id) === String(id)
        );


    const area =
        document.getElementById(
            "areaConsignado"
        );


    if (!funcionario) {

        area.innerHTML = "";

        return;
    }


    area.innerHTML = `

        <div class="componentes-grid">

            <div class="componente">

                <label>
                    Salário bruto
                </label>

                <input
                    type="number"
                    id="consBruto"
                    value="${Number(funcionario.salario) || 0}"
                    step="0.01"
                    oninput="calcularMargemConsignado()"
                >

            </div>


            <div class="componente">

                <label>
                    INSS
                </label>

                <input
                    type="number"
                    id="consINSS"
                    value="0"
                    step="0.01"
                    oninput="calcularMargemConsignado()"
                >

            </div>


            <div class="componente">

                <label>
                    IRRF
                </label>

                <input
                    type="number"
                    id="consIRRF"
                    value="0"
                    step="0.01"
                    oninput="calcularMargemConsignado()"
                >

            </div>


            <div class="componente">

                <label>
                    Percentual de margem
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
        >

            Informe os valores para calcular a margem.

        </div>

    `;


    calcularMargemConsignado();
}


function calcularMargemConsignado() {

    const bruto =
        valorCampo("consBruto");

    const inss =
        valorCampo("consINSS");

    const irrf =
        valorCampo("consIRRF");

    const percentual =
        valorCampo("consPercentual");

    const parcelasAtivas =
        valorCampo("consParcelasAtivas");

    const novaParcela =
        valorCampo("consNovaParcela");


    const liquido =
        Math.max(
            bruto - inss - irrf,
            0
        );


    const margemMaxima =
        liquido *
        (percentual / 100);


    const margemDisponivel =
        Math.max(
            margemMaxima -
            parcelasAtivas,
            0
        );


    const totalComNovoContrato =
        parcelasAtivas +
        novaParcela;


    const regular =
        totalComNovoContrato <=
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
            ${regular
                ? "MARGEM DISPONÍVEL"
                : "MARGEM EXCEDIDA"}
        </strong>

        <div
            style="
                margin-top:8px;
                line-height:1.7;
            "
        >

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

            Parcelas já ativas:
            <strong>
                ${moeda(parcelasAtivas)}
            </strong>

            <br>

            Margem disponível:
            <strong>
                ${moeda(margemDisponivel)}
            </strong>

            <br>

            Total com nova parcela:
            <strong>
                ${moeda(totalComNovoContrato)}
            </strong>

        </div>

    `;
}


/* =========================================================
   PLANILHA DE CONSIGNADO
========================================================= */

function mostrarPlanilhaConsignado() {

    titulo(
        "Planilha consignado",
        "Controle dos contratos de empréstimo consignado"
    );


    let opcoes = `
        <option value="">
            Selecione um funcionário
        </option>
    `;


    funcionarios.forEach(funcionario => {

        opcoes += `

            <option value="${funcionario.id}">

                ${escapar(funcionario.nome)}
                -
                ${escapar(funcionario.matricula)}

            </option>

        `;

    });


    document.getElementById("areaConteudo").innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Novo contrato consignado
                </h2>

                <p>
                    Cadastre o contrato e acompanhe
                    as parcelas do funcionário.
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

                            ${opcoes}

                        </select>

                    </div>


                    <div class="form-grupo">

                        <label>
                            CPF
                        </label>

                        <input
                            type="text"
                            id="planConsCPF"
                            readonly
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Matrícula
                        </label>

                        <input
                            type="text"
                            id="planConsMatricula"
                            readonly
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Setor
                        </label>

                        <input
                            type="text"
                            id="planConsSetor"
                        >

                    </div>

                </div>

            </div>

        </div>


        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Base para margem
                </h2>

            </div>


            <div class="card-corpo">

                <div class="form-grid">

                    <div class="form-grupo">

                        <label>
                            Salário bruto
                        </label>

                        <input
                            type="number"
                            id="planConsBruto"
                            step="0.01"
                            oninput="calcularMargemPlanilha()"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            INSS
                        </label>

                        <input
                            type="number"
                            id="planConsINSS"
                            value="0"
                            step="0.01"
                            oninput="calcularMargemPlanilha()"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            IRRF
                        </label>

                        <input
                            type="number"
                            id="planConsIRRF"
                            value="0"
                            step="0.01"
                            oninput="calcularMargemPlanilha()"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Salário líquido de base
                        </label>

                        <input
                            type="number"
                            id="planConsLiquido"
                            readonly
                        >

                    </div>

                </div>

            </div>

        </div>


        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Margem
                </h2>

            </div>


            <div class="card-corpo">

                <div class="form-grid">

                    <div class="form-grupo">

                        <label>
                            Percentual de margem
                        </label>

                        <input
                            type="number"
                            id="planConsPercentual"
                            value="35"
                            min="0"
                            step="0.01"
                            oninput="calcularMargemPlanilha()"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Limite máximo
                        </label>

                        <input
                            type="number"
                            id="planConsMargemMaxima"
                            readonly
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Parcelas ativas antes
                        </label>

                        <input
                            type="number"
                            id="planConsParcelasAntes"
                            value="0"
                            min="0"
                            step="0.01"
                            oninput="calcularMargemPlanilha()"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Margem disponível
                        </label>

                        <input
                            type="number"
                            id="planConsMargemDisponivel"
                            readonly
                        >

                    </div>

                </div>


                <div
                    id="planConsStatus"
                    class="status-consignado status-info"
                >
                    Informe os dados.
                </div>

            </div>

        </div>


        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Contrato
                </h2>

            </div>


            <div class="card-corpo">

                <div class="form-grid">

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
                            Número do contrato
                        </label>

                        <input
                            type="text"
                            id="planConsContrato"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Valor contratado
                        </label>

                        <input
                            type="number"
                            id="planConsValorContratado"
                            value="0"
                            step="0.01"
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

                </div>

            </div>

        </div>


        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Status do contrato
                </h2>

            </div>


            <div class="card-corpo">

                <div class="form-grid">

                    <div class="form-grupo">

                        <label>
                            Total de parcelas
                        </label>

                        <input
                            type="number"
                            id="planConsTotalParcelas"
                            min="0"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Parcelas quitadas
                        </label>

                        <input
                            type="number"
                            id="planConsQuitadas"
                            value="0"
                            min="0"
                            oninput="calcularParcelasRestantes()"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Parcelas restantes
                        </label>

                        <input
                            type="number"
                            id="planConsRestantes"
                            readonly
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Saldo devedor atualizado
                        </label>

                        <input
                            type="number"
                            id="planConsSaldo"
                            value="0"
                            step="0.01"
                        >

                    </div>

                </div>

            </div>

        </div>


        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Controle RH / DP
                </h2>

            </div>


            <div class="card-corpo">

                <div class="form-grid">

                    <div class="form-grupo">

                        <label>
                            Última atualização
                        </label>

                        <input
                            type="date"
                            id="planConsAtualizacao"
                            value="${dataAtual()}"
                        >

                    </div>


                    <div class="form-grupo">

                        <label>
                            Validação férias
                        </label>

                        <select id="planConsFerias">

                            <option value="Pendente">
                                Pendente
                            </option>

                            <option value="Validado">
                                Validado
                            </option>

                            <option value="Não se aplica">
                                Não se aplica
                            </option>

                        </select>

                    </div>


                    <div class="form-grupo">

                        <label>
                            Validação rescisão
                        </label>

                        <select id="planConsRescisao">

                            <option value="Pendente">
                                Pendente
                            </option>

                            <option value="Validado">
                                Validado
                            </option>

                            <option value="Não se aplica">
                                Não se aplica
                            </option>

                        </select>

                    </div>


                    <div class="form-grupo largo">

                        <label>
                            Observações
                        </label>

                        <input
                            type="text"
                            id="planConsObservacoes"
                        >

                    </div>

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
                        onclick="mostrarPlanilhaConsignado()"
                    >
                        Limpar
                    </button>

                </div>

            </div>

        </div>


        <!-- =================================================
             IMPORTAÇÃO DE CONSIGNADOS
        ================================================== -->

        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Importar planilha de consignado
                </h2>

                <p>
                    Importe vários contratos de uma única vez.
                </p>

            </div>


            <div class="card-corpo">

                <div class="form-grupo">

                    <label>
                        Arquivo da planilha
                    </label>

                    <input
                        type="file"
                        id="arquivoConsignado"
                        accept=".csv,.txt"
                    >

                </div>


                <div
                    style="
                        margin-top:15px;
                        padding:14px;
                        background:#f5f6f7;
                        border:1px solid #dddfe2;
                        border-radius:4px;
                        font-size:12px;
                        color:#555;
                        line-height:1.6;
                    "
                >

                    A planilha deve seguir a estrutura
                    gerada pela opção
                    <strong>Exportar consignados</strong>.

                </div>


                <div class="botoes">

                    <button
                        class="btn btn-principal"
                        onclick="importarConsignadoCSV()"
                    >
                        Importar consignados
                    </button>

                    <button
                        class="btn btn-secundario"
                        onclick="limparArquivoConsignado()"
                    >
                        Limpar arquivo
                    </button>

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

                <p>
                    Controle dos empréstimos consignados.
                </p>

            </div>


            <div class="card-corpo">

                <div class="tabela-container">

                    <table>

                        <thead>

                            <tr>

                                <th>Funcionário</th>
                                <th>Matrícula</th>
                                <th>Instituição</th>
                                <th>Contrato</th>
                                <th>Parcela</th>
                                <th>Restantes</th>
                                <th>Status</th>
                                <th>Ação</th>

                            </tr>

                        </thead>

                        <tbody id="tabelaConsignados">

                        </tbody>

                    </table>

                </div>


                <div class="botoes">

                    <button
                        class="btn btn-principal"
                        onclick="exportarConsignados()"
                    >
                        Exportar consignados
                    </button>

                </div>

            </div>

        </div>

    `;


    atualizarTabelaConsignados();
}


/* =========================================================
   PREENCHER FUNCIONÁRIO - CONSIGNADO
========================================================= */

function preencherConsignadoFuncionario() {

    const id =
        document.getElementById(
            "planConsFuncionario"
        ).value;


    const funcionario =
        funcionarios.find(
            item =>
                String(item.id) === String(id)
        );


    if (!funcionario) {

        document.getElementById(
            "planConsCPF"
        ).value = "";

        document.getElementById(
            "planConsMatricula"
        ).value = "";

        document.getElementById(
            "planConsBruto"
        ).value = "";

        calcularMargemPlanilha();

        return;
    }


    document.getElementById(
        "planConsCPF"
    ).value =
        funcionario.cpf || "";


    document.getElementById(
        "planConsMatricula"
    ).value =
        funcionario.matricula || "";


    document.getElementById(
        "planConsBruto"
    ).value =
        Number(funcionario.salario) || 0;


    calcularMargemPlanilha();
}


/* =========================================================
   CALCULAR MARGEM - PLANILHA
========================================================= */

function calcularMargemPlanilha() {

    const bruto =
        valorCampo("planConsBruto");

    const inss =
        valorCampo("planConsINSS");

    const irrf =
        valorCampo("planConsIRRF");

    const percentual =
        valorCampo("planConsPercentual");

    const parcelasAntes =
        valorCampo("planConsParcelasAntes");

    const parcelaNova =
        valorCampo("planConsParcela");


    const liquido =
        Math.max(
            bruto - inss - irrf,
            0
        );


    const margemMaxima =
        liquido *
        (percentual / 100);


    const margemDisponivel =
        Math.max(
            margemMaxima -
            parcelasAntes,
            0
        );


    document.getElementById(
        "planConsLiquido"
    ).value =
        liquido.toFixed(2);


    document.getElementById(
        "planConsMargemMaxima"
    ).value =
        margemMaxima.toFixed(2);


    document.getElementById(
        "planConsMargemDisponivel"
    ).value =
        margemDisponivel.toFixed(2);


    const total =
        parcelasAntes +
        parcelaNova;


    const regular =
        total <= margemMaxima;


    const status =
        document.getElementById(
            "planConsStatus"
        );


    if (!status) {
        return;
    }


    status.className =
        regular
            ? "status-consignado status-regular"
            : "status-consignado status-alerta";


    status.innerHTML = `

        <strong>

            ${regular
                ? "MARGEM REGULAR"
                : "MARGEM EXCEDIDA"}

        </strong>

        <div
            style="
                margin-top:6px;
                line-height:1.6;
            "
        >

            Margem máxima:
            <strong>
                ${moeda(margemMaxima)}
            </strong>

            <br>

            Margem disponível:
            <strong>
                ${moeda(margemDisponivel)}
            </strong>

            <br>

            Total de parcelas após o novo contrato:
            <strong>
                ${moeda(total)}
            </strong>

        </div>

    `;
}


/* =========================================================
   PARCELAS RESTANTES
========================================================= */

function calcularParcelasRestantes() {

    const total =
        valorCampo(
            "planConsTotalParcelas"
        );


    const quitadas =
        valorCampo(
            "planConsQuitadas"
        );


    const restantes =
        Math.max(
            total - quitadas,
            0
        );


    const campo =
        document.getElementById(
            "planConsRestantes"
        );


    if (campo) {
        campo.value = restantes;
    }
}


/* =========================================================
   SALVAR CONSIGNADO
========================================================= */

function salvarConsignado() {

    const funcionarioId =
        document.getElementById(
            "planConsFuncionario"
        ).value;


    if (!funcionarioId) {

        alert(
            "Selecione um funcionário."
        );

        return;
    }


    const funcionario =
        funcionarios.find(
            item =>
                String(item.id) ===
                String(funcionarioId)
        );


    if (!funcionario) {

        alert(
            "Funcionário não encontrado."
        );

        return;
    }


    calcularMargemPlanilha();

    calcularParcelasRestantes();


    const bruto =
        valorCampo("planConsBruto");

    const inss =
        valorCampo("planConsINSS");

    const irrf =
        valorCampo("planConsIRRF");

    const percentual =
        valorCampo("planConsPercentual");

    const parcelasAntes =
        valorCampo("planConsParcelasAntes");

    const parcelaMensal =
        valorCampo("planConsParcela");

    const liquido =
        Math.max(
            bruto - inss - irrf,
            0
        );

    const margemMaxima =
        liquido *
        (percentual / 100);

    const margemDisponivel =
        Math.max(
            margemMaxima -
            parcelasAntes,
            0
        );

    const totalParcelas =
        valorCampo(
            "planConsTotalParcelas"
        );

    const parcelasQuitadas =
        valorCampo(
            "planConsQuitadas"
        );

    const parcelasRestantes =
        Math.max(
            totalParcelas -
            parcelasQuitadas,
            0
        );

    const totalParcelasAtivas =
        parcelasAntes +
        parcelaMensal;


    const status =
        totalParcelasAtivas <=
        margemMaxima
            ? "REGULAR"
            : "MARGEM EXCEDIDA";


    const registro = {

        id:
            Date.now().toString(),

        funcionarioId:
            funcionario.id,

        nome:
            funcionario.nome,

        cpf:
            funcionario.cpf,

        matricula:
            funcionario.matricula,

        setor:
            document.getElementById(
                "planConsSetor"
            ).value.trim(),

        salarioBruto:
            bruto,

        inss:
            inss,

        irrf:
            irrf,

        salarioLiquidoBase:
            liquido,

        percentualMargem:
            percentual,

        margemMaxima:
            margemMaxima,

        parcelasAtivasAntes:
            parcelasAntes,

        parcelaMensal:
            parcelaMensal,

        totalParcelasAtivas:
            totalParcelasAtivas,

        margemDisponivel:
            margemDisponivel,

        instituicao:
            document.getElementById(
                "planConsInstituicao"
            ).value.trim(),

        contrato:
            document.getElementById(
                "planConsContrato"
            ).value.trim(),

        valorContratado:
            valorCampo(
                "planConsValorContratado"
            ),

        totalParcelas:
            totalParcelas,

        parcelasQuitadas:
            parcelasQuitadas,

        parcelasRestantes:
            parcelasRestantes,

        saldoDevedor:
            valorCampo(
                "planConsSaldo"
            ),

        status:
            status,

        ultimaAtualizacao:
            document.getElementById(
                "planConsAtualizacao"
            ).value,

        validacaoFerias:
            document.getElementById(
                "planConsFerias"
            ).value,

        validacaoRescisao:
            document.getElementById(
                "planConsRescisao"
            ).value,

        observacoes:
            document.getElementById(
                "planConsObservacoes"
            ).value.trim()

    };


    consignados.push(
        registro
    );


    salvarConsignados();


    alert(
        "Contrato consignado salvo com sucesso."
    );


    mostrarPlanilhaConsignado();
}


/* =========================================================
   TABELA DE CONSIGNADOS
========================================================= */

function atualizarTabelaConsignados() {

    const tabela =
        document.getElementById(
            "tabelaConsignados"
        );


    if (!tabela) {
        return;
    }


    if (consignados.length === 0) {

        tabela.innerHTML = `

            <tr>

                <td colspan="8">
                    Nenhum contrato consignado cadastrado.
                </td>

            </tr>

        `;

        return;
    }


    let html = "";


    consignados.forEach(item => {

        const alerta =
            item.status ===
            "MARGEM EXCEDIDA";


        html += `

            <tr
                class="${alerta
                    ? "linha-alerta"
                    : ""}"
            >

                <td>
                    ${escapar(item.nome)}
                </td>

                <td>
                    ${escapar(item.matricula)}
                </td>

                <td>
                    ${escapar(item.instituicao)}
                </td>

                <td>
                    ${escapar(item.contrato)}
                </td>

                <td>
                    ${moeda(item.parcelaMensal)}
                </td>

                <td>
                    ${item.parcelasRestantes}
                </td>

                <td>

                    <span
                        class="status-mini
                        ${alerta
                            ? "alerta"
                            : "regular"}"
                    >

                        ${escapar(item.status)}

                    </span>

                </td>

                <td>

                    <button
                        class="btn btn-secundario"
                        style="
                            height:32px;
                            padding:0 10px;
                        "
                        onclick="excluirConsignado('${item.id}')"
                    >
                        Excluir
                    </button>

                </td>

            </tr>

        `;

    });


    tabela.innerHTML = html;
}


/* =========================================================
   EXCLUIR CONSIGNADO
========================================================= */

function excluirConsignado(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir este contrato?"
        );


    if (!confirmar) {
        return;
    }


    consignados =
        consignados.filter(
            item =>
                String(item.id) !==
                String(id)
        );


    salvarConsignados();

    atualizarTabelaConsignados();
}


/* =========================================================
   EXPORTAR CONSIGNADOS
========================================================= */

function exportarConsignados() {

    if (consignados.length === 0) {

        alert(
            "Não existem contratos consignados para exportar."
        );

        return;
    }


    const cabecalho = [

        "Nome",
        "CPF",
        "Matrícula",
        "Setor",
        "Salário bruto",
        "INSS",
        "IRRF",
        "Salário líquido base",
        "% margem",
        "Margem máxima",
        "Parcelas ativas antes",
        "Parcela mensal",
        "Total parcelas ativas",
        "Margem disponível",
        "Instituição",
        "Contrato",
        "Valor contratado",
        "Total parcelas",
        "Parcelas quitadas",
        "Parcelas restantes",
        "Saldo devedor",
        "Status",
        "Última atualização",
        "Validação férias",
        "Validação rescisão",
        "Observações"

    ];


    let csv =
        cabecalho.join(";") +
        "\n";


    consignados.forEach(item => {

        const linha = [

            item.nome,
            item.cpf,
            item.matricula,
            item.setor,

            item.salarioBruto,
            item.inss,
            item.irrf,
            item.salarioLiquidoBase,

            item.percentualMargem,
            item.margemMaxima,

            item.parcelasAtivasAntes,
            item.parcelaMensal,
            item.totalParcelasAtivas,
            item.margemDisponivel,

            item.instituicao,
            item.contrato,
            item.valorContratado,

            item.totalParcelas,
            item.parcelasQuitadas,
            item.parcelasRestantes,

            item.saldoDevedor,
            item.status,
            item.ultimaAtualizacao,

            item.validacaoFerias,
            item.validacaoRescisao,
            item.observacoes

        ];


        csv += linha
            .map(valor => {

                if (
                    typeof valor === "number"
                ) {

                    return csvCampo(
                        valor
                            .toFixed(2)
                            .replace(".", ",")
                    );

                }

                return csvCampo(valor);

            })
            .join(";") +
            "\n";

    });


    baixarCSV(
        csv,
        "consignados.csv"
    );
}


/* =========================================================
   IMPORTAR CONSIGNADOS
========================================================= */

function importarConsignadoCSV() {

    const campo =
        document.getElementById(
            "arquivoConsignado"
        );


    const resultado =
        document.getElementById(
            "resultadoImportacaoConsignado"
        );


    if (
        !campo ||
        !campo.files ||
        !campo.files.length
    ) {

        alert(
            "Selecione uma planilha de consignado."
        );

        return;
    }


    const arquivo =
        campo.files[0];


    const leitor =
        new FileReader();


    leitor.onload = function(evento) {

        try {

            const linhas =
                separarCSV(
                    evento.target.result
                );


            if (linhas.length < 2) {

                resultado.innerHTML = `

                    <div class="status-consignado status-alerta">

                        A planilha não possui dados
                        para importar.

                    </div>

                `;

                return;
            }


            let cadastrados = 0;
            let ignorados = 0;
            let invalidos = 0;


            for (
                let i = 1;
                i < linhas.length;
                i++
            ) {

                const linha =
                    linhas[i];


                if (
                    !linha ||
                    linha.length === 0
                ) {
                    continue;
                }


                if (linha.length < 26) {

                    invalidos++;

                    continue;
                }


                const nome =
                    String(linha[0] || "").trim();

                const cpf =
                    String(linha[1] || "").trim();

                const matricula =
                    String(linha[2] || "").trim();


                if (
                    !nome ||
                    !matricula
                ) {

                    invalidos++;

                    continue;
                }


                /*
                 * Procura o funcionário pela matrícula.
                 */

                const funcionario =
                    encontrarFuncionarioPorMatricula(
                        matricula
                    );


                if (!funcionario) {

                    invalidos++;

                    continue;
                }


                /*
                 * Evita importar exatamente
                 * o mesmo contrato novamente.
                 */

                const contrato =
                    String(
                        linha[15] || ""
                    ).trim();


                const instituicao =
                    String(
                        linha[14] || ""
                    ).trim();


                const duplicado =
                    consignados.some(item => {

                        return (

                            String(
                                item.matricula
                            ) === String(
                                matricula
                            )

                            &&

                            String(
                                item.contrato
                            ) === String(
                                contrato
                            )

                            &&

                            String(
                                item.instituicao
                            ) === String(
                                instituicao
                            )

                        );

                    });


                if (duplicado) {

                    ignorados++;

                    continue;
                }


                const registro = {

                    id:
                        Date.now().toString() +
                        "_" +
                        i,

                    funcionarioId:
                        funcionario.id,

                    nome:
                        nome,

                    cpf:
                        cpf,

                    matricula:
                        matricula,

                    setor:
                        String(
                            linha[3] || ""
                        ).trim(),

                    salarioBruto:
                        converterNumeroCSV(
                            linha[4]
                        ),

                    inss:
                        converterNumeroCSV(
                            linha[5]
                        ),

                    irrf:
                        converterNumeroCSV(
                            linha[6]
                        ),

                    salarioLiquidoBase:
                        converterNumeroCSV(
                            linha[7]
                        ),

                    percentualMargem:
                        converterNumeroCSV(
                            linha[8]
                        ),

                    margemMaxima:
                        converterNumeroCSV(
                            linha[9]
                        ),

                    parcelasAtivasAntes:
                        converterNumeroCSV(
                            linha[10]
                        ),

                    parcelaMensal:
                        converterNumeroCSV(
                            linha[11]
                        ),

                    totalParcelasAtivas:
                        converterNumeroCSV(
                            linha[12]
                        ),

                    margemDisponivel:
                        converterNumeroCSV(
                            linha[13]
                        ),

                    instituicao:
                        instituicao,

                    contrato:
                        contrato,

                    valorContratado:
                        converterNumeroCSV(
                            linha[16]
                        ),

                    totalParcelas:
                        converterNumeroCSV(
                            linha[17]
                        ),

                    parcelasQuitadas:
                        converterNumeroCSV(
                            linha[18]
                        ),

                    parcelasRestantes:
                        converterNumeroCSV(
                            linha[19]
                        ),

                    saldoDevedor:
                        converterNumeroCSV(
                            linha[20]
                        ),

                    status:
                        String(
                            linha[21] || ""
                        ).trim(),

                    ultimaAtualizacao:
                        String(
                            linha[22] || ""
                        ).trim(),

                    validacaoFerias:
                        String(
                            linha[23] || ""
                        ).trim(),

                    validacaoRescisao:
                        String(
                            linha[24] || ""
                        ).trim(),

                    observacoes:
                        String(
                            linha[25] || ""
                        ).trim()

                };


                consignados.push(
                    registro
                );


                cadastrados++;
            }


            salvarConsignados();

            atualizarTabelaConsignados();


            resultado.innerHTML = `

                <div
                    style="
                        padding:16px;
                        border:1px solid #c9dfd1;
                        background:#edf6f0;
                        border-radius:4px;
                        color:#1f6b45;
                        line-height:1.7;
                    "
                >

                    <strong>
                        Importação concluída
                    </strong>

                    <br><br>

                    ${cadastrados}
                    contrato(s) importado(s)

                    <br>

                    ${ignorados}
                    contrato(s) duplicado(s)
                    ignorado(s)

                    <br>

                    ${invalidos}
                    linha(s) inválida(s)
                    ou funcionário não encontrado

                </div>

            `;


            campo.value = "";


        } catch (erro) {

            console.error(
                "Erro na importação de consignados:",
                erro
            );


            resultado.innerHTML = `

                <div class="status-consignado status-alerta">

                    Não foi possível ler a planilha.
                    Verifique se ela foi gerada pelo
                    sistema ou se está no formato CSV correto.

                </div>

            `;
        }

    };


    leitor.readAsText(
        arquivo,
        "UTF-8"
    );
}


/* =========================================================
   LIMPAR ARQUIVO CONSIGNADO
========================================================= */

function limparArquivoConsignado() {

    const campo =
        document.getElementById(
            "arquivoConsignado"
        );


    const resultado =
        document.getElementById(
            "resultadoImportacaoConsignado"
        );


    if (campo) {
        campo.value = "";
    }


    if (resultado) {
        resultado.innerHTML = "";
    }
}


/* =========================================================
   LOCALIZAR FUNCIONÁRIO
========================================================= */

function encontrarFuncionarioPorMatricula(
    matricula
) {

    const procurada =
        normalizarIdentificacao(
            matricula
        );


    return funcionarios.find(
        funcionario => {

            return (
                normalizarIdentificacao(
                    funcionario.matricula
                ) === procurada
            );

        }
    );
}


/* =========================================================
   CSV
========================================================= */

function csvCampo(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {
        return "";
    }


    let texto =
        String(valor);


    /*
     * Escapa aspas para CSV.
     */

    texto =
        texto.replace(
            /"/g,
            '""'
        );


    /*
     * Coloca entre aspas quando necessário.
     */

    if (
        texto.includes(";") ||
        texto.includes('"') ||
        texto.includes("\n")
    ) {

        return `"${texto}"`;

    }


    return texto;
}


/* =========================================================
   PARSER CSV
========================================================= */

function separarCSV(texto) {

    const linhas = [];

    let linha = [];

    let campo = "";

    let dentroAspas = false;


    for (
        let i = 0;
        i < texto.length;
        i++
    ) {

        const caractere =
            texto[i];


        if (caractere === '"') {

            /*
             * Aspas duplas dentro de um campo.
             */

            if (
                dentroAspas &&
                texto[i + 1] === '"'
            ) {

                campo += '"';

                i++;

            } else {

                dentroAspas =
                    !dentroAspas;

            }

            continue;
        }


        if (
            caractere === ";" &&
            !dentroAspas
        ) {

            linha.push(campo);

            campo = "";

            continue;
        }


        if (
            (
                caractere === "\n" ||
                caractere === "\r"
            ) &&
            !dentroAspas
        ) {

            if (
                caractere === "\r" &&
                texto[i + 1] === "\n"
            ) {

                i++;

            }


            linha.push(campo);

            campo = "";


            linhas.push(linha);

            linha = [];

            continue;
        }


        campo += caractere;
    }


    /*
     * Último campo.
     */

    linha.push(campo);


    if (
        linha.length > 1 ||
        linha[0] !== ""
    ) {

        linhas.push(linha);

    }


    return linhas;
}


/* =========================================================
   CONVERTER NÚMERO DA PLANILHA
========================================================= */

function converterNumeroCSV(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {
        return 0;
    }


    if (
        typeof valor === "number"
    ) {
        return valor;
    }


    let texto =
        String(valor)
            .trim()
            .replace(/R\$/gi, "")
            .replace(/\s/g, "");


    if (!texto) {
        return 0;
    }


    /*
     * Formato brasileiro:
     * 1.234,56
     */

    if (texto.includes(",")) {

        texto =
            texto
                .replace(/\./g, "")
                .replace(",", ".");

    }


    const resultado =
        parseFloat(texto);


    return isNaN(resultado)
        ? 0
        : resultado;
}


/* =========================================================
   BAIXAR CSV
========================================================= */

function baixarCSV(
    conteudo,
    nomeArquivo
) {

    /*
     * BOM para Excel reconhecer
     * caracteres acentuados.
     */

    const blob =
        new Blob(
            [
                "\uFEFF",
                conteudo
            ],
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
        nomeArquivo;


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );
}


/* =========================================================
   FOLHA DE PAGAMENTO
========================================================= */

function mostrarFolha() {

    titulo(
        "Folha de pagamento",
        "Módulo de cálculo da folha de pagamento"
    );


    document.getElementById(
        "areaConteudo"
    ).innerHTML = `

        <div class="card">

            <div class="card-cabecalho">

                <h2>
                    Folha de pagamento
                </h2>

                <p>
                    Módulo preparado para os cálculos
                    da folha.
                </p>

            </div>


            <div class="card-corpo">

                <div
                    style="
                        padding:20px;
                        background:#f5f6f7;
                        border:1px solid #dddfe2;
                        border-radius:4px;
                        color:#555;
                        line-height:1.6;
                    "
                >

                    O módulo de folha de pagamento
                    será desenvolvido nesta área.

                </div>

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

        /*
         * Abre Férias inicialmente.
         */

        mostrarFerias();

    }
);