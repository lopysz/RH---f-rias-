// =====================================================
// BANCO LOCAL
// =====================================================

let funcionarios =
    JSON.parse(localStorage.getItem("funcionariosRH")) || [];

let ferias =
    JSON.parse(localStorage.getItem("feriasRH")) || [];

let emprestimos =
    JSON.parse(localStorage.getItem("emprestimosRH")) || [];


// =====================================================
// NAVEGAÇÃO
// =====================================================

function mostrarTela(tela) {

    document.querySelectorAll(".tela")
        .forEach(elemento => {
            elemento.classList.remove("ativa");
        });

    document.getElementById(tela)
        .classList.add("ativa");

    atualizarTudo();
}


// =====================================================
// FUNCIONÁRIOS
// =====================================================

function cadastrarFuncionario() {

    const nome = document.getElementById("nome").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const matricula = document.getElementById("matricula").value.trim();
    const cargo = document.getElementById("cargo").value.trim();
    const salario = Number(document.getElementById("salario").value);
    const admissao = document.getElementById("admissao").value;

    if (!nome || !salario) {
        alert("Informe pelo menos o nome e o salário.");
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

    funcionarios.push(funcionario);

    salvarDados();

    limparFormularioFuncionario();

    alert("Funcionário cadastrado.");

    atualizarTudo();
}


function excluirFuncionario(id) {

    const confirmar =
        confirm("Deseja realmente excluir este funcionário?");

    if (!confirmar) return;

    funcionarios =
        funcionarios.filter(f => f.id !== id);

    salvarDados();

    atualizarTudo();
}


function listarFuncionarios() {

    const lista =
        document.getElementById("listaFuncionarios");

    const pesquisa =
        document.getElementById("pesquisaFuncionario")
        .value
        .toLowerCase();

    lista.innerHTML = "";

    const filtrados =
        funcionarios.filter(f =>
            f.nome.toLowerCase().includes(pesquisa)
        );

    filtrados.forEach(f => {

        const div =
            document.createElement("div");

        div.className = "funcionario";

        div.innerHTML = `
            <div>
                <strong>${f.nome}</strong><br>
                Matrícula: ${f.matricula || "-"}<br>
                Cargo: ${f.cargo || "-"}<br>
                Salário: ${formatarMoeda(f.salario)}
            </div>

            <button onclick="excluirFuncionario(${f.id})">
                Excluir
            </button>
        `;

        lista.appendChild(div);
    });
}


function preencherFuncionarios() {

    const selects = [
        document.getElementById("funcionarioFerias"),
        document.getElementById("funcionarioConsignado")
    ];

    selects.forEach(select => {

        const valorAtual = select.value;

        select.innerHTML =
            '<option value="">Selecione o funcionário</option>';

        funcionarios.forEach(f => {

            const option =
                document.createElement("option");

            option.value = f.id;
            option.textContent =
                `${f.nome} - ${f.matricula || "sem matrícula"}`;

            select.appendChild(option);
        });

        select.value = valorAtual;
    });
}


// =====================================================
// FÉRIAS
// =====================================================

function calcularFerias() {

    const id =
        Number(document.getElementById("funcionarioFerias").value);

    const dias =
        Number(document.getElementById("diasFerias").value);

    const possuiAbono =
        document.getElementById("abono").value === "sim";

    const funcionario =
        funcionarios.find(f => f.id === id);

    if (!funcionario) {
        alert("Selecione um funcionário.");
        return;
    }

    if (!dias || dias < 1 || dias > 30) {
        alert("Informe uma quantidade válida de dias.");
        return;
    }

    const salario = funcionario.salario;

    // Valor proporcional aos dias
    const valorFerias =
        salario / 30 * dias;

    // 1/3 constitucional
    const terco =
        valorFerias / 3;

    let abono = 0;
    let tercoAbono = 0;

    if (possuiAbono) {

        // Abono de 10 dias
        abono =
            salario / 30 * 10;

        tercoAbono =
            abono / 3;
    }

    const totalBruto =
        valorFerias +
        terco +
        abono +
        tercoAbono;

    const resultado =
        document.getElementById("resultadoFerias");

    resultado.innerHTML = `

        <h3>${funcionario.nome}</h3>

        <p>
            Salário:
            <strong>${formatarMoeda(salario)}</strong>
        </p>

        <p>
            Dias de férias:
            <strong>${dias}</strong>
        </p>

        <hr>

        <p>
            Férias:
            ${formatarMoeda(valorFerias)}
        </p>

        <p>
            1/3 constitucional:
            ${formatarMoeda(terco)}
        </p>

        <p>
            Abono:
            ${formatarMoeda(abono)}
        </p>

        <p>
            1/3 sobre abono:
            ${formatarMoeda(tercoAbono)}
        </p>

        <hr>

        <p class="valor-final">
            Total bruto:
            ${formatarMoeda(totalBruto)}
        </p>

        <small>
            * Esta versão beta ainda não calcula
            automaticamente INSS e IRRF.
        </small>
    `;

    ferias.push({
        id: Date.now(),
        funcionarioId: funcionario.id,
        dias,
        abono: possuiAbono,
        totalBruto
    });

    salvarDados();
}


// =====================================================
// CONSIGNADO
// =====================================================

function calcularConsignado() {

    const id =
        Number(document.getElementById("funcionarioConsignado").value);

    const valor =
        Number(document.getElementById("valorEmprestimo").value);

    const taxa =
        Number(document.getElementById("juros").value);

    const numeroParcelas =
        Number(document.getElementById("parcelas").value);

    const funcionario =
        funcionarios.find(f => f.id === id);

    if (!funcionario) {
        alert("Selecione um funcionário.");
        return;
    }

    if (
        !valor ||
        !numeroParcelas ||
        taxa < 0
    ) {
        alert("Preencha os dados do empréstimo.");
        return;
    }

    let parcela;

    // Fórmula de juros compostos / sistema Price
    if (taxa === 0) {

        parcela =
            valor / numeroParcelas;

    } else {

        const i = taxa / 100;

        parcela =
            valor *
            (
                i * Math.pow(1 + i, numeroParcelas)
            ) /
            (
                Math.pow(1 + i, numeroParcelas) - 1
            );
    }

    const total =
        parcela * numeroParcelas;

    const jurosTotal =
        total - valor;

    const resultado =
        document.getElementById("resultadoConsignado");

    resultado.innerHTML = `

        <h3>${funcionario.nome}</h3>

        <p>
            Valor solicitado:
            <strong>${formatarMoeda(valor)}</strong>
        </p>

        <p>
            Taxa mensal:
            <strong>${taxa.toFixed(2)}%</strong>
        </p>

        <p>
            Parcelas:
            <strong>${numeroParcelas}</strong>
        </p>

        <hr>

        <p class="valor-final">
            Parcela:
            ${formatarMoeda(parcela)}
        </p>

        <p>
            Total de juros:
            ${formatarMoeda(jurosTotal)}
        </p>

        <p>
            Total pago:
            ${formatarMoeda(total)}
        </p>
    `;

    emprestimos.push({
        id: Date.now(),
        funcionarioId: funcionario.id,
        valor,
        taxa,
        parcelas: numeroParcelas,
        valorParcela: parcela,
        total,
        jurosTotal
    });

    salvarDados();
}


// =====================================================
// EXCEL
// =====================================================

function importarExcel(event) {

    const arquivo =
        event.target.files[0];

    if (!arquivo) return;

    const leitor =
        new FileReader();

    leitor.onload = function(e) {

        const dados =
            new Uint8Array(e.target.result);

        const workbook =
            XLSX.read(dados, { type: "array" });

        const primeiraAba =
            workbook.Sheets[workbook.SheetNames[0]];

        const linhas =
            XLSX.utils.sheet_to_json(primeiraAba);

        linhas.forEach(linha => {

            const funcionario = {

                id: Date.now() +
                    Math.floor(Math.random() * 100000),

                nome:
                    linha.Nome ||
                    linha.nome ||
                    "",

                cpf:
                    linha.CPF ||
                    linha.cpf ||
                    "",

                matricula:
                    linha.Matricula ||
                    linha.Matrícula ||
                    "",

                cargo:
                    linha.Cargo ||
                    linha.cargo ||
                    "",

                salario:
                    Number(
                        linha.Salario ||
                        linha.Salário ||
                        0
                    ),

                admissao:
                    linha.Admissao ||
                    linha.Admissão ||
                    ""
            };

            if (funcionario.nome) {
                funcionarios.push(funcionario);
            }
        });

        salvarDados();

        atualizarTudo();

        alert(
            linhas.length +
            " registros encontrados na planilha."
        );
    };

    leitor.readAsArrayBuffer(arquivo);
}


function exportarExcel() {

    if (funcionarios.length === 0) {
        alert("Não existem funcionários cadastrados.");
        return;
    }

    const dados =
        funcionarios.map(f => ({

            Nome: f.nome,
            CPF: f.cpf,
            Matricula: f.matricula,
            Cargo: f.cargo,
            Salario: f.salario,
            Admissao: f.admissao
        }));

    const worksheet =
        XLSX.utils.json_to_sheet(dados);

    const workbook =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Funcionários"
    );

    XLSX.writeFile(
        workbook,
        "funcionarios_RH.xlsx"
    );
}


// =====================================================
// LOCAL STORAGE
// =====================================================

function salvarDados() {

    localStorage.setItem(
        "funcionariosRH",
        JSON.stringify(funcionarios)
    );

    localStorage.setItem(
        "feriasRH",
        JSON.stringify(ferias)
    );

    localStorage.setItem(
        "emprestimosRH",
        JSON.stringify(emprestimos)
    );
}


// =====================================================
// UTILIDADES
// =====================================================

function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


function limparFormularioFuncionario() {

    document.getElementById("nome").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("matricula").value = "";
    document.getElementById("cargo").value = "";
    document.getElementById("salario").value = "";
    document.getElementById("admissao").value = "";
}


function atualizarDashboard() {

    document.getElementById(
        "totalFuncionarios"
    ).textContent = funcionarios.length;

    document.getElementById(
        "totalFerias"
    ).textContent = ferias.length;

    document.getElementById(
        "totalEmprestimos"
    ).textContent = emprestimos.length;
}


function atualizarTudo() {

    atualizarDashboard();

    listarFuncionarios();

    preencherFuncionarios();
}


// =====================================================
// INICIALIZAÇÃO
// =====================================================

atualizarTudo();
