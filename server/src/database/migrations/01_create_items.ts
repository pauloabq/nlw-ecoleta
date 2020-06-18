//indicando que queremos usar o TIPO (não primitivo da linguagem ex:String, Integer... vamos usar o tipo Knex)
import Knex from 'knex'

//o parâmetro para os métodos up() e down() é a variável knex do tipo Knex (tipagem!)
export async function up(knex: Knex){
    // comando de criação da tabela
    return knex.schema.createTable('items', table => {
        table.increments('id').primary();  // campo auto increment / primary
        table.string('image').notNullable(); // string / não nulo
        table.string('title').notNullable();    
    })
}

export async function down(knex: Knex){
// comando de deletar da tabela (voltar atrás - contrário do up)
    return knex.schema.dropTable('items');
}