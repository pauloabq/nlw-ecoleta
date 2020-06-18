import Knex from 'knex'

export async function seed(knex: Knex){
    await knex('items').insert([
        { title: 'Pilhas e Baterias', image: 'baterias.svg' },
        { title: 'Resíduos Eletrônicos', image: 'eletronicos.svg' },
        { title: 'Lâmpadas', image: 'lampadas.svg' },
        { title: 'Óleo de Cozinha', image: 'oleo.svg' },
        { title: 'Resíduos Orgânicos', image: 'organicos.svg' },
        { title: 'Papéis e papelão', image: 'papeis-papelao.svg' },

    ])
}
