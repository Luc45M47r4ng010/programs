class Plano < ApplicationRecord
    has_many :assinaturas
    has_many :pacotes
    validates :nome, presence: { message: "O nome é obrigatório" }
    validates :valor, presence: { message: "O valor é obrigatório" }, numericality: { greater_than: 0, message: "O valor deve ser maior que zero" }
end
  