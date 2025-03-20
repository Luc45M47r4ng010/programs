class ServicosController  < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create, :update, :destroy]
  before_action :set_servicos, only: [:update, :destroy]

  def index
    @servicos = ServicoAdicional.all
    render json: @servicos
  end

  def create
    @servicos = ServicoAdicional.new(servico_adicional_params)
    if @servicos.save
      render json: @servicos, status: :created
    else
      render json: {errors: @servicos.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def update
    if @servicos.update(servico_adicional_params)
      render json: @servicos
    else
      render json: {errors: @servicos.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def destroy
    @servicos.destroy
    render json: { message: "Serviço adicional excluído com sucesso" }, status: :ok
  end

  private

  def set_servicos
    @servicos = ServicoAdicional.find_by(id: params[:id])
    unless @servicos
      render json: { errors: "Serviço não encontrado" }, status: :not_found and return
    end
  end

  def servico_adicional_params
    params.require(:servico).permit(:nome, :valor)
  end
end
