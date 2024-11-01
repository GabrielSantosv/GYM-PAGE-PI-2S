const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Permite requisições de diferentes origens
app.use(bodyParser.json());
app.use(express.static('public')); // Para servir arquivos estáticos

// Conectar ao Oracle Cloud
async function initializeDB() {
    try {
        await oracledb.createPool({
            user: 'ADMIN',         // Substitua pelo seu usuário
            password: 'SeTe-7__oito',       // Substitua pela sua senha
            connectString: '(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.sa-saopaulo-1.oraclecloud.com))(connect_data=(service_name=g5c71d58093d91e_integrador_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))' // Substitua pela sua string de conexão
        });
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    }
}

// Rota para cadastrar um aluno
app.post('/cadastrar-aluno', async (req, res) => {
    const { nome, sobrenome, data_nasc, cpf, email, telefone, genero, peso, altura } = req.body;

    try {
        const connection = await oracledb.getConnection();
        await connection.execute(
            `INSERT INTO alunos (nome, sobrenome, data_nasc, cpf, email, telefone, genero, peso, altura) 
            VALUES (:nome, :sobrenome, :data_nasc, :cpf, :email, :telefone, :genero, :peso, :altura)`,
            { nome, sobrenome, data_nasc, cpf, email, telefone, genero, peso, altura },
            { autoCommit: true }
        );
        res.status(200).json({ success: true });
        await connection.close();
    } catch (err) {
        console.error('Erro ao cadastrar aluno:', err);
        res.status(500).json({ success: false, message: 'Erro ao cadastrar aluno' });
    }
});

// Inicializar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    initializeDB(); // Conectar ao banco de dados
});