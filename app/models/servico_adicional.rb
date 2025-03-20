class ServicoAdicional < ApplicationRecord
  has_and_belongs_to_many :pacotes, join_table: :pacotes_servicos
  has_many :assinaturas_servico_adicionals
  has_many :assinaturas, through: :assinaturas_servico_adicionals 

  validates :nome, presence: { message: "O nome é obrigatório" }
  validates :valor, presence: { message: "O valor é obrigatório" }, numericality: { greater_than: 0, message: "O valor deve ser maior que zero" }
end
