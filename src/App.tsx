import { useState, useEffect } from 'react'
import { Table, GetProp, TableProps, Select, Space } from 'antd'
import ComponentCodeEditor from './ComponentCodeEditor';

const App: React.FC = () => {

const [coinsData, setCoinsData] = useState<Coin[]>([])
const [loading, setLoading] = useState<boolean>(true);
const [currency, setCurrency] = useState<string>("usd");
const [order, setOrder] = useState<string>("desc");
const [tableParams, setTableParams] = useState<TableParams>({
  pagination: {
    current: 1,
    pageSize: 10,
    total: 10000,
  },
});

interface Coin {
    id: string,
    symbol: string;
    name: string;
    image: string;
    current_price: number | null;
    market_cap: number | null;
    market_cap_rank: number | null;
    fully_diluted_valuation: number | null;
    total_volume: number | null;
    high_24h: number | null;
    low_24h: number | null;
    price_change_24h: number | null;
    price_change_percentage_24h: number | null;
    market_cap_change_24h: number | null;
    market_cap_change_percentage_24h: number | null;
    circulating_supply: number | null;
    total_supply: number | null;
    max_supply: number | null;
    ath: number | null;
    ath_change_percentage: number | null;
    ath_date: string | null;
    atl: number | null;
    atl_change_percentage: number | null;
    atl_date: string | null;
    roi: ROI | null;
    last_updated: string | null;
}

interface ROI {
  times: number;
  currency: string;
  percentage: number;
}

interface Columns {
  title: string;
  dataIndex: string;
  key: React.Key;
  render?: (text: string, coin: Coin) => React.ReactNode;
}

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface TableParams {
  pagination?: TablePaginationConfig;
}

const columns: Columns[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text, coin) => (
      <div className="flex items-center">
        <img src={coin?.image} alt={`${text} icon`} className="w-6 h-6 mr-2" />
        <p> {text} </p>
      </div>
    ),
  },
  {
    title: 'Current Price',
    dataIndex: 'current_price',
    key: 'current_price',
    render: (text) => (
      <div className='flex items-center'>
        <p> {text} </p>
        <p className='pl-2'> {currency} </p>
      </div>
    )
  },
  {
    title: 'Circulating Supply',
    dataIndex: 'circulating_supply',
    key: 'circulating_supply',
  },
];

const handleTableChange: TableProps['onChange'] = (pagination) => {
  setTableParams({
    pagination,
  });

  if (pagination.pageSize !== tableParams.pagination?.pageSize) {
    setCoinsData([]);
  }
};

const handleChangeCurrency = (value: string) => {
  setCurrency(value);
};

const handleChangeOrder = (value: string) => {
  setOrder(value);
};

const fetchCoins = async () => {
  setLoading(true);
  try{
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_${order}&per_page=${tableParams.pagination?.pageSize}&page=${tableParams.pagination?.current}&sparkline=false`;
    
    const response = await fetch(url)
    
    if(!response.ok){
      throw new Error(`Can't get market coin data, error: ${response.status}`)
    }

    const data = await response.json()
    
    setCoinsData(data)
    setLoading(false);
    
  }catch (error) {
    setLoading(true);
    throw new Error(`Can't fecth the data, error: ${error}`)
  }
};

useEffect(() => {
  fetchCoins();
}, [
    tableParams.pagination?.current, 
    tableParams.pagination?.pageSize,
    currency,
    order,
  ]);

  return (
    <>
      <div className="min-h-screen w-full flex flex-col justify-center items-center">
        <h1 className="text-black text-[40px] pt-12"> Coins & Markets </h1>

        <Space wrap className='pt-4'>
          <Select
            defaultValue="usd"
            style={{ width: 200 }}
            onChange={handleChangeCurrency}
            options={[
              { value: 'usd', label: 'USD' },
              { value: 'eur', label: 'EUR' },
            ]}
          />

          <Select
            defaultValue="desc"
            style={{ width: 200 }}
            onChange={handleChangeOrder}
            options={[
              { value: 'desc', label: 'Market cap descending'},
              { value: 'asc', label: 'Market cap ascending'},
            ]}
          />
        </Space>
        
        <div className='w-11/12 py-8'>
          <Table
            dataSource={coinsData.map(coin => ({ ...coin, key: coin.id }))} 
            columns={columns} 
            pagination={tableParams.pagination}
            onChange={handleTableChange}
            loading={loading}
          />
        </div>

        <p className='text-black text-[36px] py-4'> App source code </p>

        <div className='w-11/12 text-black pb-4'>
          <ComponentCodeEditor/>
        </div>
      </div>
    </>
  )
}

export default App
