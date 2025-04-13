const { reporter, flow, mock, handler } = require('pactum');
const pf = require('pactum-flow-plugin');



function addFlowReporter() {
  pf.config.url = 'http://localhost:8081'; // pactum flow server url
  pf.config.projectId = 'loja-ebac-front';
  pf.config.projectName = 'Loja EBAC Front';
  pf.config.version = '1.0.0    ';
  pf.config.username = 'scanner';
  pf.config.password = 'scanner';
  reporter.add(pf.reporter);
}

// global before
before(async () => {
  addFlowReporter();
  await mock.start(4000);
});

// global after
after(async () => {
  await mock.stop();
  await reporter.end();
});

handler.addInteractionHandler('Authorization', () => {
  return {
    provider: 'loja-ebac-api', 
    flow: 'Auth User', 
      method: 'POST',
      path: 'http://localhost:8081/public/authUser',
      body: {
        "email": "cliente@ebac.com.br",  
        "phone": "14999887766",  
        "password": "123456",  
        "userId": "01"
      }
    },
    response: {
      status: 200,
   
    }
    })
  
   



beforeEach(async () => {
    // Realiza o login para obter o token
    const response = await flow('Auth User')
    .useInteraction("Authorization")
      .post('http://localhost:4000/public/authUser')
      .withJson({
        "email": "cliente@ebac.com.br",  
        "phone": "14999887766",  
        "password": "123456",  
        "userId": "01"
      })
      .expectStatus(200)
    
    
    token = response.body.token;  // Armazena o token
  });
  
  handler.addInteractionHandler('Add Product Response', () => {
    return {
      provider: 'loja-ebac-api', 
      flow: 'Add Product', 
      request: {
        method: 'POST',
        path: 'http://localhost:8081/api/addProduct',
        body: {
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
        }
      },
      response: {
        status: 200,
      }
    }    
  })

  it('Front - Deve adicionar o produto com sucesso com dados fixos', async () => {
    await flow('Add Product')
    .useInteraction("Add Product Response")
      .post('http://localhost:4000/api/addProduct')
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

  handler.addInteractionHandler('Edit Product Response', () => {
    const productId = 1;
    return {
      provider: 'loja-ebac-api', 
      flow: 'Edit Product', 
      request: {
        method: 'PUT',
        path: `http://localhost:8081/api/editProduct/${productId}`,
        body: {
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
        }
      },
      response: {
        status: 200,
      }
    }    
  })

  it('Deve editar um produto com sucesso', async () => {
    const productId = 1;
    await flow ('Edit Product')
    .useInteraction("Edit Product Response")
    .put(`http://localhost:4000/api/editProduct/${productId}`)
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
  
    handler.addInteractionHandler('Delete Product Response', () => {
      const productId = 1; 
      return {
        provider: 'loja-ebac-api', 
        flow: 'Delete Product', 
        request: {
          method: 'DELETE',
          path: `http://localhost:8081/api/deleteProduct/${productId}`,
          body: {
            "authorization": token  
          }
        },
        response: {
          status: 200,
        }
      }    
    })

    it('Deve deletar o produto com sucesso',  async () => {
      const productId = 1;  
      await flow ('Delete Product')
      .useInteraction("Delete Product Response")
    .delete(`http://localhost:4000/api/deleteProduct/${productId}`)
    .withHeaders({
      'Authorization': `Bearer ${token}`
    })
        .withJson ({
          "authorization": token  
        })
        .expectStatus(200)
        })
      