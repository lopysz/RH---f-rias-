/* ==========================================
   CONTROLE DOS MENUS
========================================== */

let menuAberto = null;


/*
    Abre ou fecha um dos dois leques.
*/
function abrirMenu(tipo) {

    const menuCalcular =
        document.getElementById("menu-calcular");

    const menuPessoas =
        document.getElementById("menu-pessoas");


    const botoes =
        document.querySelectorAll(".botao-circular");


    // Se clicou no menu que já está aberto,
    // fecha tudo.
    if (menuAberto === tipo) {

        fecharMenus();

        return;
    }


    // Fecha qualquer outro menu.
    fecharMenus();


    const menu =
        document.getElementById(
            "menu-" + tipo
        );


    menu.classList.add("aberto");


    /*
        O botão correspondente recebe
        a aparência de selecionado.
    */

    if (tipo === "calcular") {

        botoes[0].classList.add("ativo");

    } else {

        botoes[1].classList.add("ativo");
    }


    menuAberto = tipo;
}



/*
    Fecha todos os leques.
*/
function fecharMenus() {

    document
        .querySelectorAll(".leque")
        .forEach(menu => {

            menu.classList.remove("aberto");

        });


    document
        .querySelectorAll(".botao-circular")
        .forEach(botao => {

            botao.classList.remove("ativo");

        });


    menuAberto = null;
}



/* ==========================================
   MÓDULOS
========================================== */

function abrirModulo(modulo) {

    fecharMenus();


    const modal =
        document.getElementById("modal");

    const conteudo =
        document.getElementById("conteudo-modal");


    /*
        Por enquanto os módulos são
        apenas a estrutura inicial.

        Depois vamos substituir cada
        conteúdo pelo sistema real.
    */

    if (modulo === "ferias") {

        conteudo.innerHTML = `

            <h2>🏖️ Cálculo de Férias</h2>

            <p>
                Aqui ficará o cálculo completo
                das férias.
            </p>

            <hr>

            <p>
                Salário base
            </p>

            <p>
                Média de horas extras
            </p>

            <p>
                Média de adicional noturno
            </p>

            <p>
                Média de comissões
            </p>

            <p>
                Média de DSR
            </p>

            <p>
                Periculosidade / Insalubridade
            </p>

            <p>
                Abono pecuniário
            </p>

            <p>
                INSS
            </p>

            <p>
                IRRF
            </p>

            <p>
                Outros descontos
            </p>

        `;

    }


    else if (modulo === "consignado") {

        conteudo.innerHTML = `

            <h2>💰 Empréstimo Consignado</h2>

            <p>
                Aqui ficará o módulo de
                cálculo e controle de
                empréstimos consignados.
            </p>

        `;

    }


    else if (modulo === "folha") {

        conteudo.innerHTML = `

            <h2>🧾 Folha</h2>

            <p>
                Módulo de folha de pagamento
                em desenvolvimento.
            </p>

        `;

    }


    else if (modulo === "adicionar") {

        conteudo.innerHTML = `

            <h2>➕ Adicionar Funcionário</h2>

            <p>
                Aqui ficará o cadastro
                completo do funcionário.
            </p>

        `;

    }


    else if (modulo === "funcionarios") {

        conteudo.innerHTML = `

            <h2>👥 Funcionários</h2>

            <p>
                Aqui ficará a lista,
                pesquisa e gerenciamento
                dos funcionários.
            </p>

        `;

    }


    else if (modulo === "planilhas") {

        conteudo.innerHTML = `

            <h2>📊 Planilhas</h2>

            <p>
                Importação e exportação
                de planilhas do RH.
            </p>

        `;
    }


    modal.classList.add("aberto");
}



/* ==========================================
   FECHAR MODAL
========================================== */

function fecharModal() {

    document
        .getElementById("modal")
        .classList.remove("aberto");
}



/*
    Se clicar fora da janela,
    fecha o modal.
*/

document
    .getElementById("modal")
    .addEventListener(
        "click",
        function(event) {

            if (
                event.target === this
            ) {

                fecharModal();

            }

        }
    );



/*
    ESC também fecha.
*/

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            fecharMenus();

            fecharModal();

        }

    }
);