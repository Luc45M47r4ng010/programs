class PacotesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create, :destroy, :update]
  before_action :set_pacote, only: %i[show update destroy]

  def index
    @pacotes = Pacote.includes(:plano, :servicos_adicionais).all

    render json: @pacotes.as_json(
      include: {
        plano: { only: [:id, :nome, :valor] },
        servicos_adicionais: { only: [:id, :nome, :valor] }
      }
    ).map { |p| p.merge("valor" => p["valor"].to_f) }  # Converte `valor` para Float
  end

  def create
    puts "Parâmetros recebidos:", params.inspect # Debug dos parâmetros
    @pacote = Pacote.new(pacote_params)
  
    if params[:pacote][:servicos_adicionais].present?
      @pacote.servicos_adicionais = ServicoAdicional.where(id: params[:pacote][:servicos_adicionais])
    end
  
    puts "Valor do pacote antes de salvar:", @pacote.valor # Debug do valor do pacote
  
    if @pacote.save
      render json: @pacote, status: :created
    else
      puts "Erros ao salvar pacote:", @pacote.errors.full_messages # Debug de erros
      render json: { errors: @pacote.errors.full_messages }, status: :unprocessable_entity
    end
  end
  

  def show
    render json: @pacote.as_json(
      include: {
        plano: { only: [:id, :nome, :valor] },
        servicos_adicionais: { only: [:id, :nome, :valor] }
      }
    )
  end

  def update
    if @pacote.update(pacote_params)
      render json: @pacote
    else
      render json: { errors: @pacote.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @pacote.destroy
    head :no_content
  end

  private

  def set_pacote
    @pacote = Pacote.find(params[:id])
  end

  def pacote_params
    params.require(:pacote).permit(:nome, :plano_id, :valor)
  end
end