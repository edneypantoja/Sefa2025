const container = document.getElementById("sumario");
const STORAGE_KEY = "sumarioStatus";

let status = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

fetch("conteudo.json")
    .then(res => res.json())
    .then(data => {
        if (!Array.isArray(data.Geral)) {
            throw new Error("Geral precisa ser um array");
        }

        renderSumario([
            ...data.Geral,
            ...data.Especifico
        ]);
    });

function renderSumario(disciplinas) {
    disciplinas.forEach(disciplina => {
        const divDisc = document.createElement("div");
        divDisc.className = "disciplina";

        const h2 = document.createElement("h2");
        h2.textContent = disciplina.disciplina;
        divDisc.appendChild(h2);

        Object.entries(disciplina.conteudo).forEach(([topico, filhos]) => {
            const divTopico = document.createElement("div");
            divTopico.className = "topico";

            const h3 = document.createElement("h3");
            h3.textContent = topico;

            const icon = document.createElement("img");
            icon.src = "complete.svg"
            h3.appendChild(icon);

            divTopico.appendChild(h3);



            filhos.forEach(filho => {
                const divFilho = document.createElement("div");
                divFilho.className = "filho";
                divFilho.textContent = filho;

                const icon = document.createElement("img");
                icon.src = "complete.svg"
                divFilho.appendChild(icon);



                const key = `${disciplina.disciplina}|${topico}|${filho}`;

                if (status[key]) {
                    divFilho.classList.add("completo");
                }

                addLongPress(divFilho, () => {
                    divFilho.classList.toggle("completo");
                    status[key] = divFilho.classList.contains("completo");
                    salvar();
                    atualizarTopico(divTopico, disciplina.disciplina, topico);
                });

                divTopico.appendChild(divFilho);
            });

            atualizarTopico(divTopico, disciplina.disciplina, topico);
            divDisc.appendChild(divTopico);
        });

        container.appendChild(divDisc);
    });
}

function atualizarTopico(divTopico, disciplina, topico) {
    const filhos = divTopico.querySelectorAll(".filho");
    const h3 = divTopico.querySelector("h3");

    const completo = [...filhos].every(f => f.classList.contains("completo"));
    const key = `${disciplina}|${topico}`;

    h3.classList.toggle("completo", completo);
    status[key] = completo;
    salvar();
}

function salvar() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(status));
}

function addLongPress(el, callback, delay = 500) {
    let timer;

    el.addEventListener("mousedown", () => {
        timer = setTimeout(callback, delay);
    });

    ["mouseup", "mouseleave"].forEach(evt =>
        el.addEventListener(evt, () => clearTimeout(timer))
    );

    el.addEventListener("touchstart", () => {
        timer = setTimeout(callback, delay);
    });

    el.addEventListener("touchend", () => clearTimeout(timer));
}
