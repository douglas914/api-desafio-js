Segunda versao da API
	Cumpre os requisitos de solicitacoes http para cada porta diferente, em JSON, e api em javascript.
	A segunda versao inicia a implementacao das funcionalidades de adicionar, deletar e atualizar portas
		
v2.1 - Permite adicionar portas pelo modelo curl -X PUT http://127.0.0.1:5000/porta30@1.3.6.1.2.1.2.2.1.8.1002 e atualizar, caso a porta ja exista com o mesmo nome

v2.2 - Permite deletar portas pelo modelo curl -X DELETE http://127.0.0.1:5000/porta11.2.2.1.8.1002
v2.3 - Salva os dados em um arquivo local

- Sem interatividade
- Sem docker
- Sem banco de dados
