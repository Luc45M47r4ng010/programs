class ClientesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]
  
  def index
    @clientes = Cliente.all
    render json: @clientes.as_json(only: [:id, :nome, :idade])  # Retorna apenas o id e o nome
  end

  def create
    @cliente = Cliente.new(cliente_params)
    if @cliente.save
      render json: @cliente, status: :created
    else
      render json: @cliente.errors, status: :unprocessable_entity
    end
  end

  private

  def cliente_params
    params.require(:cliente).permit(:nome, :idade)
  end
end
