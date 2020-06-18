//indicando que queremos usar o TIPO (não primitivo da linguagem ex:String, Integer... vamos usar o tipo Knex)
import Knex from 'knex'

//o parâmetro para os métodos up() e down() é a variável knex do tipo Knex (tipagem!)
export async function up(knex: Knex){
    // comando de criação da tabela
    return knex.schema.createTable('point_items', table => {
        table.increments('id').primary();  // campo auto increment / primary
        table.integer('point_id')
            .notNullable()
            .references('id')              // chave
            .inTable('points');
        table.integer('item_id')
            .notNullable()
            .references('id')
            .inTable('items');
    })
}

export async function down(knex: Knex){
// comando de deletar da tabela (voltar atrás - contrário do up)
    return knex.schema.dropTable('point_items');
}