let NomeUsuario;
let ListaNome;
let ListaNome2;/////////////////////////////////////////////////////////////////////////////////
setTimeout(PerguntaNome,500);
let contador;
function PerguntaNome(){
    NomeUsuario = prompt("Qual o seu lindo nome?");

    ListaNome = { name: NomeUsuario };

    Login();
}

function perguntaDNV(){
    NomeUsuario = prompt("Digite outro nome, este é invalido ou já esta em uso!");

    ListaNome = { name: NomeUsuario };

    Login();
}

function Login(){
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", ListaNome);
    promise.then(SucessoLogin);
    promise.catch(FalhaLogin);
}

function SucessoLogin(resposta){
    startCounting();
}

function FalhaLogin(resposta){
    if (resposta.response.status === 400){
        perguntaDNV();
    }
}

function startCounting(){
    contador = setInterval(Counting, 5000);
}

function Counting(){
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", ListaNome);
    promise.then(EstaContando);
    promise.catch(ErroContando);
}

function EstaContando(resposta){
    console.log(resposta);
    console.log("está contando");
}

function ErroContando(resposta){
    alert("Ops, ocorreu um problema, faça Login novamente!")
    window.location.reload()
}