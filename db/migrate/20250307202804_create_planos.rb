class CreatePlanos < ActiveRecord::Migration[8.0]
  def change
    create_table :planos do |t|
      t.string :nome
      t.text :descricao
      t.decimal :valor

      t.timestamps
    end
  end
end
