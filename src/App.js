import React, {useState, useEffect} from 'react';
import ReactTable from 'react-table';
import './App.css';
import _ from 'lodash';
// import fetch from './api/dataService';

const DATA = [
  {
    custid: 1,
    name: "Acme",
    amt: 120,
    transactionDt: "05-01-2019"
  },
  {
    custid: 1,
    name: "Acme",
    amt: 75,
    transactionDt: "05-21-2019"
  },
  {
    custid: 1,
    name: "Acme",
    amt: 94,
    transactionDt: "05-21-2019"
  },
  {
    custid: 1,
    name: "Acme",
    amt: 10,
    transactionDt: "06-01-2019"
  },
  {
    custid: 1,
    name: "Acme",
    amt: 75,
    transactionDt: "06-21-2019"
  },
  {
    custid: 1,
    name: "Acme",
    amt: 200,
    transactionDt: "07-01-2019"
  },
  {
    custid: 1,
    name: "Acme",
    amt: 1,
    transactionDt: "07-04-2019"
  },
  {
    custid: 1,
    name: "Acme",
    amt: 80,
    transactionDt: "07-03-2019"
  },
  {
    custid: 1,
    name: "Acme",
    amt: 224,
    transactionDt: "07-21-2019"
  },
  {
    custid: 2,
    name: "Century",
    amt: 125,
    transactionDt: "05-01-2019"
  },
  {
    custid: 2,
    name: "Century",
    amt: 75,
    transactionDt: "05-21-2019"
  },
  {
    custid: 2,
    name: "Century",
    amt: 10,
    transactionDt: "06-01-2019"
  },
  {
    custid: 2,
    name: "Century",
    amt: 75,
    transactionDt: "06-21-2019"
  },
  {
    custid: 2,
    name: "Century",
    amt: 200,
    transactionDt: "07-01-2019"
  },
  {
    custid: 2,
    name: "Century",
    amt: 224,
    transactionDt: "07-21-2019"
  },
  {
    custid: 3,
    name: "Sallys Startup",
    amt: 120,
    transactionDt: "06-21-2019"
  }
]

const calculateResult = (incomingData) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const pointsGain = incomingData.map(transaction => {
    let points = 0;
    let over_100 = transaction.amt - 100;

    if (over_100 > 0) {
      points = points + (over_100 * 2);
    }
    if (transaction.amt > 50) {
      points = points + 50;
    }
    const month = new Date(transaction.transactionDt).getMonth();
    return {...transaction, points, month};
  });

  let customer = {};
  let pointsGainByCustomer = {};
  pointsGain.forEach(pointsGain => {
    let {custid, name, month, points} = pointsGain;
    if (!customer[custid]) customer[custid] = [];
    if (!pointsGainByCustomer[custid]) pointsGainByCustomer[name] = 0;
    pointsGainByCustomer[name] = pointsGainByCustomer[name] + points;
    if (customer[custid][month]) {
      customer[custid][month].points += points;
      customer[custid][month].monthNumber = month;
      customer[custid][month].transactionNumber++;
    } else {
      customer[custid][month] = {
        custid,
        name,
        monthNumber : month,
        month : months[month],
        transactionNumber : 1,
        points
      }
    }
  });
  let tot = [];
  // console.log(customer);
  for (let key in customer) {
    customer[key].forEach(val => {
      tot.push(val);
    });
  }

  let totByCustomer = [];
  for (let key in pointsGainByCustomer) {
    totByCustomer.push({
      name : key,
      points : pointsGainByCustomer[key]
    });
  }

  return {
    summaryByCustomer : tot,
    pointsGain,
    pointsGainByCustomer : totByCustomer
  };
}


const App = () => {
  const [transactionData, setTransactionData] = useState(null);

  const columns = [
    {
      Header : 'Customer',
      accessor : 'name'
    },
    {
      Header : 'Month',
      accessor : 'month'
    },
    {
      Header : '# of Transactions',
      accessor : 'transactionNumber'
    },
    {
      Header : 'Points Reward',
      accessor : 'points'
    }
  ];

  const totalByColumns = [
    {
      Header : 'Customer',
      accessor : 'name'
    },
    {
      Header : 'Points',
      accessor : 'points'
    }
  ];

  const getIndividualTransaction = (rowNumber) => {
    let byCusMonth = _.filter(transactionData.pointGain, (tRow) => {
      return rowNumber.original.custid === tRow.custid && rowNumber.original.monthNumber === tRow.month;
    });
    return byCusMonth;
  }

  useEffect(()=> {
    const res = calculateResult(DATA);
    setTransactionData(res);
  }, []);
  console.log(columns);
  // console.log(transactionData);

  if (transactionData === null) {
    return <div>Loading...</div>
  }

  return transactionData === null ? 
    <div>Loading...</div> 
      : (
    <div>      
      <div className="container">
        <div className="row">
          <div className="col-10">
            <h2>Points Rewards System Totals by Customer Months</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-8">
            <ReactTable
              data={transactionData.summaryByCustomer}
              defaultPageSize={5}
              columns={columns}
              Sunent={row => {
                return (
                  <div>
                      {getIndividualTransaction(row).map(tran=>{
                        return <div className="container">
                          <div className="row">
                            <div className="col-8">
                              <strong>Transaction Date:</strong> {tran.transactionDt} - <strong>$</strong>{tran.amt} - <strong>Points: </strong>{tran.points}
                            </div>
                          </div>
                        </div>
                      })}                                    

                  </div>
                )
              }}
              />             
            </div>
          </div>
        </div>
        
        <div className="container">    
          <div className="row">
            <div className="col-10">
              <h2>Points Rewards System Totals By Customer</h2>
            </div>
          </div>      
          <div className="row">
            <div className="col-8">
              <ReactTable
                data={transactionData.pointsGainByCustomer}
                columns={totalByColumns}
                defaultPageSize={5}                
              />
            </div>
          </div>
        </div>      
    </div>
      );
}

export default App;