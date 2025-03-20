# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_03_11_200250) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "assinaturas", force: :cascade do |t|
    t.bigint "cliente_id", null: false
    t.bigint "plano_id"
    t.bigint "pacote_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cliente_id"], name: "index_assinaturas_on_cliente_id"
    t.index ["pacote_id"], name: "index_assinaturas_on_pacote_id"
    t.index ["plano_id"], name: "index_assinaturas_on_plano_id"
  end

  create_table "assinaturas_servico_adicionals", id: false, force: :cascade do |t|
    t.bigint "assinatura_id", null: false
    t.bigint "servico_adicional_id", null: false
    t.bigint "plano_id"
    t.bigint "pacote_id"
    t.index ["assinatura_id", "servico_adicional_id"], name: "index_assinaturas_servicos"
    t.index ["pacote_id"], name: "index_assinaturas_servico_adicionals_on_pacote_id"
    t.index ["plano_id"], name: "index_assinaturas_servico_adicionals_on_plano_id"
  end

  create_table "clientes", force: :cascade do |t|
    t.string "nome"
    t.integer "idade"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "pacotes", id: :serial, force: :cascade do |t|
    t.string "nome", null: false
    t.bigint "plano_id", null: false
    t.decimal "valor", precision: 10, scale: 2, null: false
    t.datetime "created_at", precision: nil, default: -> { "now()" }, null: false
    t.datetime "updated_at", precision: nil, default: -> { "now()" }, null: false
    t.index ["plano_id"], name: "index_pacotes_on_plano_id"
  end

  create_table "pacotes_servicos", id: false, force: :cascade do |t|
    t.bigint "pacote_id", null: false
    t.bigint "servico_adicional_id", null: false
    t.index ["pacote_id"], name: "index_pacotes_servicos_on_pacote_id"
    t.index ["servico_adicional_id"], name: "index_pacotes_servicos_on_servico_adicional_id"
  end

  create_table "planos", force: :cascade do |t|
    t.string "nome"
    t.decimal "valor"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "descricao"
  end

  create_table "servico_adicionals", force: :cascade do |t|
    t.string "nome"
    t.decimal "valor"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "assinaturas", "clientes"
  add_foreign_key "assinaturas", "planos"
  add_foreign_key "pacotes", "planos", name: "fk_pacotes_planos"
  add_foreign_key "pacotes_servicos", "servico_adicionals"
end
