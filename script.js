let NomeUsuario;
let ListaNome;
setTimeout(PerguntaNome,500);
let contador;
let ListaMensagens = [];
let contadorMensagem;
let mensagem;

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
    BuscarMensagem();
    contadorMensagem = setInterval(BuscarMensagem, 3000);
}

function FalhaLogin(resposta){
    if (resposta.response.status === 400){
        perguntaDNV();
    }
}

function startCounting(){
    Counting()
    contador = setInterval(Counting, 5000);
}

function Counting(){
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", ListaNome);
    //promise.then(EstaContando);
    promise.catch(ErroContando);
}

/*function EstaContando(resposta){
    console.log("esta Contando")
}*/

function ErroContando(resposta){
    alert("Ops, ocorreu um problema, faça Login novamente!")
    window.location.reload()
}

function BuscarMensagem(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(AchouMensagem);
    //promise.catch(ErroMensagem);
}

function AchouMensagem(resposta){
    AtualizaMensagens(resposta.data);
}

/*function ErroMensagem(resposta){
    console.log(resposta);
}*/

function AtualizaMensagens(objeto){
    ListaMensagens = []
    for(let i=0; i<objeto.length; i++){
        if(objeto[i].type === 'status'){
            ListaMensagens = ListaMensagens + [`
            <li class="mensagem login">
            <span><span class="hora">(${objeto[i].time})</span> <strong>${objeto[i].from}</strong> ${objeto[i].text}</span>
            </li>
            `]
        }else if(objeto[i].type === 'message' && objeto[i].to === 'Todos'){
            ListaMensagens = ListaMensagens + [`
            <li class="mensagem conversa">
            <span><span class="hora">(${objeto[i].time})</span> <strong>${objeto[i].from}</strong> para <strong>${objeto[i].to}:</strong>  ${objeto[i].text}</span>
            </li>
            `]
        }else if(objeto[i].type === 'message' && objeto[i].to !== 'Todos'){
            ListaMensagens = ListaMensagens + [`
            <li class="mensagem conversa">
            <span><span class="hora">(${objeto[i].time})</span> <strong>${objeto[i].from}</strong> para <strong>${objeto[i].to}:</strong>  ${objeto[i].text}</span>
            </li>
            `]
        }else if(objeto[i].type === 'private_message' && (objeto[i].to === ListaNome.name || objeto[i].from === ListaNome.name)){
            ListaMensagens = ListaMensagens + [`
            <li class="mensagem privada">
            <span><span class="hora">(${objeto[i].time})</span><strong>${objeto[i].from}</strong> reservadamente para <strong>${objeto[i].to}:</strong>  ${objeto[i].text}</span>
            </li>
            `]
        }
    }
    JogaNaTela();
}

function JogaNaTela(){
    document.querySelector("ul").innerHTML=ListaMensagens;
    document.querySelector("ul li:last-child").scrollIntoView();
}

function Enviar(){
    const texto = document.querySelector("input").value;
    mensagem = {
        from: `${ListaNome.name}`,
        to: "Todos",
        text: `${texto}`,
        type: "message"
    };
    document.querySelector("input").value = "";
    MandarMensagem();
}

function MandarMensagem(){
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",mensagem);
    promise.then(BuscarMensagem);
    promise.catch(ErroMandar);
}

function ErroMandar(resposta){
    ErroContando()
}