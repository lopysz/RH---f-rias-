/* =========================================
   DADOS
========================================= */

let funcionarios =
    JSON.parse(
        localStorage.getItem("pranchetaFuncionarios")
    ) || [];



/* =========================================
   PÁGINAS
========================================= */

const paginas = {

    ferias: {

        titulo: "Cálculo de Férias",

        subtitulo:
            "Cálculo e controle de férias",

        conteudo: `

            <div class="card">

                <h3>Dados das férias</h3>

                <div class="form-grid">

                    <div class="campo">

                        <label>
                            Funcionário
                        </label>

                        <select>
                            <option>
                                Selecione um funcionário
                            </option>
                        </select>

                    </div>


                    <div class="campo">

                        <label>
                            Início das férias
                        </label>

                        <input
                            type="date"
                        >

                    </div>


                    <div class="campo">

                        <label>
                            Dias de férias
                        </label>

                        <input
                            type="number"
                            value="30"
                            min="1"
                            max="30"
                        >

                    </div>

                </div>

            </div>


            <div class="card">

                <h3>
                    Componentes da remuneração
                </h3>

                <p>
                    O cálculo completo de férias
                    será implementado aqui.
                </p>

            </div>

        `
    },


    consignado: {

        titulo:
            "Empréstimo Consignado",

        subtitulo:
            "Cadastro e cálculo de empréstimos",

        conteudo: `

            <div class="card">

                <h3>
                    Novo empréstimo
                </h3>

                <div class="form-grid">

                    <div class="campo">

                        <label>
                            Funcionário
                        </label>

                        <select>
                            <option>
                                Selecione um funcionário
                            </option>
                        </select>

                    </div>


                    <div class="campo">

                        <label>
                            Valor do empréstimo
                        </label>

                        <input
                            type="number"
                            step="0.01"
                        >

                    </div>


                    <div class="campo">

                        <label>
                            Número de parcelas
                        </label>

                        <input
                            type="number"
                            min="1"
                        >

                    </div>

                </div>

            </div>

        `
    },


    folha: {

        titulo:
            "Folha de Pagamento",

        subtitulo:
            "Controle de pagamentos e descontos",

        conteudo: `

            <div class="card">

                <h3>
                    Folha de pagamento
                </h3>

                <p>
                    Módulo em desenvolvimento.
                </p>

            </div>

        `
    },


    cadastrar: {

        titulo:
            "Cadastrar Funcionário",

        subtitulo:
            "Cadastro de funcionários",

        conteudo: `

            <div class="card">

                <h3>
                    Novo funcionário
                </h3>

                <div class="form-grid">

                    <div class="campo">

                        <label>
                            Nome completo
                        </label>

                        <input
                            id="novoNome"
                            type="text"
                        >

                    </div>


                    <div class="campo">

                        <label>
                            CPF
                        </label>

                        <input
                            id="novoCpf"
                            type="text"
                        >

                    </div>


                    <div class="campo">

                        <label>
                            Matrícula
                        </label>

                        <input
                            id="novaMatricula"
                            type="text"
                        >

                    </div>


                    <div class="campo">

                        <label>
                            Cargo
                        </label>

                        <input
                            id="novoCargo"
                            type="text"
                        >

                    </div>


                    <div class="campo">

                        <label>
                            Salário
                        </label>

                        <input
                            id="novoSalario"
                            type="number"
                            step="0.01"
                        >

                    </div>


                    <div class="campo">

                        <label>
                            Data de admissão
                        </label>

                        <input
                            id="novaAdmissao"
                            type="date"
                        >

                    </div>

                </div>


                <div class="acoes">

                    <button
                        class="botao"
                        onclick="cadastrarFuncionario()"
                    >
                        Cadastrar funcionário
                    </button>

                </div>

            </div>

        `
    },


    funcionarios: {

        titulo:
            "Funcionários",

        subtitulo:
            "Cadastro e consulta de funcionários",

        conteudo: `

            <div class="card">

                <h3>
                    Funcionários cadastrados
                </h3>

                <div id="tabelaFuncionarios">

                </div>

            </div>

        `
    },


    planilhas: {

        titulo:
            "Planilhas de Funcionários",

        subtitulo:
            "Importação e exportação de dados",

        conteudo: `

            <div class="card">

                <h3>
                    Planilhas
                </h3>

                <p>
                    Aqui ficará a importação e
                    exportação dos dados dos
                    funcionários.
                </p>

                <div class="acoes">

                    <button
                        class="botao"
                        onclick="exportarFuncionarios()"
                    >
                        Exportar funcionários
                    </button>

                </div>

            </div>

        `
    }

};



/* =========================================
   ABRIR PÁGINA
========================================= */

function abrirPagina(nome, botao) {

    const pagina =
        paginas[nome];

    if (!pagina) return;


    document
        .querySelectorAll(".menu-item")
        .forEach(item => {

            item.classList.remove("ativo");

        });


    if (botao) {

        botao.classList.add("ativo");

    }


    document
        .getElementById("tituloPagina")
        .textContent =
        pagina.titulo;


    document
        .getElementById("subtituloPagina")
        .textContent =
        pagina.subtitulo;


    document
        .getElementById("areaConteudo")
        .innerHTML =
        pagina.conteudo;


    if (nome === "funcionarios") {

        mostrarFuncionarios();

    }

}



/* =========================================
   CADASTRAR FUNCIONÁRIO
========================================= */

function cadastrarFuncionario() {

    const nome =
        document.getElementById(
            "novoNome"
        ).value.trim();

    const cpf =
        document.getElementById(
            "novoCpf"
        ).value.trim();

    const matricula =
        document.getElementById(
            "novaMatricula"
        ).value.trim();

    const cargo =
        document.getElementById(
            "novoCargo"
        ).value.trim();

    const salario =
        Number(
            document.getElementById(
                "novoSalario"
            ).value
        );

    const admissao =
        document.getElementById(
            "novaAdmissao"
        ).value;


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

        id: Date.now(),

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


    salvarFuncionarios();


    alert(
        "Funcionário cadastrado com sucesso."
    );


    abrirPagina(
        "funcionarios"
    );
}



/* =========================================
   FUNCIONÁRIOS
========================================= */

function mostrarFuncionarios() {

    const area =
        document.getElementById(
            "tabelaFuncionarios"
        );


    if (
        funcionarios.length === 0
    ) {

        area.innerHTML = `

            <p>
                Nenhum funcionário cadastrado.
            </p>

        `;

        return;
    }


    let html = `

        <table class="tabela">

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

                </tr>

            </thead>

            <tbody>

    `;


    funcionarios.forEach(
        funcionario => {

            html += `

                <tr>

                    <td>
                        ${funcionario.matricula}
                    </td>

                    <td>
                        ${funcionario.nome}
                    </td>

                    <td>
                        ${funcionario.cargo || "-"}
                    </td>

                    <td>
                        ${formatarMoeda(
                            funcionario.salario
                        )}
                    </td>

                </tr>

            `;

        }
    );


    html += `

            </tbody>

        </table>

    `;


    area.innerHTML = html;
}



/* =========================================
   LOCAL STORAGE
========================================= */

function salvarFuncionarios() {

    localStorage.setItem(

        "pranchetaFuncionarios",

        JSON.stringify(
            funcionarios
        )

    );

}



/* =========================================
   EXPORTAR
========================================= */

function exportarFuncionarios() {

    if (
        funcionarios.length === 0
    ) {

        alert(
            "Não existem funcionários cadastrados."
        );

        return;
    }


    let csv =
        "Matrícula,Nome,CPF,Cargo,Salário,Admissão\n";


    funcionarios.forEach(
        funcionario => {

            csv += [

                funcionario.matricula,

                funcionario.nome,

                funcionario.cpf,

                funcionario.cargo,

                funcionario.salario,

                funcionario.admissao

            ].join(",") + "\n";

        }
    );


    const blob =
        new Blob(
            [csv],
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


    link.click();


    URL.revokeObjectURL(url);
}



/* =========================================
   MOEDA
========================================= */

function formatarMoeda(valor) {

    return Number(
        valor || 0
    ).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}



/* =========================================
   INICIALIZAÇÃO
========================================= */

abrirPagina(
    "ferias",
    document.querySelector(
        ".menu-item"
    )
);