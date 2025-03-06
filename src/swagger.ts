import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Restaurante',
      version: '1.0.0',
      description: 'API para gerenciamento de restaurante com pedidos, produtos, mesas e sessões.',
      contact: {
        name: 'Itamar Alves Ferreira Junior',
        email: 'cdajuniorf@gmail.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Servidor de desenvolvimento',
      },
    ],
    tags: [
      {
        name: 'Orders',
        description: 'Operações relacionadas a pedidos'
      },
      {
        name: 'Products',
        description: 'Operações relacionadas a produtos'
      },
      {
        name: 'Tables',
        description: 'Operações relacionadas a mesas'
      },
      {
        name: 'TableSessions',
        description: 'Operações relacionadas a sessões de mesas'
      }
    ],
    paths: {
      '/orders': {
        post: {
          tags: ['Orders'],
          summary: 'Criar um novo pedido',
          description: 'Cria um novo pedido associado a uma sessão de mesa',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['table_session_id', 'product_id', 'quantity'],
                  properties: {
                    table_session_id: {
                      type: 'integer',
                      description: 'ID da sessão da mesa'
                    },
                    product_id: {
                      type: 'integer',
                      description: 'ID do produto'
                    },
                    quantity: {
                      type: 'integer',
                      description: 'Quantidade do produto'
                    }
                  }
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Pedido criado com sucesso'
            },
            '400': {
              description: 'Dados inválidos ou sessão encerrada',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '404': {
              description: 'Sessão ou produto não encontrado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/orders/table-session/{table_session_id}': {
        get: {
          tags: ['Orders'],
          summary: 'Listar pedidos por sessão',
          description: 'Retorna todos os pedidos de uma sessão de mesa específica',
          parameters: [
            {
              name: 'table_session_id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer'
              },
              description: 'ID da sessão da mesa'
            }
          ],
          responses: {
            '200': {
              description: 'Lista de pedidos',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Order'
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/orders/table-session/{table_session_id}/total': {
        get: {
          tags: ['Orders'],
          summary: 'Obter total dos pedidos',
          description: 'Retorna o total de todos os pedidos de uma sessão específica',
          parameters: [
            {
              name: 'table_session_id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer'
              },
              description: 'ID da sessão da mesa'
            }
          ],
          responses: {
            '200': {
              description: 'Total dos pedidos',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      total: {
                        type: 'number',
                        description: 'Valor total dos pedidos'
                      },
                      quantity: {
                        type: 'integer',
                        description: 'Quantidade total de itens'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },

      '/products': {
        get: {
          tags: ['Products'],
          summary: 'Listar todos os produtos',
          description: 'Retorna uma lista de todos os produtos disponíveis',
          responses: {
            '200': {
              description: 'Lista de produtos',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Product'
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Products'],
          summary: 'Criar um novo produto',
          description: 'Adiciona um novo produto ao catálogo',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'price'],
                  properties: {
                    name: {
                      type: 'string',
                      description: 'Nome do produto'
                    },
                    price: {
                      type: 'number',
                      description: 'Preço do produto'
                    }
                  }
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Produto criado com sucesso'
            },
            '400': {
              description: 'Dados inválidos',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/products/{id}': {
        put: {
          tags: ['Products'],
          summary: 'Atualizar um produto',
          description: 'Atualiza as informações de um produto existente',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer'
              },
              description: 'ID do produto'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      description: 'Nome do produto'
                    },
                    price: {
                      type: 'number',
                      description: 'Preço do produto'
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Produto atualizado com sucesso'
            },
            '404': {
              description: 'Produto não encontrado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        },
        delete: {
          tags: ['Products'],
          summary: 'Remover um produto',
          description: 'Remove um produto do catálogo',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer'
              },
              description: 'ID do produto'
            }
          ],
          responses: {
            '200': {
              description: 'Produto removido com sucesso'
            },
            '404': {
              description: 'Produto não encontrado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },

      '/tables': {
        get: {
          tags: ['Tables'],
          summary: 'Listar todas as mesas',
          description: 'Retorna uma lista de todas as mesas do restaurante',
          responses: {
            '200': {
              description: 'Lista de mesas',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Table'
                    }
                  }
                }
              }
            }
          }
        }
      },

      '/tables-sessions': {
        get: {
          tags: ['TableSessions'],
          summary: 'Listar todas as sessões de mesas',
          description: 'Retorna uma lista de todas as sessões de mesas',
          responses: {
            '200': {
              description: 'Lista de sessões de mesas',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/TableSession'
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['TableSessions'],
          summary: 'Abrir uma nova sessão de mesa',
          description: 'Cria uma nova sessão para uma mesa específica',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['table_id'],
                  properties: {
                    table_id: {
                      type: 'integer',
                      description: 'ID da mesa'
                    }
                  }
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Sessão de mesa criada com sucesso'
            },
            '400': {
              description: 'Dados inválidos',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/tables-sessions/{id}': {
        patch: {
          tags: ['TableSessions'],
          summary: 'Fechar uma sessão de mesa',
          description: 'Marca uma sessão de mesa como fechada',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'integer'
              },
              description: 'ID da sessão de mesa'
            }
          ],
          responses: {
            '200': {
              description: 'Sessão de mesa fechada com sucesso'
            },
            '404': {
              description: 'Sessão de mesa não encontrada',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      }
    },
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do produto'
            },
            name: {
              type: 'string',
              description: 'Nome do produto'
            },
            price: {
              type: 'number',
              description: 'Preço do produto'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do registro'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização'
            }
          }
        },
        Table: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da mesa'
            },
            name: {
              type: 'string',
              description: 'Nome ou número da mesa'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do registro'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização'
            }
          }
        },
        TableSession: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da sessão'
            },
            table_id: {
              type: 'integer',
              description: 'ID da mesa relacionada'
            },
            opened_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de abertura da sessão'
            },
            closed_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de fechamento da sessão (null se estiver aberta)'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do registro'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização'
            }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do pedido'
            },
            table_session_id: {
              type: 'integer',
              description: 'ID da sessão da mesa'
            },
            product_id: {
              type: 'integer',
              description: 'ID do produto pedido'
            },
            quantity: {
              type: 'integer',
              description: 'Quantidade do produto'
            },
            price: {
              type: 'number',
              description: 'Preço do produto no momento do pedido'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do registro'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de erro'
            }
          }
        }
      }
    }
  },
  apis: [] 
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };