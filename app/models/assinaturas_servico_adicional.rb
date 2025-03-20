# app/models/assinaturas_servico_adicional.rb
class AssinaturasServicoAdicional < ApplicationRecord
  belongs_to :assinatura
  belongs_to :servico_adicional
end