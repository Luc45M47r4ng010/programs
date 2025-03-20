class CreatePacotes < ActiveRecord::Migration[6.1]
  def change
    create_table :pacotes do |t|
      t.string :nome, null: false
      t.references :plano, null: false, foreign_key: true
      t.decimal :valor, precision: 10, scale: 2, null: false

      t.timestamps
    end

    create_table :pacotes_servicos, id: false do |t|
      t.references :pacote, null: false, foreign_key: true
      t.references :servico_adicional, null: false, foreign_key: { to_table: :servico_adicionals }
    end
  end
end
