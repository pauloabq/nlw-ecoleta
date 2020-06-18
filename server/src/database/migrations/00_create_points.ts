//indicando que queremos usar o TIPO (não primitivo da linguagem ex:String, Integer... vamos usar o tipo Knex)
import Knex from 'knex'

//o parâmetro para os métodos up() e down() é a variável knex do tipo Knex (tipagem!)
export async function up(knex: Knex){
    // comando de criação da tabela
    return knex.schema.createTable('points', table => {
        table.increments('id').primary();  // campo auto increment / primary
        table.string('image').notNullable(); // string / não nulo
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('whatsapp').notNullable();
        table.decimal('latitude').notNullable();
        table.decimal('longitude').notNullable();
        table.string('city').notNullable();
        table.string('uf', 2).notNullable();    // string tamanho 2
    })
}

export async function down(knex: Knex){
// comando de deletar da tabela (voltar atrás - contrário do up)
    return knex.schema.dropTable('points');
}