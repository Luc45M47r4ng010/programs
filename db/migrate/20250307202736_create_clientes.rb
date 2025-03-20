class CreateClientes < ActiveRecord::Migration[8.0]
  def change
    create_table :clientes do |t|
      t.string :nome
      t.integer :idade

      t.timestamps
    end
  end
end
