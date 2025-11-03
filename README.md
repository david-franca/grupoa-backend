# Projeto Backend: API de Gestão de Alunos (NestJS)

Esta é a API RESTful de backend para o projeto de teste Full Stack de Gestão de Alunos. Construída com NestJS, TypeORM e PostgreSQL, esta API fornece todos os endpoints necessários para o cadastro, autenticação e gerenciamento de alunos e usuários, com um sistema de permissões robusto.

Este projeto foi desenvolvido de forma independente e serve como a fonte de dados para o **[Projeto Frontend (Vue.js)](https://grupoa-frontend.vercel.app)**.

## ✨ Funcionalidades Principais

* **Autenticação e Autorização (JWT):** Geração de JSON Web Tokens (JWT) no login, com *payload* contendo o `role` do usuário, e proteção de rotas usando Guards (`AuthGuard`).
* **Controle de Acesso Baseado em Função (RBAC):** Sistema de permissões com Roles (ex: `admin`, `user`) para controlar o acesso a endpoints críticos (ex: apenas `admin` pode criar ou excluir usuários e alunos).
* **CRUD Completo de Alunos:** Endpoints completos para Criar, Ler, Atualizar e Excluir (`C.R.U.D.`) alunos, usando `ra` (Registro Acadêmico) como identificador único.
* **Paginação e Busca Avançada:** O endpoint de listagem (`GET /students`) suporta paginação completa (`page`, `limit`), ordenação (`field`, `order`) e busca (`search`) em múltiplos campos usando `ILike`.
* **Validação de DTOs:** Uso de `class-validator` e `class-transformer` em todos os DTOs (`CreateStudentDto`, `UpdateStudentDto`) para garantir a integridade dos dados que entram na API.
* **Tratamento de Erros:** Respostas de erro claras e padronizadas (ex: `ConflictException` para RAs ou CPFs duplicados, `NotFoundException` para alunos não encontrados).
* **Testes Unitários (Jest):** Cobertura de testes completa para a lógica de negócios (`Service`) e a camada HTTP (`Controller`), com simulação (mocking) de dependências (Repository, Paginate).

## 💻 Pilha de Tecnologias

* **Framework:** [NestJS](https://nestjs.com/)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/) (configurado para usar `ILike`)
* **ORM:** [TypeORM](https://typeorm.io/)
* **Autenticação:** [JWT](https://jwt.io/) (via `@nestjs/jwt`) e [Passport.js](https://www.passportjs.org/)
* **Paginação:** [nestjs-typeorm-paginate](https://www.npmjs.com/package/nestjs-typeorm-paginate)
* **Validação:** [class-validator](https://github.com/typestack/class-validator)
* **Testes
