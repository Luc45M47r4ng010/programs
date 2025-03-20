Rails.application.routes.draw do
  resources :clientes, only: [:create, :index]
  resources :planos, only: [:index, :show, :create, :update, :destroy]
  resources :servicos, only: [:index, :create, :update, :destroy]
  resources :pacotes, only: [:index, :show, :create, :update, :destroy]
  resources :assinaturas_servico_adicionals, only: [:index]
  resources :assinaturas, only: [:index, :create]

  # Isso garante que todas as rotas desconhecidas renderizem o React
  root "home#index"
  get "*path", to: "home#index", constraints: ->(req) { !req.xhr? && req.format.html? }
end
