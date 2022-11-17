const mysql = require("mysql");
const moment = require('moment');
const { duration } = require("moment");

const con = mysql.createConnection({
  host: "relational.fit.cvut.cz",
  user: "guest",
  password: "relational",
  database: "financial",
  port: 3306,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

// fazer insert dos 4 status padrões para usarmos os ids depois, respectivamente “Solicitação Pendente”, “Solicitação Aprovada”, "Empréstimo Realizado”, "Empréstimo Liquidado"

//percorre emprestimos existentes
con.query("select * from loan", function (err, loans) {
  if (err) throw err;
  for (const loan of loans) {
    //encontra cliente referente
    con.query(`select * from client inner join district d on d.district_id = client.district_id where client_id = (select client_id from disp where type = 'owner' and account_id = ${loan.account_id} limit 1) 
    `, function (err, client) {
      if (err) throw err;

      client = client[0]

      // objeto tratado para insert
      const dimensionClient = {
        idade: moment().diff(moment(client.birth_date), 'years') ,
        cidade:client.A2,
        estado:client.A3
      }

      //console.log(dimensionClient)
      // fazer o insert do client
    });


    // objeto tratado para insert
    const dimensionTime = {
      dia:moment(loan.date).format('DD'),
      dia_semana:moment(loan.date).day(),
      mes:moment(loan.date).format('MM'),
    }

    //console.log(dimensionTime)
    // fazer insert da dimensão tempo

    let status_id
    if (loan.status === 'A') {
      status_id = 1
    } 
    if (loan.status === 'B') {
      status_id = 2
    } 
    if (loan.status === 'C') {
      status_id = 3
    } 
    if (loan.status === 'D') {
      status_id = 4
    } 


     //encontra conta referente
     con.query(` select sum(amount) from trans where account_id = ${loan.account_id}`, function (err, account) {
       if (err) throw err;

        // objeto tratado para insert
        const dimensionAccount = {
          valor_total_movimentacao:"",
          idade_conta:10
        }
       dimensionAccount.valor_total_movimentacao = account[0]['sum(amount)']
       console.log(dimensionAccount)
       // fazer o insert da conta
     });
   

    //pegar o id de cada insert e inserir na tabela de fatos
    const factTable = {
      valor: loan.amount,
      duracao: loan.duration,
      status_id: status_id,
      client_id:"",
      conta_id:"",
      tempo_id:""
    }

    console.log(factTable)


  }
});
