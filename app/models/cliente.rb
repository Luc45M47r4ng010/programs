class Cliente < ApplicationRecord
  # Validações
  has_many :assinaturas
  validates :nome, presence: { message: "não pode ficar em branco" }
  validates :idade, presence: {message: "não pode fica em branco"}, numericality: { greater_than_or_equal_to: 18, message: "deve ser maior ou igual a 18" }
end
