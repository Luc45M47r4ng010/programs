class CreateServicoAdicionals < ActiveRecord::Migration[8.0]
  def change
    create_table :servico_adicionals do |t|
      t.string :nome
      t.decimal :valor

      t.timestamps
    end
  end
end
