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
  
  handler.addInteractionHandler('Add Category Response', () => {
    return {
      provider: 'loja-ebac-api', 
      flow: 'Add Category', 
      request: {
        method: 'POST',
        path: 'http://localhost:8081/api/addCategory',
        body: {
          'authorization': `Bearer ${token}`,  
          'name': 'Categoria Teste',  
          'photo': 'https://samsungbrshop.vtexassets.com/arquivos/ids/230984-600-auto?v=638465404494130000&width=600&height=auto&aspect=true',
        }
      },
      response: {
        status: 200,
      }
    }    
  })

  it(' Deve adicionar a categoria com sucesso ', async () => {
    await flow('Add Category')
      .useInteraction("Add Category Response")
      .post('http://localhost:4000/api/addCategory')
      .withHeaders({
        'Authorization': `Bearer ${token}`  // Passa o token para a autenticação
      })
      .withJson({
        'authorization': `Bearer ${token}`,  
          'name': 'Categoria Teste',  
          'photo': 'https://samsungbrshop.vtexassets.com/arquivos/ids/230984-600-auto?v=638465404494130000&width=600&height=auto&aspect=true',  
      })
      .expectStatus(200)
      
  });

  handler.addInteractionHandler('Edit Category Response', () => {
    const categoryId = 1;
    return {
      provider: 'loja-ebac-api', 
      flow: 'Edit Category', 
      request: {
        method: 'PUT',
        path: `http://localhost:8081/api/editCategory/${categoryId}`,
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

  it('Deve editar a categoria com sucesso', async () => {
    const categoryId = 1;
    await flow ('Edit Category')
    .useInteraction("Edit Category Response")
    .put(`http://localhost:4000/api/editCategory/${categoryId}`)
    .withHeaders({
      'Authorization': `Bearer ${token}`
    })

      .withJson({
        'authorization': `Bearer ${token}`,  
        'name': 'Categoria Teste Editada',  
        'photo': 'https://samsungbrshop.vtexassets.com/arquivos/ids/230984-600-auto?v=638465404494130000&width=600&height=auto&aspect=true',
      })
      .expectStatus(200)
    });
  
    handler.addInteractionHandler('Delete Category Response', () => {
      const categoryId = 1; 
      return {
        provider: 'loja-ebac-api', 
        flow: 'Delete Category', 
        request: {
          method: 'DELETE',
          path: `http://localhost:8081/api/deleteProduct/${categoryId}`,
          body: {
            "authorization": token  
          }
        },
        response: {
          status: 200,
        }
      }    
    })

    it('Deve deletar a categoria com sucesso',  async () => {
      const categoryId = 1;  
      await flow ('Delete Category')
      .useInteraction("Delete Category Response")
    .delete(`http://localhost:4000/api/deleteCategory/${categoryId}`)
    .withHeaders({
      'Authorization': `Bearer ${token}`
    })
        .withJson ({
          "authorization": token  
        })
        .expectStatus(200)
        })
