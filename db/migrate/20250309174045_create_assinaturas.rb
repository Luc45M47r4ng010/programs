class CreateAssinaturas < ActiveRecord::Migration[6.0]
  def change
    create_table :assinaturas do |t|
      t.references :cliente, null: false, foreign_key: true
      t.references :plano, null: true, foreign_key: true
      t.references :pacote, null: true, foreign_key: true
      t.timestamps
    end

    # Criando a tabela de junção com índice renomeado para um nome mais curto
    create_join_table :assinaturas, :servico_adicionals do |t|
      t.index [:assinatura_id, :servico_adicional_id], name: 'index_assinaturas_servicos'
    end
  end
end
