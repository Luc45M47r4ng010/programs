class AssinaturasController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:index, :create]

  def index
    if params[:cliente_id]
      @assinaturas = Assinatura.includes(:cliente, :plano, :pacote, :servicos_adicionais)
                               .where(cliente_id: params[:cliente_id])
    else
      @assinaturas = Assinatura.includes(:cliente, :plano, :pacote, :servicos_adicionais)
    end
  
    render json: @assinaturas.to_json(
      include: {
        cliente: { only: [:id, :nome] },
        plano: { only: [:id, :nome, :valor] },
        pacote: {
          only: [:id, :nome, :valor],
          include: {
            plano: { only: [:id, :nome, :valor] } # Inclui o plano associado ao pacote
          }
        },
        servicos_adicionais: { only: [:id, :nome, :valor] }
      }
    )
  end

  def create
    @assinatura = Assinatura.new(assinatura_params)

    if @assinatura.save
      # Associa os serviços adicionais que estão fora do pacote
      if params[:assinatura][:servico_adicional_ids].present?
        params[:assinatura][:servico_adicional_ids].each do |servico_id|
          AssinaturasServicoAdicional.create(
            assinatura_id: @assinatura.id,
            servico_adicional_id: servico_id,
            pacote_id: @assinatura.pacote_id, # Passa o pacote_id, se existir
            plano_id: @assinatura.plano_id    # Passa o plano_id, se existir
          )
        end
      end

      render json: @assinatura, status: :created
    else
      render json: { errors: @assinatura.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def assinatura_params
    params.require(:assinatura).permit(:cliente_id, :plano_id, :pacote_id)
  end
end