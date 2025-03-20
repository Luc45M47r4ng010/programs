class AddPlanoAndPacoteToAssinaturasServicoAdicionals < ActiveRecord::Migration[8.0]
  def change
    add_column :assinaturas_servico_adicionals, :plano_id, :bigint
    add_column :assinaturas_servico_adicionals, :pacote_id, :bigint

    # Adicionar índices para melhorar a performance
    add_index :assinaturas_servico_adicionals, :plano_id
    add_index :assinaturas_servico_adicionals, :pacote_id
  end
end