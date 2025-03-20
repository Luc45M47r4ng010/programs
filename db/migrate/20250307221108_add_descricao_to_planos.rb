class AddDescricaoToPlanos < ActiveRecord::Migration[8.0]
  def change
    add_column :planos, :descricao, :string
  end
end
