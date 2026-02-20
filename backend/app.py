from flask import Flask
from controllers.calculadora_controller import calculadora_bp
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    
    # Habilita CORS para permitir peticiones desde el frontend
    CORS(app)

    # Registrar el blueprint de calculadora
    app.register_blueprint(calculadora_bp, url_prefix="/api/calculadora")

    @app.route("/")
    def inicio():
        return {"mensaje": "API de Calculadora funcionando!"}

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=False)



