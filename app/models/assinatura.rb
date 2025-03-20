class Assinatura < ApplicationRecord
  belongs_to :cliente
  belongs_to :plano, optional: true
  belongs_to :pacote, optional: true

  has_many :assinaturas_servico_adicionals
  has_and_belongs_to_many :servicos_adicionais, class_name: 'ServicoAdicional', join_table: :assinaturas_servico_adicionals

  # Validações
  validate :plano_or_pacote_present
  validate :no_duplicate_services, if: :pacote

  after_create :associate_pacote_services, if: :pacote

  private

  def plano_or_pacote_present
    unless plano_id.present? || pacote_id.present?
      errors.add(:base, "A assinatura deve ter um plano ou um pacote.")
    end
  end

  def no_duplicate_services
    if pacote && servicos_adicionais.any? { |s| pacote.servicos_adicionais.include?(s) }
      errors.add(:base, "Não pode repetir serviços do pacote.")
    end
  end

  def associate_pacote_services
    # Associa os serviços adicionais do pacote à assinatura
    pacote.servicos_adicionais.each do |servico|
      AssinaturasServicoAdicional.create(
        assinatura_id: self.id,
        servico_adicional_id: servico.id,
        pacote_id: self.pacote_id, # Registra o pacote_id
        plano_id: self.plano_id    # Registra o plano_id, se existir
      )
    end
  end
end