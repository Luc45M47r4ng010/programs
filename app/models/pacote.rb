class Pacote < ApplicationRecord
  belongs_to :plano
  has_and_belongs_to_many :servicos_adicionais, class_name: 'ServicoAdicional', join_table: :pacotes_servicos
  has_many :assinaturas
  has_many :pacotes_servicos
  has_many :servico_adicionals, through: :pacotes_servicos

  validates :nome, presence: true
  validates :plano, presence: true
  validates :valor, presence: true, numericality: { greater_than_or_equal_to: 0 }

end