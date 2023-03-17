//url da api
const url = "https://jsonplaceholder.typicode.com/posts";


//Get id para URL - acessar parametros que estão na url
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get("id"); //vai buscar pelo id 



//selecionar os ids de index.html
const loadingElement = document.querySelector("#loading");
const postsContainer = document.querySelector("#posts-container");

//Get all posts - função para pegar todos os posts
async function getAllPosts() {

    //consultar a api e retornor os dados
    const response = await fetch(url);
    console.log(response);

    //passar a resposta para json
    const data= await response.json();
    console.log(data);

    //esconder o conteúdo do elemento assim que carregar os dados
    loadingElement.classList.add("hide");

    //Passar por cada post e inserir esses dados no template
    data.map((post) => {
        //criando estrutura html
        const div = document.createElement("div");
        const title = document.createElement("h2");
        const body = document.createElement("p");
        const link = document.createElement("a");

        //conteúdo das variavéis e extração dos dados
        title.innerText = post.title;
        body.innerText = post.body;
        link.innerText = "Ler"
        //inserindo atribulo na url para extrair o post individualmente/ simulação de roteamento
        link.setAttribute("href", `post.html?id=${post.id}`);

        //incluindo os elementos na div
        div.appendChild(title);
        div.appendChild(body);
        div.appendChild(link);

        //Colocar o conteúdo da div no postsContainer
        postsContainer.appendChild(div);
    })
}



//selecionar os ids de post.html
const postPage = document.querySelector("#post");
const postContainer = document.querySelector("#post-container");
const commentsContainer = document.querySelector("#comments-container");

//Get individual post
async function getPost(id) {
    //Dois request assincrono / desestruturação de array / Buscando os dados
    const [responsePost, responseComments] = await Promise.all([
        fetch(`${url}/${id}`), //vai acessar o id, post individual
        fetch(`${url}/${id}/comments`), //pegar comentário dos posts
    ]);

    //convertendo as promisses retornadas para json
    const dataPost = await responsePost.json();
    const dataComments = await responseComments.json();

    loadingElement.classList.add("hide"); //esconder o conteúdo de loading
    postPage.classList.remove("hide"); //remover o hide do id post

    //Formatação do conteúdo do post
    const title = document.createElement("h1");
    const body = document.createElement("p");

    //Conteúdo do Post
    title.innerText = dataPost.title;
    body.innerText = dataPost.body;

    //incluir no documento
    postContainer.appendChild(title);
    postContainer.appendChild(body);

    //comentários

    dataComments.map((comment) => {
        createComment(comment);
    });

}

//Criando a estrutura para os comentários
function createComment(comment) {
    const div = document.createElement("div");
    const email = document.createElement("h4");
    const commentBody = document.createElement("p");

    email.innerText = comment.email;
    commentBody.innerText = comment.body;

    div.appendChild(email);
    div.appendChild(commentBody);

    commentsContainer.appendChild(div);
}




//executando a função
if(!postId){  //Se não tiver postId chama a função todos os posts
    getAllPosts(); 
} else {
    getPost(postId); //Senão imprimir o post correpondente ao id

   
  
//Selecionando os id de post.html - form
const commentForm = document.querySelector("#comment-form");
const emailInput = document.querySelector("#email");
const bodyInput = document.querySelector("#body");


//Adicionar evento no commentForm
commentForm.addEventListener("submit", (e) => {
    e.preventDefault(); //não enviará o formulário imediatamente após clicar em enviar


    let comment = {
        //armazenar o valor dos inputs
        email : emailInput.value,
        body: bodyInput.value,
    };

    //Visulizar o valor passado no Input = console.log(comment)
    //Passar o objeto do input para formato texto json
    comment =JSON.stringify(comment);

    //Vai inserir um comentário no sistema
    postComment(comment);

 });
}



// enviando um comentário para api e inserindo na página
async function postComment(comment) {
    const response = await fetch(url, {
      method: "POST",
      body: comment,
      headers: {
        "Content-type": "application/json",
      },
    });
    
    //converter e imprimir o retorno da api em json
    const data = await response.json();
    
    createComment(data);
  };



  
   