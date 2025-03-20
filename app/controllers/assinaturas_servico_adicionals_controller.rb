# app/controllers/assinaturas_servico_adicionals_controller.rb
class AssinaturasServicoAdicionalsController < ApplicationController

  def index
        servicos_adicionals = AssinaturasServicoAdicional.all
        render json: servicos_adicionals
  end
end