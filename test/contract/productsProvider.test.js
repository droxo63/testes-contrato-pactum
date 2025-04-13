const { reporter, flow, mock, handler } = require('pactum');
const pf = require('pactum-flow-plugin');


function addFlowReporter() {
  pf.config.url = 'http://localhost:8081'; // pactum flow server url
  pf.config.projectId = 'loja-ebac-api';
  pf.config.projectName = 'Loja EBAC API';
  pf.config.version = '1.0.0    ';
  pf.config.username = 'scanner';
  pf.config.password = 'scanner';
  reporter.add(pf.reporter);
}

// global before
before(async () => {
  addFlowReporter();
 //await mock.start(4000);
});

// global after
after(async () => {
  //await mock.stop();
  await reporter.end();
});



beforeEach(async () => {
    // Realiza o login para obter o token
    const response = await flow('Login User')
      .post('http://localhost:8081/public/authUser')
      .withJson({
        "email": "cliente@ebac.com.br",  
        "phone": "14999887766",  
        "password": "1234516",  
        "userId": "01"
      })
      .expectStatus(200)
      
    
    token = response.body.token;  // Armazena o token
  });

  
  
  it(' Deve adicionar o produto com sucesso ', async () => {
    await flow('Add Product')
      .post('http://localhost:8081/api/addProduct')
      .withHeaders({
        'Authorization': `Bearer ${token}`  // Passa o token para a autenticação
      })
      .withJson({
        "name": "Samsung Galaxy M55", 
        "price": 1999.99,  
        "quantity": 10,  
        "categories": ["Smartphones"],  
        "description": "Samsung Galaxy M55 - O melhor smartphone da sua categoria",  
        "photos": ["https://samsungbrshop.vtexassets.com/arquivos/ids/230984-600-auto?v=638465404494130000&width=600&height=auto&aspect=true"],
        "popular": true,  
        "visible": true,  
        "location": "Brasil",  
        "additionalDetails": "Detalhes adicionais sobre o produto",  
        "specialPrice": 1799.99
      })
      .expectStatus(200)
      
  });

  // Teste de Editar Categoria
  it('Deve editar um produto com sucesso', async () => {
    const productId = 1;
    await flow ('Edit Product')
    .put(`http://localhost:8081/api/editProduct/${productId}`)
    .withHeaders({
      'Authorization': `Bearer ${token}`
    })

      .withJson({
                "authorization": token,  
                "name": "Smartphones e Acessórios",  
                "price": 1.700,  
                "quantity": 50,  
                "categories": "Smartphones",  
                "description": "Smartphone Samsung Galaxy M55",  
                "photos": false,  
                "popular": true,  
                "visible": true,  
                "location": "BRA",  
                "additionalDetails": "Produto show de bola",  
                "specialPrice": 1.400  
      })
      .expectStatus(200)
    });
  

    it('Deve deletar o produto com sucesso',  async () => {
      const productId = 1;  
      await flow ('Delete Product')
    .delete(`http://localhost:8081/api/deleteProduct/${productId}`)
    .withHeaders({
      'Authorization': `Bearer ${token}`
    })
        .withJson ({
          "authorization": token  
        })
        .expectStatus(200)
        })

       
      
   