class PlanosController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create, :destroy, :update]
  before_action :set_plano, only: [:update, :destroy]

  def index
    @planos = Plano.all
    render json: @planos
  end

  def create
    @plano = Plano.new(plano_params)
    if @plano.save
      render json: @plano, status: :created
    else
      render json: {errors: @plano.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def update
    if @plano.update(plano_params)
      render json: @plano
    else
      render json: {errors: @plano.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def destroy
    @plano.destroy
    render json: { message: "Plano excluído com sucesso" }, status: :ok
  end

  private

  def set_plano
    @plano = Plano.find(params[:id])
  end

  def plano_params
    params.require(:plano).permit(:nome, :descricao, :valor)
  end
end
