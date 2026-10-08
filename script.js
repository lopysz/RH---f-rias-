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


        const lista =
            JSON.parse(dados);


        return Array.isArray(lista)
            ? lista
            : [];


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
   BANCO LOCAL DE CONSIGNADOS
========================================================= */

let consignados = carregarConsignados();



function carregarConsignados() {

    try {

        const dados =
            localStorage.getItem(
                "pranchetaConsignados"
            );


        if (!dados) {

            return [];

        }


        const lista =
            JSON.parse(dados);


        return Array.isArray(lista)
            ? lista
            : [];


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
   UTILITÁRIOS
========================================================= */

function moeda(valor) {

    valor =
        Number(valor) || 0;


    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}



function numero(valor) {

    const n =
        Number(valor);


    return Number.isFinite(n)
        ? n
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



function atualizarTexto(id, texto) {

    const elemento =
        document.getElementById(id);


    if (elemento) {

        elemento.textContent =
            texto;

    }

}



function escapar(texto) {

    if (
        texto === null ||
        texto === undefined
    ) {

        return "";

    }


    return String(texto)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}



function dataAtual() {

    const agora =
        new Date();


    const ano =
        agora.getFullYear();


    const mes =
        String(
            agora.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const dia =
        String(
            agora.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${ano}-${mes}-${dia}`;

}



function formatarData(data) {

    if (!data) {

        return "-";

    }


    const partes =
        String(data).split("-");


    if (
        partes.length !== 3
    ) {

        return data;

    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}



/* =========================================================
   TÍTULO
========================================================= */

function titulo(
    principal,
    secundario
) {

    atualizarTexto(
        "tituloPagina",
        principal
    );


    atualizarTexto(
        "subtituloPagina",
        secundario
    );

}



/* =========================================================
   NAVEGAÇÃO
========================================================= */

function abrirPagina(
    nome,
    botao
) {


    document
        .querySelectorAll(".menu-item")
        .forEach(function(item) {

            item.classList.remove(
                "ativo"
            );

        });



    if (botao) {

        botao.classList.add(
            "ativo"
        );

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



        case "importarFuncionarios":

            mostrarImportarFuncionarios();

            break;



        case "importarConsignado":

            mostrarImportarConsignado();

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
        "Cadastro e manutenção dos dados funcionais"
    );



    document.getElementById(
        "areaConteudo"
    ).innerHTML = `


        <div class="card">


            <div class="card-cabecalho">

                <h2>
                    Novo funcionário
                </h2>


                <p>
                    Preencha os dados básicos do funcionário.
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
                            placeholder="Nome completo"
                        >

                    </div>



                    <div class="form-grupo">

                        <label>
                            CPF
                        </label>


                        <input
                            type="text"
                            id="cadCpf"
                            placeholder="000.000.000-00"
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
                            min="0"
                            step="0.01"
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
                        onclick="mostrarCadastro()"
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
        document
            .getElementById("cadNome")
            .value
            .trim();


    const cpf =
        document
            .getElementById("cadCpf")
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
        valorCampo("cadSalario");


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



    const funcionario = {


        id:
            "FUNC-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 8),


        nome:
            nome,


        cpf:
            cpf,


        matricula:
            matricula,


        cargo:
            cargo,


        salario:
            salario,


        admissao:
            admissao

    };



    funcionarios.push(
        funcionario
    );


    salvarFuncionarios();



    alert(
        "Funcionário cadastrado com sucesso."
    );



    mostrarFuncionarios();

}



/* =========================================================
   FUNCIONÁRIOS
========================================================= */

function mostrarFuncionarios() {


    titulo(
        "Funcionários",
        "Cadastro geral de funcionários"
    );



    let linhas = "";



    if (
        funcionarios.length === 0
    ) {


        linhas = `

            <tr>

                <td colspan="7">

                    Nenhum funcionário cadastrado.

                </td>

            </tr>

        `;


    } else {


        linhas =
            funcionarios
                .map(function(funcionario) {


                    return `

                        <tr>


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
                                    funcionario.matricula
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
                                    class="btn btn-principal"
                                    onclick="abrirFeriasFuncionario('${funcionario.id}')"
                                >
                                    Calcular férias
                                </button>

                            </td>


                        </tr>

                    `;

                })
                .join("");

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

                    Total de funcionários:
                    <strong>
                        ${funcionarios.length}
                    </strong>

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
                                <th>Ações</th>

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
   FÉRIAS
========================================================= */

function mostrarFerias(
    funcionarioId = ""
) {


    titulo(
        "Férias",
        "Cálculo completo da remuneração de férias"
    );



    let opcoes = `

        <option value="">
            Selecione um funcionário
        </option>

    `;



    funcionarios.forEach(
        function(funcionario) {


            opcoes += `

                <option
                    value="${funcionario.id}"
                    ${
                        funcionario.id === funcionarioId
                            ? "selected"
                            : ""
                    }
                >

                    ${escapar(
                        funcionario.nome
                    )}

                    -

                    Matrícula
                    ${escapar(
                        funcionario.matricula
                    )}

                </option>

            `;

        }
    );



    document.getElementById(
        "areaConteudo"
    ).innerHTML = `


        <div class="card">


            <div class="card-cabecalho">

                <h2>
                    Funcionário
                </h2>


                <p>
                    Selecione o funcionário para iniciar o cálculo.
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
                            Início do período aquisitivo
                        </label>


                        <input
                            type="date"
                            id="feriasInicio"
                        >

                    </div>



                    <div class="form-grupo">

                        <label>
                            Fim do período aquisitivo
                        </label>


                        <input
                            type="date"
                            id="feriasFim"
                        >

                    </div>



                    <div class="form-grupo">

                        <label>
                            Dias de direito
                        </label>


                        <input
                            type="number"
                            id="feriasDireito"
                            value="30"
                            readonly
                        >

                    </div>



                    <div class="form-grupo">

                        <label>
                            Dias de férias
                        </label>


                        <input
                            type="number"
                            id="feriasDias"
                            value="30"
                            min="0"
                            max="30"
                            oninput="calcularBruto()"
                        >

                    </div>



                    <div class="form-grupo">

                        <label>
                            Faltas injustificadas
                        </label>


                        <input
                            type="number"
                            id="feriasFaltas"
                            value="0"
                            min="0"
                            oninput="calcularDireito()"
                        >

                    </div>



                    <div class="form-grupo">

                        <label>
                            Dias vendidos
                        </label>


                        <input
                            type="number"
                            id="feriasVendidos"
                            value="0"
                            min="0"
                            max="10"
                            oninput="calcularBruto()"
                        >

                    </div>



                    <div class="form-grupo">

                        <label>
                            Dependentes
                        </label>


                        <input
                            type="number"
                            id="feriasDependentes"
                            value="0"
                            min="0"
                        >

                    </div>


                </div>



                <div
                    id="feriasFuncionarioSelecionado"
                    class="funcionario-selecionado"
                ></div>


            </div>


        </div>



        <div class="card">


            <div class="card-cabecalho">

                <h2>
                    Remuneração
                </h2>


                <p>
                    Componentes utilizados no cálculo.
                </p>

            </div>



            <div class="card-corpo">


                <div class="componentes-grid">


                    <div class="componente">

                        <label>
                            Salário
                        </label>


                        <input
                            type="number"
                            id="feriasSalario"
                            value="0"
                            min="0"
                            step="0.01"
                            oninput="calcularBruto()"
                        >

                    </div>



                    <div class="componente">

                        <label>
                            Média de horas extras
                        </label>


                        <input
                            type="number"
                            id="feriasHorasExtras"
                            value="0"
                            min="0"
                            step="0.01"
                            oninput="calcularBruto()"
                        >

                    </div>



                    <div class="componente">

                        <label>
                            Adicional noturno
                        </label>


                        <input
                            type="number"
                            id="feriasNoturno"
                            value="0"
                            min="0"
                            step="0.01"
                            oninput="calcularBruto()"
                        >

                    </div>



                    <div class="componente">

                        <label>
                            Comissões / Prêmios
                        </label>


                        <input
                            type="number"
                            id="feriasComissoes"
                            value="0"
                            min="0"
                            step="0.01"
                            oninput="calcularBruto()"
                        >

                    </div>



                    <div class="componente">

                        <label>
                            DSR
                        </label>


                        <input
                            type="number"
                            id="feriasDsr"
                            value="0"
                            min="0"
                            step="0.01"
                            oninput="calcularBruto()"
                        >

                    </div>



                    <div class="componente">

                        <label>
                            Periculosidade
                        </label>


                        <input
                            type="number"
                            id="feriasPericulosidade"
                            value="0"
                            min="0"
                            step="0.01"
                            oninput="calcularBruto()"
                        >

                    </div>



                    <div class="componente">

                        <label>
                            Insalubridade
                        </label>


                        <input
                            type="number"
                            id="feriasInsalubridade"
                            value="0"
                            min="0"
                            step="0.01"
                            oninput="calcularBruto()"
                        >

                    </div>


                </div>



                <div class="total-bruto">


                    <div class="descricao">

                        Remuneração bruta de férias

                    </div>


                    <div
                        class="numero"
                        id="feriasBruto"
                    >

                        R$ 0,00

                    </div>


                </div>


            </div>


        </div>



        <div class="card">


            <div class="card-cabecalho">

                <h2>
                    Descontos
                </h2>


                <p>
                    Informe os descontos aplicáveis.
                </p>

            </div>



            <div class="card-corpo">


                <div class="componentes-grid">


                    ${campoDesconto(
                        "feriasInss",
                        "INSS"
                    )}


                    ${campoDesconto(
                        "feriasIrrf",
                        "IRRF"
                    )}


                    ${campoDesconto(
                        "feriasConsignado",
                        "Consignado"
                    )}


                    ${campoDesconto(
                        "feriasPensao",
                        "Pensão"
                    )}


                    ${campoDesconto(
                        "feriasAdiantamento",
                        "Adiantamento"
                    )}


                    ${campoDesconto(
                        "feriasAlimentacao",
                        "Alimentação"
                    )}


                    ${campoDesconto(
                        "feriasVT",
                        "Vale-transporte"
                    )}


                    ${campoDesconto(
                        "feriasSaude",
                        "Plano de saúde"
                    )}


                    ${campoDesconto(
                        "feriasDental",
                        "Plano odontológico"
                    )}


                    ${campoDesconto(
                        "feriasOutros",
                        "Outros"
                    )}


                </div>


            </div>


        </div>

    `;



    if (funcionarioId) {

        selecionarFuncionarioFerias();

    }

}



function campoDesconto(
    id,
    nome
) {

    return `

        <div class="componente">

            <label>
                ${nome}
            </label>


            <input
                type="number"
                id="${id}"
                value="0"
                min="0"
                step="0.01"
                oninput="calcularBruto()"
            >

        </div>

    `;

}



function selecionarFuncionarioFerias() {


    const id =
        document
            .getElementById(
                "feriasFuncionario"
            )
            .value;



    const funcionario =
        funcionarios.find(
            function(item) {

                return item.id === id;

            }
        );



    const area =
        document.getElementById(
            "feriasFuncionarioSelecionado"
        );



    if (!funcionario) {

        area.classList.remove(
            "mostrar"
        );

        return;

    }



    document.getElementById(
        "feriasSalario"
    ).value =
        funcionario.salario || 0;



    area.innerHTML = `


        <strong>

            ${escapar(
                funcionario.nome
            )}

        </strong>


        <div class="funcionario-info">


            <span>

                <strong>
                    Matrícula:
                </strong>

                ${escapar(
                    funcionario.matricula
                )}

            </span>



            <span>

                <strong>
                    CPF:
                </strong>

                ${escapar(
                    funcionario.cpf
                )}

            </span>



            <span>

                <strong>
                    Cargo:
                </strong>

                ${escapar(
                    funcionario.cargo
                )}

            </span>



            <span>

                <strong>
                    Salário:
                </strong>

                ${moeda(
                    funcionario.salario
                )}

            </span>


        </div>

    `;



    area.classList.add(
        "mostrar"
    );


    calcularBruto();

}



function abrirFeriasFuncionario(
    id
) {

    mostrarFerias(id);

}



function calcularDireito() {


    const faltas =
        valorCampo(
            "feriasFaltas"
        );


    let direito = 30;



    if (faltas >= 33) {

        direito = 0;

    }

    else if (faltas >= 24) {

        direito = 12;

    }

    else if (faltas >= 15) {

        direito = 18;

    }

    else if (faltas >= 6) {

        direito = 24;

    }



    const campo =
        document.getElementById(
            "feriasDireito"
        );


    if (campo) {

        campo.value =
            direito;

    }



    const dias =
        document.getElementById(
            "feriasDias"
        );


    if (dias) {


        if (
            Number(dias.value) >
            direito
        ) {

            dias.value =
                direito;

        }


        dias.max =
            direito;

    }



    calcularBruto();

}



function calcularBruto() {


    const salario =
        valorCampo(
            "feriasSalario"
        );


    const horasExtras =
        valorCampo(
            "feriasHorasExtras"
        );


    const noturno =
        valorCampo(
            "feriasNoturno"
        );


    const comissoes =
        valorCampo(
            "feriasComissoes"
        );


    const dsr =
        valorCampo(
            "feriasDsr"
        );


    const periculosidade =
        valorCampo(
            "feriasPericulosidade"
        );


    const insalubridade =
        valorCampo(
            "feriasInsalubridade"
        );


    const dias =
        valorCampo(
            "feriasDias"
        );


    const vendidos =
        valorCampo(
            "feriasVendidos"
        );



    const base =

        salario +
        horasExtras +
        noturno +
        comissoes +
        dsr +
        periculosidade +
        insalubridade;



    const valorFerias =
        (base / 30) *
        dias;



    const umTerco =
        valorFerias / 3;



    const valorVendidos =
        (base / 30) *
        vendidos;



    const umTercoVendidos =
        valorVendidos / 3;



    const bruto =

        valorFerias +
        umTerco +
        valorVendidos +
        umTercoVendidos;



    atualizarTexto(
        "feriasBruto",
        moeda(bruto)
    );

}



/* =========================================================
   PLANILHAS DE FUNCIONÁRIOS
========================================================= */

function mostrarPlanilhas() {


    titulo(
        "Planilhas de funcionários",
        "Controle e exportação dos dados cadastrais"
    );



    document.getElementById(
        "areaConteudo"
    ).innerHTML = `


        <div class="card">


            <div class="card-cabecalho">

                <h2>
                    Planilhas
                </h2>


                <p>

                    Utilize a exportação para gerar
                    uma planilha dos funcionários cadastrados.

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


    if (
        funcionarios.length === 0
    ) {

        alert(
            "Não existem funcionários cadastrados."
        );

        return;

    }



    const cabecalho = [

        "Nome",
        "CPF",
        "Matrícula",
        "Cargo",
        "Salário",
        "Admissão"

    ];



    const linhas =
        funcionarios.map(
            function(f) {

                return [

                    f.nome || "",
                    f.cpf || "",
                    f.matricula || "",
                    f.cargo || "",
                    f.salario || 0,
                    f.admissao || ""

                ];

            }
        );



    const csv = [

        cabecalho,
        ...linhas

    ]

    .map(
        function(linha) {

            return linha

                .map(
                    function(valor) {

                        return `"${String(valor)
                            .replace(
                                /"/g,
                                '""'
                            )}"`;

                    }
                )

                .join(";");

        }
    )

    .join("\n");



    const blob =
        new Blob(
            [
                "\uFEFF" + csv
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


    link.href =
        url;


    link.download =
        "funcionarios_prancheta_rh.csv";


    link.click();


    URL.revokeObjectURL(
        url
    );

}



/* =========================================================
   EMPRÉSTIMO CONSIGNADO
========================================================= */

function mostrarConsignado() {


    titulo(
        "Empréstimo consignado",
        "Consulta e cálculo de empréstimos consignados"
    );



    let opcoes = `

        <option value="">
            Selecione um funcionário
        </option>

    `;



    funcionarios.forEach(
        function(funcionario) {

            opcoes += `

                <option
                    value="${funcionario.id}"
                >

                    ${escapar(
                        funcionario.nome
                    )}

                    -

                    ${escapar(
                        funcionario.matricula
                    )}

                </option>

            `;

        }
    );



    document.getElementById(
        "areaConteudo"
    ).innerHTML = `


        <div class="card">


            <div class="card-cabecalho">

                <h2>
                    Empréstimo consignado
                </h2>


                <p>

                    Consulta rápida dos funcionários cadastrados.

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
                        >

                            ${opcoes}

                        </select>

                    </div>


                </div>



                <div class="botoes">


                    <button
                        class="btn btn-principal"
                        onclick="mostrarPlanilhaConsignado()"
                    >

                        Abrir planilha consignado

                    </button>


                </div>


            </div>


        </div>

    `;

}



/* =========================================================
   PLANILHA CONSIGNADO
========================================================= */

function mostrarPlanilhaConsignado() {


    titulo(
        "Planilha consignado",
        "Controle operacional dos empréstimos consignados"
    );



    let opcoes = `

        <option value="">
            Selecione um funcionário
        </option>

    `;



    funcionarios.forEach(
        function(funcionario) {


            opcoes += `

                <option
                    value="${funcionario.id}"
                >

                    ${escapar(
                        funcionario.nome
                    )}

                    -

                    Matrícula
                    ${escapar(
                        funcionario.matricula
                    )}

                </option>

            `;

        }
    );



    document.getElementById(
        "areaConteudo"
    ).innerHTML = `


        <!-- IDENTIFICAÇÃO -->


        <div class="card">


            <div class="card-cabecalho">

                <h2>
                    1. Identificação
                </h2>


                <p>

                    Dados do funcionário vinculado ao contrato.

                </p>

            </div>



            <div class="card-corpo">


                <div class="form-grid">


                    <div class="form-grupo largo">

                        <label>
                            Funcionário
                        </label>


                        <select
                            id="consFuncionario"
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
                            id="consCpf"
                            readonly
                        >

                    </div>



                    <div class="form-grupo">

                        <label>
                            Matrícula
                        </label>


                        <input
                            type="text"
                            id="consMatricula"
                            readonly
                        >

                    </div>



                    <div class="form-grupo">

                        <label>
                            Setor
                        </label>


                        <input
                            type="text"
                            id="consSetor"
                            placeholder="Departamento / setor"
                        >

                    </div>


                </div>


            </div>


        </div>



        <!-- BASE -->


        <div class="card">


            <div class="card-cabecalho">

                <h2>
                    2. Base para margem
                </h2>


                <p>

                    A base é calculada a partir do salário bruto
                    menos os descontos informados.

                </p>

            </div>



            <div class="card-corpo">


                <div class="form-grid">


                    <div class="form-grupo">

                        <label>
                            Salário bruto contratual
                        </label>


                        <input
                            type="number"
                            id="consSalarioBruto"
                            min="0"
                            step="0.01"
                            oninput="calcularMargemConsignado()"
                        >

                    </div>



                    <div class="form-grupo">

                        <label>
                            INSS
                        </label>


                        <input
                            type="number"
                            id="consInss"
                            value="0"
                            min="0"
                            step="0.01"
                            oninput="calcularMargemConsignado()"
                        >

                    </div>



                    <div class="form-grupo">

                        <label>
                            IRRF
                        </label>


                        <input
                            type="number"
                            id="consIrrf"
                            value="0"
                            min="0"
                            step="0.01"
                            oninput="calcularMargemConsignado()"
                        >

                    </div>



                    <div class="form-grupo">

                        <label>
                            Salário líquido de base
                        </label>


                        <input
                            type="text"
                            id="consLiquido"
                            readonly
                        >

                    </div>


                </div>


            </div>


        </div>



        <!-- MARGEM -->


        <div class="card">


            <div class="card-cabecalho">

                <h2>
                    3. Margem consignável
                </h2>


                <p>

                    Percentual configurável para validação interna.

                </p>

            </div>



            <div class="card-corpo">


                <div class="form-grid">


                    <div class="form-grupo">

                        <label>
                            Percentual de margem
                        </label>


                        <input
                            type="number"
                            id="consPercentual"
                            value="35"
                            min="0"
                            max="100"
                            step="0.01"
                            oninput="calcularMargemConsignado()"
                        >

                    </div>



                    <div class="form-grupo">

                        <label>
                            Limite máximo da margem
                        </label>


                        <input
                            type="text"
                            id="consMargemMaxima"
                            readonly
                        >

                    </div>



                    <div class="form-grupo">

                        <label>
                            Parcelas ativas antes deste contrato
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



                    <div class="form-grupo">

                        <label>
                            Margem disponível antes do contrato
                        </label>


                        <input
                            type="text"
                            id="consMargemDisponivel"
                            readonly
                        >

                    </div>


                </div>



                <div
                    id="consStatusMargem"
                    class="status-consignado status-info"
                >

                    Informe os valores para validar a margem.

                </div>


            </div>


        </div>



        <!-- CONTRATO -->


        <div class="card">


            <div class="card-cabecalho">

                <h2>
                    4. Contrato
                </h2>


                <p>

                    Dados do empréstimo consignado.

                </p>

            </div>



            <div class="card-corpo">


                <div class="form-grid">


                    <div class="form-grupo">

                        <label>
                            Instituição financeira
                        </label>


                        <input
                            type="text"
                            id="consInstituicao"
                            placeholder="Banco / instituição"
                        >

                    </div>



                    <div class="form-grupo">

                        <label>
                            Número do contrato
                        </label>


                        <input
                            type="text"
                            id="consContrato"
                            placeholder="Número do contrato"
                        >

                    </div>



                    <div class="form-grupo">

                        <label>
                            Valor total contratado
                        </label>


                        <input
                            type="number"
                            id="consValorContratado"
                            value="0"
                            min="0"
                            step="0.01"
                        >

                    </div>



                    <div class="form-grupo">

                        <label>
                            Parcela mensal deste contrato
                        </label>


                        <input
                            type="number"
                            id="consParcela"
                            value="0"
                            min="0"
                            step="0.01"
                            oninput="calcularMargemConsignado()"
                        >

                    </div>


                </div>


            </div>


        </div>



        <!-- STATUS -->


        <div class="card">


            <div class="card-cabecalho">

                <h2>
                    5. Status do contrato
                </h2>


                <p>

                    Controle das parcelas e do saldo devedor.

                </p>

            </div>



            <div class="card-corpo">


                <div class="form-grid">


                    <div class="form-grupo">

                        <label>
                            Total de parcelas
                        </label>


                        <input
                            type="number"
                            id="consTotalParcelas"
                            value="0"
                            min="0"
                            step="1"
                            oninput="calcularParcelasRestantes()"
                        >

                    </div>



                    <div class="form-grupo">

                        <label>
                            Parcelas quitadas
                        </label>


                        <input
                            type="number"
                            id="consParcelasQuitadas"
                            value="0"
                            min="0"
                            step="1"
                            oninput="calcularParcelasRestantes()"
                        >

                    </div>



                    <div class="form-grupo">

                        <label>
                            Parcelas restantes
                        </label>


                        <input
                            type="number"
                            id="consParcelasRestantes"
                            readonly
                        >

                    </div>



                    <div class="form-grupo">

                        <label>
                            Saldo devedor atualizado
                        </label>


                        <input
                            type="number"
                            id="consSaldoDevedor"
                            value="0"
                            min="0"
                            step="0.01"
                        >

                    </div>


                </div>


            </div>


        </div>



        <!-- CONTROLE -->


        <div class="card">


            <div class="card-cabecalho">

                <h2>
                    6. Controle RH / DP
                </h2>


                <p>

                    Validações para folha, férias e rescisão.

                </p>

            </div>



            <div class="card-corpo">


                <div class="form-grid">


                    <div class="form-grupo">

                        <label>
                            Última atualização
                        </label>


                        <input
                            type="date"
                            id="consAtualizacao"
                            value="${dataAtual()}"
                        >

                    </div>



                    <div class="form-grupo">

                        <label>
                            Validação para férias
                        </label>


                        <select
                            id="consFerias"
                        >

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
                            Validação para rescisão
                        </label>


                        <select
                            id="consRescisao"
                        >

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
                            id="consObservacoes"
                            placeholder="Observações do RH / Departamento Pessoal"
                        >

                    </div>


                </div>



                <div class="botoes">


                    <button
                        class="btn btn-principal"
                        onclick="salvarConsignado()"
                    >

                        Salvar registro

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



        <!-- REGISTROS -->


        <div class="card">


            <div class="card-cabecalho">

                <h2>
                    7. Registros de consignado
                </h2>


                <p>

                    Controle geral dos contratos cadastrados.

                </p>

            </div>



            <div class="card-corpo">


                <div class="botoes">


                    <button
                        class="btn btn-principal"
                        onclick="exportarConsignados()"
                    >

                        Exportar planilha

                    </button>


                </div>


                <br>


                <div class="tabela-container">


                    <table>


                        <thead>

                            <tr>

                                <th>
                                    Funcionário
                                </th>

                                <th>
                                    Instituição
                                </th>

                                <th>
                                    Contrato
                                </th>

                                <th>
                                    Parcela
                                </th>

                                <th>
                                    Margem disponível
                                </th>

                                <th>
                                    Saldo devedor
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Atualização
                                </th>

                                <th>
                                    Ações
                                </th>

                            </tr>

                        </thead>


                        <tbody
                            id="tabelaConsignados"
                        >

                        </tbody>


                    </table>


                </div>


            </div>


        </div>

    `;



    atualizarTabelaConsignados();

}



/* =========================================================
   PREENCHER FUNCIONÁRIO
========================================================= */

function preencherConsignadoFuncionario() {


    const id =
        document
            .getElementById(
                "consFuncionario"
            )
            .value;



    const funcionario =
        funcionarios.find(
            function(item) {

                return item.id === id;

            }
        );



    if (!funcionario) {


        document.getElementById(
            "consCpf"
        ).value = "";


        document.getElementById(
            "consMatricula"
        ).value = "";


        document.getElementById(
            "consSalarioBruto"
        ).value = "";


        calcularMargemConsignado();


        return;

    }



    document.getElementById(
        "consCpf"
    ).value =
        funcionario.cpf || "";



    document.getElementById(
        "consMatricula"
    ).value =
        funcionario.matricula || "";



    document.getElementById(
        "consSalarioBruto"
    ).value =
        funcionario.salario || 0;



    calcularMargemConsignado();

}



/* =========================================================
   CÁLCULO DA MARGEM
========================================================= */

function calcularMargemConsignado() {


    const bruto =
        valorCampo(
            "consSalarioBruto"
        );


    const inss =
        valorCampo(
            "consInss"
        );


    const irrf =
        valorCampo(
            "consIrrf"
        );


    const percentual =
        valorCampo(
            "consPercentual"
        );


    const parcelasAtivas =
        valorCampo(
            "consParcelasAtivas"
        );


    const parcelaNova =
        valorCampo(
            "consParcela"
        );



    const liquido =
        Math.max(
            bruto - inss - irrf,
            0
        );



    const margemMaxima =
        liquido *
        (percentual / 100);



    const margemDisponivel =
        margemMaxima -
        parcelasAtivas;



    const totalComNovoContrato =
        parcelasAtivas +
        parcelaNova;



    const margemDepoisNovoContrato =
        margemMaxima -
        totalComNovoContrato;



    const campoLiquido =
        document.getElementById(
            "consLiquido"
        );



    const campoMargemMaxima =
        document.getElementById(
            "consMargemMaxima"
        );



    const campoMargemDisponivel =
       